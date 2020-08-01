"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Vehiculos', {
        idVehiculo: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        modelo: {
            type: DataTypes.STRING,
        },
        placa: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "-> Falta la placa"
                }
            },
            unique: {
                args: true,
                msg: '-> ya existe un vehiculo con esta placa'
            }
        },
        foto1: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        foto2: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        foto3: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        foto4: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        foto5: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        numeroSoat: {
            type: DataTypes.STRING,
        },
        f1Soat: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        f2Soat: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        numeroTP: {
            type: DataTypes.STRING,
        },
        f1TP: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        },
        f2TP: {
            type: DataTypes.STRING,
            defaultValue: "400x250.jpg"
        }
    } /* , { timestamps: false } */);
};
