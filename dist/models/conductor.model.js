"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Conductores', {
        idConductor: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        licencia: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "-> Falta la licencia"
                }
            },
            unique: {
                args: true,
                msg: '-> ya existe un usuario con esta licencia'
            }
        },
        foto1Licencia: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        foto2Licencia: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        ciudad: {
            type: DataTypes.STRING
        },
        direccion: {
            type: DataTypes.STRING
        },
        esInterUrbano: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ciudadOrigen: {
            type: DataTypes.STRING
        },
        ciudadDestino: {
            type: DataTypes.STRING
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    } /* , { timestamps: false } */);
};
