import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import Token from '../clasess/token';
import { verificaToken } from '../middlewares/autenticacion';
//import ofertaConductorRoutes from './oferta-conductor';

import { OfertaConductorCompleta, UsuarioConductor, Usuario, OfertaConductor, OfertasArregloC, Conductor } from '../interfaces/interfaces';
import  { Sequelize} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');
const { Op } = require('sequelize');

const userRoutes = Router();
const modelos = require('../models');


// Login
userRoutes.post('/login', (req: Request, res: Response ) => {

    const body = req.body;
       
        modelos.Usuarios.findOne({ where: {email: body.email}}).then(function(userDB:any) {
                if (!userDB) {
                    return res.json({
                        ok: false,
                        mensaje: 'Usuario/contraseña no son correctos'
                    });
                } else {
                console.log('Usuario encontrado. Seguimos procesando');
                var hashed_password= userDB.password;
                if (bcrypt.compareSync(body.password, hashed_password)) {
                        console.log('login coorrecto');

                        const tokenUser = Token.getJwtToken({
                            idUsuario: userDB.idUsuario,
                            nombre: userDB.nombre,
                            cedula: userDB.cedula,
                            email: userDB.email,
                            telefono: userDB.telefono,
                            foto: userDB.foto
                        });
                        res.json({
                        ok: true,
                        token: tokenUser
                    });
    
                    } else {
                        console.log('Login incorrecto');
                        return res.json({
                        ok: false,
                        mensaje: 'Usuario/contraseña no son correctos ***'
                    });
                    }
                }
    
            })
            .catch(function(err){
            console.log(err);
            throw err;
            });          
        
    }); 



userRoutes.post('/create', (req: Request, res: Response) =>{

    const user = {
        nombre: req.body.nombre,        
        cedula: req.body.cedula,
        telefono: req.body.telefono,
        email: req.body.email,
        password: bcrypt.hashSync( req.body.password, 10),        
        foto: req.body.foto,
        idSignal: req.body.idSignal
    }  

    
    // Crear el usuario
     modelos.Usuarios.create(user).then((userDB: any) => {

        // Tomar datos para crear el conductor
        const pasajero = {
            idPasajero: userDB.idUsuario,
            estado: true
        }


        //Crear el pasajero con el id del usuario
    modelos.Pasajeros.create(pasajero).then((userPDB: any) => {

        const tokenUser = Token.getJwtToken({
            idUsuario: userDB.idUsuario,
            nombre: userDB.nombre,
            cedula: userDB.cedula,
            email: userDB.email,
            telefono: userDB.telefono,
            foto: userDB.foto,
            idSignal: req.body.idSignal

        });
    
        res.json({
            ok: true,
            token: tokenUser,
            mensaje: "Usuario creado"
        });

        });        

   


    }).catch( err => {
        res.json({
            ok: false,
            err
        });
        
    });

});




// Actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        avatar: req.body.avatar
    }

    console.log("El usuario que viene : ", user.nombre, " ", user.email);

    modelos.Usuarios.update(user, {where:{id: req.usuario.idUsuario }}, {new: true}).then((userDB) =>{

        console.log("El usuario de DB : ", userDB);


    if (!userDB) {
        return res.json({
            ok: false,
            mensaje: 'No existe un usuario con ese ID'
        });
    } else {
    console.log('Usuario encontrado. Seguimos procesando');    

            const tokenUser = Token.getJwtToken({
                idUsuario: userDB.idUsuario,
                nombre: userDB.nombre,
                cedula: userDB.cedula,
                email: userDB.email,
                telefono: userDB.telefono,
                foto: userDB.foto
            });
            res.json({
            ok: true,
            token: tokenUser
        });
       
    }

})
.catch(function(err){
console.log(err);
throw err;
});   

});



userRoutes.get('/', [verificaToken], (req:any, res:Response) => {

    const usuario = req.usuario;

    res.json({
        ok:true,
        usuario
    });

})

// cuando el usuario pasajero acepta la oferta del conductor
userRoutes.post('/pasajero-oferta-conductor', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.codPasajero = req.usuario.idUsuario;

    
      modelos.PasajeroOfertaConductores.create( body ).then( ofertaCDB => {


        res.json({
            ok: true,
            conductor: ofertaCDB

        });
      

    }).catch( err => {
        res.json(err);
    });  
       

});



