"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modelos = require('./models');
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
var vapid = require('./vapid.json');
var URLSafeBase64 = require('urlsafe-base64');
var fs = require('fs');
var webpush = require('web-push');
var suscripciones = require('./subs-db.json');
webpush.setVapidDetails('mailto:julio.jimenez@cun.edu.co', vapid.publicKey, vapid.privateKey);
module.exports.getKey = function () {
    return URLSafeBase64.decode(vapid.publicKey);
};
module.exports.addSubscription = function (suscripcion) {
    suscripciones.push(suscripcion);
    fs.writeFileSync(__dirname + "/subs-db.json", JSON.stringify(suscripciones));
};
module.exports.sendPush = function (post, destino, idDestino, ciudad) {
    if (idDestino === void 0) { idDestino = ""; }
    var ciudadDestino;
    var notificacionesEnviadas = [];
    suscripciones.forEach(function (suscripcion, i) {
        if (idDestino !== "") {
            if (suscripcion.usuario === idDestino) {
                var pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post))
                    .then(console.log('Notificación enviada'))
                    .catch(function (err) {
                    console.log('La notificación falló');
                    if (err.statusCode === 410) { // GONE, ya no existe
                        suscripciones[i].borrar = true;
                    }
                });
                notificacionesEnviadas.push(pushProm);
            }
        }
        else {
            if (destino === 'i') {
                modelos.Conductores.findAll({ where: { esInterurbano: '1' } }).then(function (conductorDB) {
                    conductorDB.forEach(function (conductor) {
                        modelos.Usuarios.findOne({
                            attributes: ['codCiudad'],
                            where: { idUsuario: conductor.idConductor }
                        }).then(function (usuarioDB) {
                            ciudadDestino = usuarioDB.codCiudad;
                            if (suscripcion.usuario === conductor.idConductor && ciudadDestino == ciudad) {
                                var pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post))
                                    .then(console.log('Notificación enviada'))
                                    .catch(function (err) {
                                    console.log('La notificación falló');
                                    if (err.statusCode === 410) { // GONE, ya no exist
                                        suscripciones[i].borrar = true;
                                    }
                                });
                                notificacionesEnviadas.push(pushProm);
                            }
                        });
                    });
                });
            }
            else {
                modelos.Conductores.findAll({ where: { esInterurbano: '0' } }).then(function (conductorDB) {
                    conductorDB.forEach(function (conductor) {
                        modelos.Usuarios.findOne({
                            attributes: ['codCiudad'],
                            where: { idUsuario: conductor.idConductor }
                        }).then(function (usuarioDB) {
                            if (suscripcion.usuario === conductor.idConductor && ciudadDestino == ciudad) {
                                var pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post))
                                    .then(console.log('Notificación enviada'))
                                    .catch(function (err) {
                                    console.log('La notificación falló');
                                    if (err.statusCode === 410) { // GONE, ya no existe
                                        suscripciones[i].borrar = true;
                                    }
                                });
                                notificacionesEnviadas.push(pushProm);
                            }
                        });
                    });
                });
            }
        }
    });
    Promise.all(notificacionesEnviadas).then(function () {
        suscripciones = suscripciones.filter(function (subs) { return !subs.borrar; });
        fs.writeFileSync(__dirname + "/subs-db.json", JSON.stringify(suscripciones));
    });
};
