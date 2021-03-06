"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Conductor-OfertaPasajero', {
        idConductorOfertaPasajero: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        codOfertaPasajero: {
            type: DataTypes.UUID
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        valor: {
            type: DataTypes.STRING
        },
        aceptada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};
