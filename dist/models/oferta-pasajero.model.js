"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
// Definicion del modelo Usuarios:
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Oferta-Pasajeros', {
        idOfertaPasajero: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        destino: {
            type: DataTypes.STRING
        },
        tarifa: {
            type: DataTypes.STRING,
            defaultValue: '0'
        },
        comentarios: {
            type: DataTypes.STRING,
        },
        aire: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        musica: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        asientos: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        cantBolsas: {
            type: DataTypes.STRING
        },
        peso_kilos: {
            type: DataTypes.STRING
        },
        peso: {
            type: DataTypes.STRING
        },
        origen: {
            type: DataTypes.STRING
        },
        pasajeros: {
            type: DataTypes.STRING
        },
        fecha: {
            type: DataTypes.DATEONLY,
        },
        horaInicial: {
            type: DataTypes.TIME
        },
        horaFinal: {
            type: DataTypes.TIME
        },
        maleta: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        terminada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    } /* , { timestamps: false }  */);
};
