"use strict";
/* import { Router, Request, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';

const ofertaConductorRoutes = Router();
const modelos = require('../models');



ofertaConductorRoutes.post('/create', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.idConductor = req.usuario.idUsuario;

    
      modelos.OfertaConductores.create( body ).then( ofertaCDB => {


        res.json({
            ok: true,
            conductor: ofertaCDB

        });
      

    }).catch( err => {
        res.json(err);
    });

    

});








export default ofertaConductorRoutes;
 */ 
