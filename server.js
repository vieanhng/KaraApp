const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3001;

// Session storage
// Map<code, session>
const sessions = new Map();

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // --- Display Device Handlers ---

    socket.on('create-session', (existingCode) => {
        let code = existingCode;

        // If an existing code is provided and the session exists, try to rebind
        if (code && sessions.has(code)) {
            const session = sessions.get(code);
            // Rebind to new socket ID
            session.displaySocketId = socket.id;
            socket.join(code);
            socket.emit('session-created', { code, queue: session.queue, playbackState: session.playbackState });
            console.log(`Session re-bound: ${code}`);
            return;
        }

        // Otherwise, generate new or if code doesn't exist anymore
        if (!code || !/^\d{6}$/.test(code)) {
            code = generateCode();
            while (sessions.has(code)) {
                code = generateCode();
            }
        }

        const session = {
            id: socket.id,
            code,
            displaySocketId: socket.id,
            remoteSocketId: null,
            queue: [],
            playbackState: {
                currentVideo: null,
                isPlaying: false,
                currentTime: 0,
            },
        };

        sessions.set(code, session);
        socket.join(code);
        socket.emit('session-created', { code, queue: [], playbackState: session.playbackState });
        console.log(`Session created: ${code}`);
    });

    socket.on('reset-session', (code) => {
        if (sessions.has(code)) {
            console.log(`Session reset: ${code}`);
            const session = sessions.get(code);
            // Clean up room for everyone except display? Actually just notify
            io.to(code).emit('display-disconnected');
            sessions.delete(code);
            // Create a new one immediately
            const newCode = generateCode();
            socket.emit('session-created', { code: newCode, queue: [], playbackState: { currentVideo: null, isPlaying: false } });

            const newSession = {
                id: socket.id,
                code: newCode,
                displaySocketId: socket.id,
                remoteSocketId: null,
                queue: [],
                playbackState: { currentVideo: null, isPlaying: false, currentTime: 0 }
            };
            sessions.set(newCode, newSession);
            socket.join(newCode);
        }
    });

    // --- Remote Controller Handlers ---

    socket.on('join-session', (code) => {
        const session = sessions.get(code);

        if (!session) {
            socket.emit('error', 'Phiên làm việc không tồn tại.');
            return;
        }

        if (session.remoteSocketId) {
            socket.emit('error', 'Phiên này đã có người điều khiển.');
            return;
        }

        session.remoteSocketId = socket.id;
        socket.join(code);

        // Notify both
        socket.emit('joined-success', {
            queue: session.queue,
            playbackState: session.playbackState
        });
        io.to(session.displaySocketId).emit('remote-connected');

        console.log(`Remote connected to session: ${code}`);
    });

    // --- Shared Actions ---

    socket.on('add-to-queue', ({ code, item }) => {
        const session = sessions.get(code);
        if (!session) return;

        session.queue.push(item);
        io.to(code).emit('queue-updated', session.queue);
    });

    socket.on('remove-from-queue', ({ code, index }) => {
        const session = sessions.get(code);
        if (!session) return;

        session.queue.splice(index, 1);
        io.to(code).emit('queue-updated', session.queue);
    });

    socket.on('reorder-queue', ({ code, newQueue }) => {
        const session = sessions.get(code);
        if (!session) return;

        session.queue = newQueue;
        io.to(code).emit('queue-updated', session.queue);
    });

    socket.on('update-playback', ({ code, state }) => {
        const session = sessions.get(code);
        if (!session) return;

        session.playbackState = { ...session.playbackState, ...state };
        // Broadcast to others in the room
        socket.to(code).emit('playback-updated', session.playbackState);
    });

    socket.on('player-command', ({ code, command, data }) => {
        // RC sends commands like 'play', 'pause', 'skip', 'seek'
        io.to(code).emit('player-command', { command, data });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Clean up sessions
        for (const [code, session] of sessions.entries()) {
            if (session.displaySocketId === socket.id) {
                // We don't delete immediately to allow for refresh/reconnect
                // But we notify RR
                io.to(code).emit('display-disconnected');
                // Set a timeout to delete? For now, keep it to allow re-binding
                setTimeout(() => {
                    const currentSession = sessions.get(code);
                    if (currentSession && currentSession.displaySocketId === socket.id) {
                        sessions.delete(code);
                        console.log(`Session ${code} cleaned up after timeout`);
                    }
                }, 30000); // 30 seconds grace period
                console.log(`Display disconnected from ${code}, waiting for potential reconnect...`);
            } else if (session.remoteSocketId === socket.id) {
                session.remoteSocketId = null;
                io.to(session.displaySocketId).emit('remote-disconnected');
                console.log(`Remote disconnected from session ${code}`);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
});