// Buscar las ofertas que aceptaron los conductores 
userRoutes.get('/buscarOfertasAceptadas/:codPasajero', async (req: Request, res: Response ) => {

    //const body = req.body;
    const codPasajero = req.params.codPasajero;

    let pagina = Number(req.query.pagina) || 1;
        let offset = pagina - 1;
        offset = offset * 10;

    let ofertaC: any[] = [];
    

   // console.log(codTipoServicio);

   const of1 = await modelos.PasajeroOfertaConductores.findAndCountAll({
    where: {
        codPasajero: codPasajero, estado: 0
    },       
    order: sequelize.literal('createdAt DESC'),
    offset: offset,
    limit: 10
  });

    let oferta: any[] = of1.rows;

    if(oferta.length != 0){

    for (let i = 0; i < oferta.length; i++) {
        let ofta = oferta[i];

        // Buscar los datos del conductor y su nnombre
        modelos.OfertaConductores.findOne({ where: {idOfertaConductor: ofta.codOfertaConductor}}).then(function(ofertaDB:any) {
   // modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then(function(usuarioDB:any) {
           
               modelos.Usuarios.findOne({ where: {idUsuario: ofertaDB.codConductor}}).then(function(usuarioDB:any) { 
               
                   

                        let o: any = {
                            completa: ofta,
                            usuario: usuarioDB,
                            oferta: ofertaDB
                        }

                        ofertaC.push(o);

                       if( i >= oferta.length - 1){
                        console.log(ofertaC.length);
                         return res.json({
                            ok: true,
                            ofertas: ofertaC
                        });

                       } 
                        
                     
                });
           

        });

        
    }


       
    }else{

        res.json({
            ok: false,
            pagina,
            ofertas: ofertaC
        });
    }


         
});


    // Creacion de la oferta del pasajero
    userRoutes.post('/oferta-pasajero', [verificaToken], (req: any, res: Response) => {

        const body = req.body;
        body.codPasajero = req.usuario.idUsuario;
        
          modelos.OfertaPasajeros.create( body ).then( ofertaCDB => {
    
            res.json({
                ok: true,
                ofertaPasajero: ofertaCDB
    
            });
    
        }).catch( err => {
            res.json(err);
        });  
    
    
    });


/*     // Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({ _id: -1 })
                            .skip( skip )
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        posts
    });


}); */

    // Ofertas publicadas por los conductores
    userRoutes.get('/buscarOfertasConductor/:codTipoServicio', async (req: any, res: Response ) => {

        //const body = req.body;
        const codTipoServicio = req.params.codTipoServicio;
        let pagina = Number(req.query.pagina) || 1;
        let offset = pagina - 1;
        offset = offset * 10;

        let ofertaC: OfertaConductorCompleta[] = [];
        let conductor: Conductor = {};
        let usuario: Usuario = {};

        const idPasajero = req.query.idPasajero;
        

       // console.log(codTipoServicio);

       const of1 = await modelos.OfertaConductores.findAndCountAll({
        where: {
            codTipoServicio: codTipoServicio, terminada: 0
        },       
        order: sequelize.literal('createdAt DESC'),
        offset: offset,
        limit: 10
      });

      let oferta: OfertaConductor[] = of1.rows;
      
      if(oferta.length != 0){

      

      for (let i = 0; i < oferta.length; i++) {
        const ofta = oferta[i];


        // obtener si el conductor ha hecho mas de dos contraoferta
        modelos.PasajeroOfertaConductores.findAll({
            attributes: [
                
                [sequelize.fn('COUNT', sequelize.col('idPasajeroOfertaConductor')), 'cant']
                
              ],
            where: {
                [Op.and]: [  
                    {codOfertaConductor : ofta.idOfertaConductor},
                    {codPasajero: idPasajero}
                ]},
                group: 'codOfertaConductor'
           
          }).then((r: any) => {
              
            let cant = '0';
            if(r.length != 0){
              
              cant = r[0].dataValues.cant;
               // cant = 0;
            }
              
              
                modelos.Usuarios.findOne({ where: {idUsuario: ofta.codConductor}}).then(function(usuarioDB:any) {
           

                    // usuario = usuarioDB;
                     
                     modelos.Conductores.findOne({ where: {idConductor: ofta.codConductor}}).then(function(conductorDB:any) {
                         
                             conductor = conductorDB;
     
                             let o: OfertaConductorCompleta = {
                                 oferta: ofta,
                                 usuario: usuarioDB,
                                 conductor: conductorDB
                             }
     
                             if ( cant <= '1'){
                             ofertaC.push(o);
                             }
     
                            if( i >= oferta.length - 1){
                             console.log(ofertaC.length);
                              return res.json({
                                 ok: true,
                                 ofertas: ofertaC
                             });
     
                            }
                             
                            
                             
             
                     });
                     
     
             });
             
          });

      

        
    }

}else{


      res.json({
        ok: false,
        pagina,
        ofertas: ofertaC
    });
}       
     
    
             
 });



        // buscar un usuario en especifico
    userRoutes.get('/buscar/:idUsuario', (req: Request, res: Response ) => {

    //const body = req.body;
    const idUsuario = req.params.idUsuario;
       
        modelos.Usuarios.findOne({ where: {idUsuario: idUsuario}}).then(function(usuarioDB:any) {
                if (!usuarioDB) {
                    return res.json({
                        ok: false,
                        usuario: 'No hay datos'
                    });
                } else {
                    return res.json({
                        ok: true,
                        usuario: usuarioDB
                    });
                }
    
            })
            .catch(function(err){
            console.log(err);
            throw err;
            });          
        
    }); 
 



    // Buscar las ofertas que el usuario ha aceptado
    userRoutes.get('/buscar-poc', [verificaToken], async (req: any, res: Response ) => {
    
    //const body = req.body;
    const idUsuario = req.usuario.idUsuario;
    
    console.log(idUsuario);
        
    modelos.PasajeroOfertaConductores.findAll({
        where: {
            codPasajero: idUsuario, estado: 0
        },       
        order: sequelize.literal('createdAt DESC')
        }).then(function(ofertasDB:any) {
    
        if (!ofertasDB) {
            return res.json({
                ok: false,
                mensaje: 'no se encontraron ofertas'
            });
        } else {
                    return res.json({
                        ok: true,
                        ofertas: ofertasDB
                    });
                }
    
            })
            .catch(function(err){
            console.log(err);
            throw err;
            });          
        
    });


    // ofertas generadas por el pasajero

    userRoutes.get('/buscarOfertas/:idUsuario', async (req: Request, res: Response ) => {

        //const body = req.body;
        const idUsuario = req.params.idUsuario;

        let pagina = Number(req.query.pagina) || 1;
        let offset = pagina - 1;
        offset = offset * 10;

        const ofertasDB = await modelos.OfertaPasajeros.findAll({
            where: {
                codPasajero: idUsuario, terminada: 0
            },       
            order: sequelize.literal('createdAt DESC'),
            offset: offset,
            limit: 10
          });   

          res.json({
            ok: false,
            pagina,
            ofertas: ofertasDB
        });
    
             
 });


  // Buscar las ofertas que el usuario ha aceptado
  userRoutes.get('/buscar-cop/:idOferta', async (req: Request, res: Response ) => {

    //const body = req.body;
    const idOferta = req.params.idOferta;

    console.log(idOferta);
       
    modelos.ConductorOfertaPasajero.findAll({
        where: {
            codOfertaPasajero: idOferta, estado: 0
        },       
        order: sequelize.literal('createdAt ASC')
      }).then(function(ofertasDB:any) {

        if (!ofertasDB) {
            return res.json({
                ok: false,
                mensaje: 'no se encontraron ofertas'
            });
        } else {
                    return res.json({
                        ok: true,
                        ofertas: ofertasDB
                    });
                }
    
            })
            .catch(function(err){
            console.log(err);
            throw err;
            });          
        
    });


    // rechazar oferta aceptada
