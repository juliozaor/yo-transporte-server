import { Router, Request, Response  } from 'express';
import { Json } from 'sequelize/types/lib/utils';
import { verificaToken } from '../middlewares/autenticacion';


const notificacionesRoutes = Router();

const push = require('./../push_module');


//Almacenar la suscripción
notificacionesRoutes.post('/subscribe',  [verificaToken], (req: any, res: Response) => {
  const idUsuario = req.usuario.idUsuario;
  const suscripcion = req.body;

  suscripcion.usuario = idUsuario;

  push.addSubscription( suscripcion );

  res.json( suscripcion );
});

notificacionesRoutes.get('/key', (req: any, res: Response) => {

  

  const key = push.getKey();
  res.send(key);


});

notificacionesRoutes.post('/push', (req: any, res: Response) => {

  const destino = req.body.destino;
  const idDestino = req.body.idDestino || "";

  const post = {
     notification: 
     {
       title: req.body.title, 
       body: req.body.body,  
       icon: req.body.icon,
       vibrate: [75,38,75,488,75,38,75,200,75,38,75,400],
       openUrl: 'yotransporto.com',
       data: {
         id:'1'
       },
       action: {
          action: 'explore',
          title: 'oferta'

       }
       
      } 
    
  };

  push.sendPush( post, destino, idDestino );
  
  res.json(post);

})


export default notificacionesRoutes;