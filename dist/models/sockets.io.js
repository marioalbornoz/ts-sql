"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sockets = void 0;
class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }
    socketEvents() {
        // On connection
        this.io.on('connection', (socket) => {
            // Escuchar evento: mensaje-to-server
            socket.on('logs', (data) => {
                console.log(data);
                this.io.emit('current-logs', data);
            });
        });
    }
}
exports.Sockets = Sockets;
//# sourceMappingURL=sockets.io.js.map