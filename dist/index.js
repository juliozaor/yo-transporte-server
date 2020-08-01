"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./clasess/server"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var cors_1 = __importDefault(require("cors"));
var conductor_1 = __importDefault(require("./routes/conductor"));
var usuario_1 = __importDefault(require("./routes/usuario"));
var vehiculo_1 = __importDefault(require("./routes/vehiculo"));
var propietario_1 = __importDefault(require("./routes/propietario"));
var chat_1 = __importDefault(require("./routes/chat"));
var notificaciones_1 = __importDefault(require("./routes/notificaciones"));
//import conductorVehiculoRoutes from './routes/conductor-vehiculo';
//import ofertaConductorRoutes from './routes/oferta-conductor';
var Sequelize = require('sequelize');
var server = new server_1.default();
// body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// Configurar CORS 
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas
server.app.use('/user', usuario_1.default);
server.app.use('/conductor', conductor_1.default);
server.app.use('/propietario', propietario_1.default);
server.app.use('/vehiculo', vehiculo_1.default);
server.app.use('/chat', chat_1.default);
server.app.use('/notificacion', notificaciones_1.default);
//server.app.use('/conductor-vehiculo', conductorVehiculoRoutes);
//server.app.use('/oferta-conductor', ofertaConductorRoutes);
// Levantar express
server.start(function () {
    console.log("Servidor corriendo en puerto " + server.port);
});
