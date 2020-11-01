import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ciudades', {
    id: {
        type: DataTypes.INTEGER,
          primaryKey: true,
          autoincremente: true
      },
    idDepartamento: {
        type: DataTypes.INTEGER  
    },
    departamento: {
        type: DataTypes.STRING  
    },
    ciudad: {
        type: DataTypes.STRING        
    }
      
  } , { timestamps: false} );
};
