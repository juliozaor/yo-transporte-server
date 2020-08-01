"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Chat-ConductorPasajero', {
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
    } /* , { timestamps: false} */);
};
