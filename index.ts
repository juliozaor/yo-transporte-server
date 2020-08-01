import Server from './clasess/server';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import cors from 'cors';



import conductorRoutes from './routes/conductor';
import userRoutes from './routes/usuario';
import vehiculoRoutes from './routes/vehiculo';
import propietarioRoutes from './routes/propietario';
import chatRoutes from './routes/chat';
import notificacionesRoutes from './routes/notificaciones';
//import conductorVehiculoRoutes from './routes/conductor-vehiculo';
//import ofertaConductorRoutes from './routes/oferta-conductor';

const Sequelize = require('sequelize');

const server = new Server();

// body parser
server.app.use(bodyParser.urlencoded({ extended: true}));
server.app.use(bodyParser.json());


//FileUpload
server.app.use( fileUpload({ useTempFiles: true }) );


// Configurar CORS 
server.app.use(cors({origin: true, credentials: true}) );




//Rutas
server.app.use('/user', userRoutes);
server.app.use('/conductor', conductorRoutes);
server.app.use('/propietario', propietarioRoutes);
server.app.use('/vehiculo', vehiculoRoutes);
server.app.use('/chat', chatRoutes);
server.app.use('/notificacion', notificacionesRoutes);
//server.app.use('/conductor-vehiculo', conductorVehiculoRoutes);
//server.app.use('/oferta-conductor', ofertaConductorRoutes);




// Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});

