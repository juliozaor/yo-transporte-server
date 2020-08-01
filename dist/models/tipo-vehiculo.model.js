"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tipo-Vehiculos', {
        idTipoVehiculo: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        detalle: {
            type: DataTypes.STRING
        }
    }, { timestamps: false });
};
