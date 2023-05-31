import { io } from 'socket.io-client';
class SocketioService {
    constructor() {
        this.connected = false;
        this.socket = null;
    }
    setupSocketConnection(isUser = true) {
        const endpoint = process.env.NODE_ENV === "production" ?
            "https://ai-street-view.onrender.com" : "http://localhost:8080";
        const allowOrigin = "https://ai-street-view.onrender.com"

        this.socket = io(endpoint, { origins: allowOrigin } );
        this.socket.emit('login', isUser ? "User" : "Moderator");

        if (this.socket) {
            console.log("connected socket on: ", process.env.NODE_ENV)
        }
        return this.socket
    }
    disconnect() {
        this.socket.disconnect();
        this.socket = null;
        this.connected = false;
    }
}

export default new SocketioService()