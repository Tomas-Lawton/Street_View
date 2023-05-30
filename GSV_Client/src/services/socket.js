import { io } from 'socket.io-client';
class SocketioService {
    constructor() {
        this.connected = false;
        this.socket = null;
    }
    setupSocketConnection(isUser = true) {
        console.log(process.env.NODE_ENV)
        this.socket = io(process.env.NODE_ENV === "production" ?
            "http://ai-street-view.onrender.com:10000" : "http://localhost:8080");
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