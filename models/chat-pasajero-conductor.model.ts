import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chat-PasajeroConductor', {
    idchatPasajeroConductor: {
      type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE
    },
    origen: {
        type: DataTypes.STRING        
    },
    mensaje: {
        type: DataTypes.STRING        
    }
      
  }/* , { timestamps: false} */);
};



