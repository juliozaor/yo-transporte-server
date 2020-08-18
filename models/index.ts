import  { Sequelize} from 'sequelize';
import { any } from 'sequelize/types/lib/operators';
const sequelize = new Sequelize('mysql::memory:');
const path = require('path');



// Conectar DB

const connection = new Sequelize('heroku_9bc16b20cb2808f', 'b658891ac52cb3', '9e0288d8', {
  host: 'us-cdbr-east-02.cleardb.com',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }

});

/* const connection = new Sequelize('db_yo_transporte', 'julio', '123456', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  
  }); */
  /* const connection = new Sequelize('db_yotransporto', 'usr_yotransporto', 'Nbv9!uo1k8*-', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  
  }); */


  connection.authenticate()
  .then(() => {
    console.log('DB Conectada')
  })
  .catch( err => {
    console.log(err, 'No se conecto')
  }) 


// Importar modelos.

const Usuarios = connection.import(path.join(__dirname,'usuario.model'));
const Pasajeros = connection.import(path.join(__dirname,'pasajero.model'));
const Conductores = connection.import(path.join(__dirname,'conductor.model'));
const Propietarios = connection.import(path.join(__dirname,'propietario.model'));
const Vehiculos = connection.import(path.join(__dirname,'vehiculo.model'));
const TipoVehiculos = connection.import(path.join(__dirname,'tipo-vehiculo.model'));
const ConductorVehiculos = connection.import(path.join(__dirname,'conductor-vehiculo.model'));
const TipoServicioConductores = connection.import(path.join(__dirname,'tipo-servicio-conductor.model'));
const OfertaConductores = connection.import(path.join(__dirname,'oferta-conductor.model'));
const PasajeroOfertaConductores = connection.import(path.join(__dirname,'pasajero-oferta-conductor.model'));
const ChatPasajeroConductores = connection.import(path.join(__dirname,'chat-pasajero-conductor.model'));

const OfertaPasajeros = connection.import(path.join(__dirname,'oferta-pasajero.model'));
const TipoServicioPasajeros = connection.import(path.join(__dirname,'tipo-servicio-pasajero.model'));
const ConductorOfertaPasajero = connection.import(path.join(__dirname,'conductor-oferta-pasajero.model')); 
const ChatConductoresPasajero = connection.import(path.join(__dirname,'chat-conductor-pasajero.model'));

const CalificacionConductor = connection.import(path.join(__dirname,'calificacion-conductor-model'));
const CalificacionPasajero = connection.import(path.join(__dirname,'calificacion-pasajero-model'));


//Relaciones entre tablas

Usuarios.hasOne(Pasajeros, { foreignKey: 'idPasajero'});
Pasajeros.belongsTo(Usuarios, { foreignKey: 'idPasajero'});

Usuarios.hasOne(Conductores, { foreignKey: 'idConductor'});
Conductores.belongsTo(Usuarios, { foreignKey: 'idConductor'});

Usuarios.hasOne(Propietarios, { foreignKey: 'idPropietario'});
Propietarios.belongsTo(Usuarios, { foreignKey: 'idPropietario'});

Propietarios.hasMany(Vehiculos, { foreignKey: 'codPropietario' });
Vehiculos.belongsTo(Propietarios, { foreignKey: 'codPropietario' });

TipoVehiculos.hasMany(Vehiculos, { foreignKey: 'codTipoVehiculo' });
Vehiculos.belongsTo(TipoVehiculos, { foreignKey: 'codTipoVehiculo' });

TipoVehiculos.hasMany(Vehiculos, { foreignKey: 'codTipoVehiculo' });
Vehiculos.belongsTo(TipoVehiculos, { foreignKey: 'codTipoVehiculo' });

Vehiculos.hasMany(ConductorVehiculos, { foreignKey: 'codVehiculo' });
ConductorVehiculos.belongsTo(Vehiculos, { foreignKey: 'codVehiculo' });

Conductores.hasMany(ConductorVehiculos, { foreignKey: 'codConductor' });
ConductorVehiculos.belongsTo(Conductores, { foreignKey: 'codConductor' });

TipoServicioConductores.hasMany(OfertaConductores, { foreignKey: 'codTipoServicio' });
OfertaConductores.belongsTo(TipoServicioConductores, { foreignKey: 'codTipoServicio' });

Conductores.hasMany(OfertaConductores, { foreignKey: 'codConductor' });
OfertaConductores.belongsTo(Conductores, { foreignKey: 'codConductor' });

