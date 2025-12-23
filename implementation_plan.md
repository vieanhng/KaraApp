# Implementation Plan - Karaoke Remote App

Building a high-end Karaoke application with a dual-device architecture: Display Device (DD) for video playback and Remote Controller (RC) for track management.

## 1. Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Real-time Engine**: Socket.io for instant synchronization between RC and DD.
- **Styling**: Vanilla CSS (Premium, dark-mode prioritized, glassmorphism).
- **Video Playback**: YouTube IFrame Player API.
- **Search API**: Unofficial YouTube Search API as specified.

## 2. Core Architecture
- **Session Management**: A central registry of active sessions mapping a 6-digit code to a `sessionId`.
- **State Synchronization**:
    - `queue`: Array of video objects.
    - `playbackState`: `{ videoId, status, currentTime }`.
- **Pages**:
    - `/`: Selection screen (Display vs. Remote).
    - `/display`: The TV interface. Generates and displays the connection code.
    - `/remote`: Mobile interface. Connection portal -> Search & Queue Control.

## 3. UI/UX Design Strategy
- **Display Device**: Focused on high visibility, cinematic typography, and smooth transitions. Background will feature a dynamic ambient glow based on the video thumbnail.
- **Remote Controller**: "App-like" feel with bottom navigation, touch-optimized search results, and swipe-to-remove actions for the queue.

## 4. Phase-wise Implementation

### Phase 1: Foundation & Socket Server
- Initialize Next.js project.
- Set up a custom server to host Socket.io or use a standalone node process.
- Implement basic session logic (generate code, join session).

### Phase 2: Remote Controller Features
- UI for connection (6-digit input).
- Search interface calling the YouTube API.
- "Add to Queue" functionality.
- Queue management (reorder/delete).

### Phase 3: Display Device & Playback
- Connect to session and display the code.
- YouTube IFrame integration.
- Auto-play next in queue logic.
- Real-time command handling (Play/Pause/Skip).

### Phase 4: Polish & Performance
- Smooth animations for queue changes.
- Mobile optimization (PWA-ready).
- Error handling for API timeouts and connection drops.
