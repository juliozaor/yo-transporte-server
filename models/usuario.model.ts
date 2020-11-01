import  { Sequelize, DataTypes, Model} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

 // Definicion del modelo Usuarios:
 module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Usuarios', {
    idUsuario: {       
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },        
    nombre: {
        type: DataTypes.STRING,
        //unique: true,
        validate: {
            notEmpty: {
                msg: "-> Falta nombre"
            }
        }/* ,
        unique: {
            args: true,
            msg: '-> ya existe un usuario con ese nombre'
        } */
    },
     cedula: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta el número de cédula"
                }
            },
            unique: {
                args: true,
                msg: '-> ya existe un usuario con esa cedula'
            }
        },
        telefono: {
            type: DataTypes.STRING
        },
    email: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: "-> Falta email"
            },
            isEmail: {
                msg: "-> Email no válido"
            }
        },
        unique: {
            args: true,
            msg: '-> ya existe un usuario con ese email'
        }
    },  
    
      password: {
          type: DataTypes.STRING,
          validate: {
              notEmpty: {
                  msg: "-> Falta password"
              }
          }
      }, 
    foto: {
        type: DataTypes.STRING,
        defaultValue: "av-1.png"        
    },
    idSignal: {
        type: DataTypes.UUID
    },
    ubicacion: {
        type: DataTypes.STRING   
    }
      
  });
};



