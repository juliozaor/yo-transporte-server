"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var autenticacion_1 = require("../middlewares/autenticacion");
var notificacionesRoutes = express_1.Router();
var push = require('./../push_module');
//Almacenar la suscripción
notificacionesRoutes.post('/subscribe', [autenticacion_1.verificaToken], function (req, res) {
    var idUsuario = req.usuario.idUsuario;
    var suscripcion = req.body;
    suscripcion.usuario = idUsuario;
    push.addSubscription(suscripcion);
    res.json(suscripcion);
});
notificacionesRoutes.get('/key', function (req, res) {
    var key = push.getKey();
    res.send(key);
});
notificacionesRoutes.post('/push', function (req, res) {
    var destino = req.body.destino;
    var idDestino = req.body.idDestino || "";
    var post = {
        notification: {
            title: req.body.title,
            body: req.body.body,
            icon: req.body.icon,
            vibrate: [75, 38, 75, 488, 75, 38, 75, 200, 75, 38, 75, 400],
            openUrl: 'yotransporto.com',
            data: {
                id: '1'
            },
            action: {
                action: 'explore',
                title: 'oferta'
            }
        }
    };
    push.sendPush(post, destino, idDestino);
    res.json(post);
});
exports.default = notificacionesRoutes;
