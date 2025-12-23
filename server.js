const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

nextApp.prepare().then(() => {
    const app = express();
    app.use(cors());

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    const sessions = new Map();

    function generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    io.on('connection', (socket) => {
        console.log('✅ Socket.IO client connected:', socket.id);
        socket.on('create-session', (existingCode) => {
            let code = existingCode;
            if (code && sessions.has(code)) {
                const session = sessions.get(code);
                session.displaySocketId = socket.id;
                socket.join(code);
                socket.emit('session-created', { code, queue: session.queue, playbackState: session.playbackState });
                return;
            }
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
                playbackState: { currentVideo: null, isPlaying: false, currentTime: 0 },
            };
            sessions.set(code, session);
            socket.join(code);
            socket.emit('session-created', { code, queue: [], playbackState: session.playbackState });
        });

        socket.on('join-session', (code) => {
            const session = sessions.get(code);
            if (!session) {
                socket.emit('error', 'Phiên làm việc không tồn tại.');
                return;
            }
            session.remoteSocketId = socket.id;
            socket.join(code);
            socket.emit('joined-success', { queue: session.queue, playbackState: session.playbackState });
            io.to(session.displaySocketId).emit('remote-connected');
        });

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

        socket.on('update-playback', ({ code, state }) => {
            const session = sessions.get(code);
            if (!session) return;
            session.playbackState = { ...session.playbackState, ...state };
            socket.to(code).emit('playback-updated', session.playbackState);
        });

        socket.on('player-command', ({ code, command, data }) => {
            io.to(code).emit('player-command', { command, data });
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket.IO client disconnected:', socket.id);
            for (const [code, session] of sessions.entries()) {
                if (session.displaySocketId === socket.id) {
                    io.to(code).emit('display-disconnected');
                    setTimeout(() => {
                        const currentSession = sessions.get(code);
                        if (currentSession && currentSession.displaySocketId === socket.id) {
                            sessions.delete(code);
                        }
                    }, 30000);
                } else if (session.remoteSocketId === socket.id) {
                    session.remoteSocketId = null;
                    io.to(session.displaySocketId).emit('remote-disconnected');
                }
            }
        });
    });

    app.use((req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Unified Server ready on ${PORT}`);
    });
});
