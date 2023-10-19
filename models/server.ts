import express, { Application, Express } from 'express';
import userRoutes from '../routes/usuario.routes';
import cors from 'cors';
import { createServer } from "http";
import { Server as Servio } from "socket.io";


import db from '../db/connection';
import { Sockets } from './sockets.io';



class Server {
    
    private app: Application;
    // private server: Express;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios'
    }
    io: any;


    constructor() {
        this.app  = express();
        this.port = process.env.PORT ?? '8000';
        this.httpServer = createServer(this.app);

        // Métodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();

        // Configuraciones de sockets
        this.io = new Servio( this.httpServer, { /* configuraciones */ } );
        this.configurarSockets();
    }

    async dbConnection() {

        try {
            
            await db.authenticate();
            console.log('Database online');

        } catch (error: any) {
            throw new Error( error );
        }

    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura del body
        this.app.use( express.json() );

        // Carpeta pública
        this.app.use( express.static('public') );
    }


    routes() {
        this.app.use( this.apiPaths.usuarios, userRoutes )
    }

    configurarSockets() {
        new Sockets( this.io );
    }


    listen() {
        this.httpServer.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port );
        })
    }

}

export default Server;