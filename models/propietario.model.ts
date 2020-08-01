import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Propietarios', {
    idPropietario: {
      type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    runt: {
        type: DataTypes.STRING        
    } 
      
  }/* , { timestamps: false} */);
};