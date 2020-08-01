import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tipo-Vehiculos', {
    idTipoVehiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    detalle: {
        type: DataTypes.STRING
        
    }   
      
  }, { timestamps: false});
};



