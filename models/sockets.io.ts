import { Server, Socket } from "socket.io";


export class Sockets {
    io: any;

    constructor( io: Server ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket: Socket  ) => {

            // Escuchar evento: mensaje-to-server
            socket.on('logs', ( data ) => {
                console.log( data );
                
                this.io.emit('current-logs', data );
            });
            
        
        });
    }


}