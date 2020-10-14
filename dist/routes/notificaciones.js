"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var notificacionesRoutes = express_1.Router();
var push = require('./../push_module');
//notificacionesRoutes.post('/', async(req: any, res: Response) => {
//const body = req.body;
/*
    const datos = await JSON.parse(req.query.datos);
    const mensaje = datos.mensaje;
    const titulo = datos.titulo;
    const idSignal = datos.idSignal;
    

    const datas =  JSON.parse(req.query.data);
 */
/*  const sendNotification = function(data) {
     const headers = {
       "Content-Type": "application/json; charset=utf-8",
       "Authorization": "Basic ZjExZDBlNmUtOTRiMC00MWQzLWE4YjAtMGEyYzc2M2Q0OTJj"
     }; */
/*    const options = {
     host: "onesignal.com",
     port: 443,
     path: "/api/v1/notifications",
     method: "POST",
     headers: headers
   };
   
   const https = require('https');
   const req = https.request(options, function(res) {
     res.on('data', function(data) {
       console.log("Response:");
       console.log(JSON.parse(data));
     });
   });
   
   req.on('error', function(e) {
     console.log("ERROR:");
     console.log(e);
   });
   
   req.write(JSON.stringify(data));
   req.end();
 }; */
/* const message = {
  app_id: "9f2e2722-8482-4865-8c81-d722103fb75c",
  data: {"userId": "Postman-128992"},
  contents: {"en": "English Message"},
  headings: {"en": "English Title"},
  included_segments: ["Active Users", "Inactive Users"]
  
}; */
/*  const message = {
   app_id: "9f2e2722-8482-4865-8c81-d722103fb75c",
   data: datas,
   contents: {"en": mensaje},
   headings: {"en": titulo},
   include_player_ids: [idSignal]
   
 }; */
/*
  sendNotification(message);


res.json({
    ok: true,
    noti: sendNotification
}); */
//});
//Almacenar la suscripción
notificacionesRoutes.post('/subscribe', function (req, res) {
    res.json('Subscribe');
});
notificacionesRoutes.get('/key', function (req, res) {
    var key = push.getKey();
    res.send(key);
});
notificacionesRoutes.post('/push', function (req, res) {
    res.json('Mandar notificaciones');
});
exports.default = notificacionesRoutes;
