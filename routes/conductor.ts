import { Router, Request, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clasess/file-system';
import bcrypt from 'bcrypt';

import  { Sequelize} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');
const { Op } = require('sequelize');

const conductorRoutes = Router();
const modelos = require('../models');
const fileSystem = new FileSystem();



conductorRoutes.post('/create', [verificaToken], async(req: any, res: Response) => {

    const body = req.body;
    body.idConductor = req.usuario.idUsuario;

    
     const fotoImg = await fileSystem.imagenesDeTempHaciaFoto( String(req.usuario.idUsuario) );
     let i = 1;

     if (fotoImg.length > 0){
        await fotoImg.forEach(element => {
            if(element.includes("foto1Licencia")){
               body.foto1Licencia = element;
            }else
            if(element.includes("foto2Licencia")){
               body.foto2Licencia = element;
            }
   
            if ( i == fotoImg.length){
               modelos.Conductores.create( body ).then( conductorDB => {
   
   
                   res.json({
                       ok: true,
                       conductor: conductorDB
           
                   });
                 
           
               }).catch( err => {
                   res.json(err);
               });  
            }
   
            i++;
        });
     }else {
        modelos.Conductores.create( body ).then( conductorDB => {
   
   
            res.json({
                ok: true,
                conductor: conductorDB
    
            });
          
    
        }).catch( err => {
            res.json(err);
        }); 
     }
     

      

    

});

// verificar conductor
conductorRoutes.get('/buscar/:idUsuario', (req: Request, res: Response ) => {

    //const body = req.body;
    const idUsuario = req.params.idUsuario;

    console.log(idUsuario);
       
        modelos.Conductores.findOne({ where: {idConductor: idUsuario}}).then(function(conductorDB:any) {
                if (!conductorDB) {
                    return res.json({
                        ok: false,
                        mensaje: 'No es un conductor registrado'
                    });
                } else {
                    return res.json({
                        ok: true,
                        mensaje: 'Es un conductor',
                        conductor: conductorDB
                    });
                }
    
            })
            .catch(function(err){
            console.log(err);
            throw err;
            });          
        
    }); 

// Vehiculos del conductor
    conductorRoutes.get('/buscarVehiculoConductor/:idUsuario', (req: Request, res: Response ) => {

        //const body = req.body;
        const idUsuario = req.params.idUsuario;
    
        console.log(idUsuario);
           
            modelos.ConductorVehiculos.findAll({ where: {codConductor: idUsuario}}).then(function(vehiculosDB:any) {

                    if (!vehiculosDB) {
                        return res.json({
                            ok: false,
                            mensaje: 'no se encontraron vehiculos'
                        });
                    } else {
                        return res.json({
                            ok: true,
                            vehiculos: vehiculosDB
                        });
                    }
        
                })
                .catch(function(err){
                console.log(err);
                throw err;
                });          
            
        });


        // Buscar ofertas conductor
    conductorRoutes.get('/buscar-ofertas-conductor/:idUsuario', async (req: Request, res: Response ) => {

        //const body = req.body;
        const idUsuario = req.params.idUsuario;
    
        let pagina = Number(req.query.pagina) || 1;
        let offset = pagina - 1;
        offset = offset * 10;
           
        const ofertasDB = await modelos.OfertaConductores.findAll({
            where: {
                codConductor: idUsuario, terminada: 0
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



//servicio para subir archivos
conductorRoutes.post('/upload/:nombre', [verificaToken], async(req: any, res: Response) => {

    if( !req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;
    //const file: FileUpload[] = [req.files.foto1Licencia, req.files.foto2Licencia];
    //const nombres: string[] = ["foto1Licencia","foto2Licencia"]

    if( !file ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        });
    }

    if ( !file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        });
    }

    const nombreFoto =  req.params.nombre;

    //console.log('los datos son', file , ' otro ', nombreFoto);
    
    await fileSystem.guardarImagenTemporal(file, String(req.usuario.idUsuario), nombreFoto);
    
    res.json({
        ok: true,
        file: file.mimetype

    });


});



conductorRoutes.get('/fotos/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile( pathFoto );
    
});


// enlazar conductor con vehiculo

conductorRoutes.post('/conductor-vehiculo', async(req: any, res: Response) => {

    const body = req.body;

    
      modelos.ConductorVehiculos.create( body ).then( CvehiculoDB => {


        res.json({
            ok: true,
            vehiculo: CvehiculoDB

        });
      

    }).catch( err => {
        res.json(err);
    });  

    

});

// Crear la oferta del conductor
conductorRoutes.post('/oferta-conductor', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.codConductor = req.usuario.idUsuario;

    
      modelos.OfertaConductores.create( body ).then( ofertaCDB => {


        res.json({
            ok: true,
            conductor: ofertaCDB

        });
      

    }).catch( err => {
        res.json(err);
    });  

    

});

// cuando el conductor acepta la oferta del pasajero
conductorRoutes.post('/conductor-oferta-pasajero', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.codConductor = req.usuario.idUsuario;

    
      modelos.ConductorOfertaPasajero.create( body ).then( ofertaCDB => {


        res.json({
            ok: true,
            conductor: ofertaCDB

        });
      

    }).catch( err => {
        res.json(err);
    });

});


 // Buscar las ofertas que el usuario ha aceptado
 conductorRoutes.get('/buscar-poc/:idOferta', async (req: Request, res: Response ) => {

    //const body = req.body;
    const idOferta = req.params.idOferta;

    console.log(idOferta);
       
    modelos.PasajeroOfertaConductores.findAll({
        where: {
            codOfertaConductor: idOferta, estado: 0
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
conductorRoutes.post('/update-poc/:id', verificaToken, (req: any, res: Response) => {

    const datos = {
        estado: req.body.estado,
        aceptada: req.body.aceptada
    }


    modelos.PasajeroOfertaConductores.update(datos, {where:{idPasajeroOfertaConductor: req.params.id}}, {new: true}).then((resp) =>{

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
conductorRoutes.post('/terminar-oferta/:id', verificaToken, (req: any, res: Response) => {

    const user = {
        terminada: true,
    }

    modelos.OfertaConductores.update(user, {where:{idOfertaConductor: req.params.id}}, {new: true}).then((resp) =>{

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


// cuando el usuario pasajero acepta la oferta del conductor
conductorRoutes.post('/conductor-oferta-pasajero', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.codConductor = req.usuario.idUsuario;
    
      modelos.ConductorOfertaPasajero.create( body ).then( ofertaCDB => {


        res.json({
            ok: true,
            respuesta: ofertaCDB

        });
      

    }).catch( err => {
        res.json(err);
    });  
       

});


    // Ofertas publicadas por los pasajeros
    conductorRoutes.get('/buscarOfertasPasajeros/:esInterUrbado', async (req: Request, res: Response ) => {


        let esInterUrbano = req.params.esInterUrbado;
        const ciudad1 = req.query.ciudad1;
        const ciudad2 = req.query.ciudad2;

        const idConductor = req.query.idConductor;
       
        
        let pagina = Number(req.query.pagina) || 1;
        let offset = pagina - 1;
        offset = offset * 10;


         let ofertaC: any[] = [];
                 


         if ( esInterUrbano == '1') {
             if (ciudad1 != null && ciudad2 != null) {

                const of1 = await modelos.OfertaPasajeros.findAndCountAll({
                   where: {
                    [Op.and]: [  
                        {terminada : 0},
                        {origen: ciudad1},
                        {destino: ciudad2}
                    ],
                    
                    codTipoServicio: {
                        [Op.or]: [2,4]
                    }
                           
                    },       
                    order: sequelize.literal('createdAt DESC'),
                    offset: offset,
                    limit: 10
                  });
                   
                    let oferta: any[] = of1.rows;

                    if(oferta.length != 0){
            
                     for (let i = 0; i < oferta.length; i++) {
                        const ofta = oferta[i];

                        // obtener si el conductor ha hecho mas de dos contraoferta
                     modelos.ConductorOfertaPasajero.findAll({
                        attributes: [
                            
                            [sequelize.fn('COUNT', sequelize.col('idConductorOfertaPasajero')), 'cant']
                            
                          ],
                        where: {
                            [Op.and]: [  
                                {codOfertaPasajero : ofta.idOfertaPasajero},
                                {codConductor: idConductor}
                            ]},
                            group: 'codOfertaPasajero'
                       
                      }).then((r: any) => {
                        let cant = '0';
                        if(r.length != 0){
                          
                          cant = r[0].dataValues.cant;
                           // cant = 0;
                        }
                          
                            modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then(function(usuarioDB:any) {
                                       
                                let o: any = {
                                    oferta: ofta,
                                    usuario: usuarioDB
                                }
            
                                if ( cant <= '1'){
                                ofertaC.push(o);
                                }
            
                               if( i >= oferta.length - 1){
                                   
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
             // si las ciudades vienen en blanco    
             }else {

                const of1 = await modelos.OfertaPasajeros.findAndCountAll({
                    where: {  
                         terminada : 0
                     ,
                     
                     codTipoServicio: {
                         [Op.or]: [2,4]
                     }
                            
                     },       
                     order: sequelize.literal('createdAt DESC'),
                     offset: offset,
                     limit: 10
                   });
                    
                     let oferta: any[] = of1.rows;
 
                     if(oferta.length != 0){
             
                      for (let i = 0; i < oferta.length; i++) {
                         const ofta = oferta[i];

                         // obtener si el conductor ha hecho mas de dos contraoferta
                     modelos.ConductorOfertaPasajero.findAll({
                        attributes: [
                            
                            [sequelize.fn('COUNT', sequelize.col('idConductorOfertaPasajero')), 'cant']
                            
                          ],
                        where: {
                            [Op.and]: [  
                                {codOfertaPasajero : ofta.idOfertaPasajero},
                                {codConductor: idConductor}
                            ]},
                            group: 'codOfertaPasajero'
                       
                      }).then((r: any) => {
                        let cant = '0';
                        if(r.length != 0){
                          
                          cant = r[0].dataValues.cant;
                           // cant = 0;
                        }
                        
                            modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then(function(usuarioDB:any) {
                                        
                                let o: any = {
                                    oferta: ofta,
                                    usuario: usuarioDB
                                }
            
                                if ( cant <= '1'){
                                    ofertaC.push(o);
                                     }
            
                               if( i >= oferta.length - 1){
                                   
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
             
                
             }
         }
         // Si no es interurbano
         else {

            const of1 = await modelos.OfertaPasajeros.findAndCountAll({
                where: {
                    terminada : 0,
                 
                 codTipoServicio: {
                     [Op.or]: [1,3]
                 }
                        
                 },       
                 order: sequelize.literal('createdAt DESC'),
                 offset: offset,
                 limit: 10
               });
                
                 let oferta: any[] = of1.rows;

                 if(oferta.length != 0){
         
                  for (let i = 0; i < oferta.length; i++) {
                     const ofta = oferta[i];
         
                     // obtener si el conductor ha hecho mas de dos contraoferta
                     modelos.ConductorOfertaPasajero.findAll({
                        attributes: [
                            
                            [sequelize.fn('COUNT', sequelize.col('idConductorOfertaPasajero')), 'cant']
                            
                          ],
                        where: {
                            [Op.and]: [  
                                {codOfertaPasajero : ofta.idOfertaPasajero},
                                {codConductor: idConductor}
                            ]},
                            group: 'codOfertaPasajero'
                       
                      }).then((r: any) => {
                          
                        let cant = '0';
                        if(r.length != 0){
                          
                          cant = r[0].dataValues.cant;
                           // cant = 0;
                        }

                        
                          
                            modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then( function(usuarioDB:any) {
                                  
                                let o: any = {
                                    oferta: ofta,
                                    usuario: usuarioDB
                                }
            
                                if ( cant <= '1'){
                               ofertaC.push(o);
                                }
                                
                            //  console.log(ofertaC);
            
                               if( i >= oferta.length - 1){
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
                 
         }

       // console.log(codTipoServicio);
             
 });




 // Buscar las ofertas que acepto el pasajero 
conductorRoutes.get('/buscarOfertasAceptadas/:codConductor', async (req: Request, res: Response ) => {

    //const body = req.body;
    const codConductor = req.params.codConductor;
    let pagina = Number(req.query.pagina) || 1;
    let offset = pagina - 1;
    offset = offset * 10;

    let ofertaC: any[] = [];
   // console.log(codTipoServicio);

   const of1 = await modelos.ConductorOfertaPasajero.findAndCountAll({
    where: {
        codConductor: codConductor, estado: 0
    },       
    order: sequelize.literal('createdAt DESC'),
    offset: offset,
    limit: 10
  });

    let oferta: any[] = of1.rows;

    if(oferta.length != 0){

    for (let i = 0; i < oferta.length; i++) {
        let ofta = oferta[i];

        // Buscar los datos del pasajero y su nnombre
        modelos.OfertaPasajeros.findOne({ where: {idOfertaPasajero: ofta.codOfertaPasajero}}).then(function(ofertaDB:any) {
   // modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then(function(usuarioDB:any) {
                           
               modelos.Usuarios.findOne({ where: {idUsuario: ofertaDB.codPasajero}}).then(function(usuarioDB:any) { 
               
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

 // Buscar las ofertas que el conductor ha aceptado
 conductorRoutes.get('/buscar-cop', [verificaToken], async (req: any, res: Response ) => {
    
    //const body = req.body;
    const idUsuario = req.usuario.idUsuario;
    
    console.log(idUsuario);
        
    modelos.ConductorOfertaPasajero.findAll({
        where: {
            codConductor: idUsuario, estado: 0
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


    //Guardar calificacion 

    conductorRoutes.post('/calificar', [verificaToken], async(req: any, res: Response) => {

        const body = req.body;
       // body.idConductor = req.usuario.idUsuario;
    
        modelos.CalificacionConductor.create( body ).then( conductorDB => {
       
       
            res.json({
                ok: true,
                conductor: conductorDB
    
            });
          
    
        }).catch( err => {
            res.json(err);
        });  
        
    
    });


    //Ver calificacion
    conductorRoutes.get('/ver-calificacion/:codConductor', async (req: Request, res: Response ) => {

        //const body = req.body;
        const codConductor = req.params.codConductor;
       // console.log(codTipoServicio);
    
       const c = await modelos.CalificacionConductor.count({
        where: {
            codConductor: codConductor
        }
      });

      const p = await modelos.CalificacionConductor.sum('puntualidad',
      {
        where: {
            codConductor: codConductor
        }
      });

      const a = await modelos.CalificacionConductor.sum('atencion',
      {
        where: {
            codConductor: codConductor
        }
      });

      const v = await modelos.CalificacionConductor.sum('vehiculo',
      {
        where: {
            codConductor: codConductor
        }
      });



      const puntualidad = Math.round(p/c) || 0;
      const atencion = Math.round(a/c) || 0;
      const vehiculo = Math.round(v/c) || 0;
    

      res.json({
        ok: true,
        puntualidad: puntualidad,
        atencion: atencion,
        vehiculo: vehiculo

    });
        
    
             
    });





export default conductorRoutes;
