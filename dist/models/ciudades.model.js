"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
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
    }, { timestamps: false });
};
