import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pasajero-OfertaConductor', {
    idPasajeroOfertaConductor: {
      type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    codOfertaConductor: {
      type: DataTypes.UUID
  },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        
    },
    valor: {
      type: DataTypes.STRING
    },
    aceptada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        
    }
      
  }
  /* , { timestamps: false} */);
};



