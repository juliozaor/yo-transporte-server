import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');


 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Calificacion-Pasajero', {
    idCalificacion: {
      type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoincremente: false
    },
    puntualidad: {
        type: DataTypes.INTEGER,
        defaultValue: 5
        
    },
    atencion: {
        type: DataTypes.INTEGER,
        defaultValue: 5
        
    } 
      
  });
};