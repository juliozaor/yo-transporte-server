import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pasajeros', {
    idPasajero: {
      type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoincremente: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        
    }   
      
  }/* , { timestamps: false} */);
};



