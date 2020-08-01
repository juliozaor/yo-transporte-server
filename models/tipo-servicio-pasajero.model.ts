import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tipo-Servicio-Pasajeros', {
    idTipoServicio: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING
        
    }   
      
  }, { timestamps: false});
};



