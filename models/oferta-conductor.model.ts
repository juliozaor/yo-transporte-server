import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Oferta-Conductores', {
    idOfertaConductor: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    codVehiculo: {
        type: DataTypes.UUID
    },
    comentarios: {
        type: DataTypes.STRING,       
    },
    fecha_salida: {
        type: DataTypes.DATEONLY,       
    },
    hora_salida: {
        type: DataTypes.TIME,       
    },
    origen: {
        type: DataTypes.STRING        
    },
    destino: {
        type: DataTypes.STRING        
    },
    tarifa: {
        type: DataTypes.STRING,
        defaultValue: '0'      
    },  
    cantPasajeros: {
        type: DataTypes.STRING        
    },   
    capacidadCarga: {
        type: DataTypes.STRING        
    },     
    paqueteriaMensajeria: {
        type: DataTypes.STRING        
    },
    terminada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false        
    }  
      
  }/* , { timestamps: false } */);
};



