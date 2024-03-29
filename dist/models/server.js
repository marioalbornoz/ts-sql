"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuario_routes_1 = __importDefault(require("../routes/usuario.routes"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const connection_1 = __importDefault(require("../db/connection"));
const sockets_io_1 = require("./sockets.io");
class Server {
    constructor() {
        var _a;
        this.apiPaths = {
            usuarios: '/api/usuarios'
        };
        this.app = express_1.default();
        this.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8000';
        this.httpServer = http_1.createServer(this.app);
        // Métodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
        // Configuraciones de sockets
        this.io = new socket_io_1.Server(this.httpServer, { /* configuraciones */});
        this.configurarSockets();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Database online');
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    middlewares() {
        // CORS
        this.app.use(cors_1.default());
        // Lectura del body
        this.app.use(express_1.default.json());
        // Carpeta pública
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.usuarios, usuario_routes_1.default);
    }
    configurarSockets() {
        new sockets_io_1.Sockets(this.io);
    }
    listen() {
        this.httpServer.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map