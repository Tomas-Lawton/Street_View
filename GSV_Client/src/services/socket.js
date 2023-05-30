import { io } from 'socket.io-client';

class SocketioService {
    constructor() {
        this.connected = false;
        this.socket = null;
    }
    setupSocketConnection(isUser = true) {
        this.socket = io(import.meta.env.NODE_ENV === "production" ?
            "https://ai-street-view.onrender.com" : "http://localhost:8080");
        this.socket.emit('login', isUser ? "User" : "Moderator");
        return this.socket
    }
    disconnect() {
        this.socket.disconnect();
        this.socket = null;
        this.connected = false;
    }
}

export default new SocketioService()