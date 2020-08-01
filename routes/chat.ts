import { Router, Request, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';

const chatRoutes = Router();
const modelos = require('../models');



chatRoutes.post('/pasajero-conductor', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.origen = req.usuario.idUsuario;

    
      modelos.ChatPasajeroConductores.create( body ).then( chatDB => {


        res.json({
            ok: true,
            conductor: chatDB

        });
      

    }).catch( err => {
        res.json(err);
    });  

    

});

chatRoutes.post('/conductor-pasajero', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.origen = req.usuario.idUsuario;

    
      modelos.ChatConductoresPasajero.create( body ).then( chatDB => {


        res.json({
            ok: true,
            conductor: chatDB

        });
      

    }).catch( err => {
        res.json(err);
    });  

    

});

chatRoutes.post('/notificacion',  [verificaToken], async(req: any, res: Response) => {

    const body = req.body;
    
    let message = await { 
        app_id: "9f2e2722-8482-4865-8c81-d722103fb75c",
       // data: datas,
        contents: {"en": body.mensaje},
        headings: {"en": body.titulo},
        include_player_ids: ["efc74112-2949-4806-8b18-c8146a41ea47"]
        
      };

    

        res.json({
            ok: true,
            conductor: message

        });
      

    

});








export default chatRoutes;
