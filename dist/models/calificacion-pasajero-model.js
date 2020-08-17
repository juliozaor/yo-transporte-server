"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
module.exports = function (sequelize, DataTypes) {
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