userRoutes.post('/update-cop/:id', verificaToken, (req: any, res: Response) => {

    const datos = {
        estado: req.body.estado,
        aceptada: req.body.aceptada
    }

    modelos.ConductorOfertaPasajero.update(datos, {where:{idConductorOfertaPasajero: req.params.id}}, {new: true}).then((resp) =>{

    if (!resp) {
        return res.json({
            ok: false,
            mensaje: 'No se encontraron datos'
        });
    } else {  

            res.json({
            ok: true,
            respuesta: resp
        });
       
    }

})
.catch(function(err){
console.log(err);
throw err;
});   

});


// Terminar Oferta
userRoutes.post('/terminar-oferta/:id', verificaToken, (req: any, res: Response) => {

    const dato = {
        terminada: true,
    }

    modelos.OfertaPasajeros.update(dato, {where:{idOfertaPasajero: req.params.id}}, {new: true}).then((resp) =>{

    if (!resp) {
        return res.json({
            ok: false,
            mensaje: 'No se encontraron datos'
        });
    } else {  

            res.json({
            ok: true,
            respuesta: resp
        });
       
    }

})
.catch(function(err){
console.log(err);
throw err;
});   

});


 //Guardar calificacion 

 userRoutes.post('/calificar', [verificaToken], async(req: any, res: Response) => {

    const body = req.body;
   // body.idConductor = req.usuario.idUsuario;

    modelos.CalificacionPasajero.create( body ).then( pasajeroDB => {
   
   
        res.json({
            ok: true,
            pasajero: pasajeroDB

        });
      

    }).catch( err => {
        res.json(err);
    });  
    

});


//Ver calificacion
userRoutes.get('/ver-calificacion/:codPasajero', async (req: Request, res: Response ) => {

    //const body = req.body;
    const codPasajero = req.params.codPasajero;

   // console.log(codTipoServicio);

   const c = await modelos.CalificacionPasajero.count({
    where: {
        codPasajero: codPasajero
    }
  });

  const p = await modelos.CalificacionPasajero.sum('puntualidad',
  {
    where: {
        codPasajero: codPasajero
    }
  });

  const a = await modelos.CalificacionPasajero.sum('atencion',
  {
    where: {
        codPasajero: codPasajero
    }
  });


  const puntualidad = Math.round(p/c) || 0;
  const atencion = Math.round(a/c) || 0;


  res.json({
    ok: true,
    puntualidad: puntualidad,
    atencion: atencion

});
    

         
});
    

 
 



export default userRoutes;