OfertaConductores.hasMany(PasajeroOfertaConductores, { foreignKey: 'codOfertaConductor' });
PasajeroOfertaConductores.belongsTo(OfertaConductores, { foreignKey: 'codOfertaConductor' });

Pasajeros.hasMany(PasajeroOfertaConductores, { foreignKey: 'codPasajero' });
PasajeroOfertaConductores.belongsTo(Pasajeros, { foreignKey: 'codPasajero' });

PasajeroOfertaConductores.hasMany(ChatPasajeroConductores, { foreignKey: 'codPasajeroOfertaConductor' });
ChatPasajeroConductores.belongsTo(PasajeroOfertaConductores, { foreignKey: 'codPasajeroOfertaConductor' });


TipoServicioPasajeros.hasMany(OfertaPasajeros, { foreignKey: 'codTipoServicio' });
OfertaPasajeros.belongsTo(TipoServicioPasajeros, { foreignKey: 'codTipoServicio' });

Pasajeros.hasMany(OfertaPasajeros, { foreignKey: 'codPasajero' });
OfertaPasajeros.belongsTo(Pasajeros, { foreignKey: 'codPasajero' });

Conductores.hasMany(ConductorOfertaPasajero, { foreignKey: 'codConductor' });
ConductorOfertaPasajero.belongsTo(Conductores, { foreignKey: 'codConductor' });

ConductorOfertaPasajero.hasMany(ChatConductoresPasajero, { foreignKey: 'codConductorOfertaPasajero' });
ChatConductoresPasajero.belongsTo(ConductorOfertaPasajero, { foreignKey: 'codConductorOfertaPasajero' });


Conductores.hasMany(CalificacionConductor, { foreignKey: 'codConductor' });
CalificacionConductor.belongsTo(Conductores, { foreignKey: 'codConductor' });

Pasajeros.hasMany(CalificacionPasajero, { foreignKey: 'codPasajero' });
CalificacionPasajero.belongsTo(Pasajeros, { foreignKey: 'codPasajero' });


const modificar: boolean = false;

// Crear tablas pendientes:
connection.sync({force:modificar}) //  Si esta true, borra las tablas si estan creadas
.then(function(err) {
    console.log('Tablas y modelos creados correctamente');
    if(modificar){
      TipoVehiculos.create({ idTipoVehiculo: "1", detalle: "Bicileta" });
      TipoVehiculos.create({ idTipoVehiculo: "2", detalle: "Moto" });
      TipoVehiculos.create({ idTipoVehiculo: "3", detalle: "Automovil" });
      TipoVehiculos.create({ idTipoVehiculo: "4", detalle: "Camión" }); 
      
      TipoServicioConductores.create({ idTipoServicio: "1", nombre: "Ciudad" }); 
      TipoServicioConductores.create({ idTipoServicio: "2", nombre: "Interurbano" });
      TipoServicioConductores.create({ idTipoServicio: "3", nombre: "Envio" });
      TipoServicioConductores.create({ idTipoServicio: "4", nombre: "Mercancia" });
  
      TipoServicioPasajeros.create({ idTipoServicio: "1", nombre: "Ciudad" }); 
      TipoServicioPasajeros.create({ idTipoServicio: "2", nombre: "Interurbano" });
      TipoServicioPasajeros.create({ idTipoServicio: "3", nombre: "Envio" });
      TipoServicioPasajeros.create({ idTipoServicio: "4", nombre: "Mercancia" });
    }
    
  }, function (err) {
    console.log('Algo no fue bien: ', err);
  });




// Exportar modelos:

exports.Usuarios = Usuarios;
exports.Conductores = Conductores;
exports.Vehiculos = Vehiculos;
exports.Pasajeros = Pasajeros;
exports.Propietarios = Propietarios;
exports.ConductorVehiculos = ConductorVehiculos;

exports.OfertaConductores = OfertaConductores;
exports.PasajeroOfertaConductores = PasajeroOfertaConductores;
exports.ChatPasajeroConductores = ChatPasajeroConductores;

exports.OfertaPasajeros = OfertaPasajeros;
exports.ConductorOfertaPasajero = ConductorOfertaPasajero;
exports.ChatConductoresPasajero = ChatConductoresPasajero;


exports.CalificacionConductor = CalificacionConductor;
exports.CalificacionPasajero = CalificacionPasajero;
//exports.conductores_vehiculos = conductores_vehiculos;
//module.exports = conductores_vehiculos;
