import { Router, Request, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clasess/file-system';

const vehiculoRoutes = Router();
const modelos = require('../models');
const fileSystem = new FileSystem();



vehiculoRoutes.post('/create', [verificaToken], async(req: any, res: Response) => {

    const body = req.body;
    body.codPropietario = req.usuario.idUsuario;

    
     const fotoImg = await fileSystem.imagenesDeTempHaciaVehiculo( String(req.usuario.idUsuario) );

     let i = 1;

     if (fotoImg.length > 0){
            
        await fotoImg.forEach(element => {
            if(element.includes("foto1")){
               body.foto1 = element;
            }else
            if(element.includes("foto2")){
               body.foto2 = element;
            }else
            if(element.includes("foto3")){
               body.foto3 = element;
            }else
            if(element.includes("foto4")){
               body.foto4 = element;
            }else
            if(element.includes("foto5")){
               body.foto5 = element;
            }else
            if(element.includes("f1Soat")){
               body.f1Soat = element;
            }else
            if(element.includes("f2Soat")){
               body.f2Soat = element;
            }else
            if(element.includes("f1TP")){
               body.f1TP = element;
            }else
            if(element.includes("f2TP")){
               body.f2TP = element;
            }

            if (i == fotoImg.length){
               modelos.Vehiculos.create( body ).then( vehiculoDB => {
   
   
                   res.json({
                       ok: true,
                       vehiculo: vehiculoDB
           
                   });
                 
           
               }).catch( err => {
                   res.json(err);
               });  
            }
            
            i++
        });

     }else {
        modelos.Vehiculos.create( body ).then( vehiculoDB => {
   
   
            res.json({
                ok: true,
                vehiculo: vehiculoDB
    
            });
          
    
        }).catch( err => {
            res.json(err);
        }); 
     }

     

      

    

});




//servicio para subir archivos
vehiculoRoutes.post('/upload/:nombre', [verificaToken], async(req: any, res: Response) => {

    const idUsuario = req.usuario.idUsuario;

    if( !req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload = req.files.imagen;
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

    //console.log("el id del usuario es :", req.usuario.idUsuario), idUsuario;

    const nombreFoto =  req.params.nombre;
    
    await fileSystem.guardarImagenTemporalV(file, String(req.usuario.idUsuario), nombreFoto);
    
    res.json({
        ok: true,
        file: file.mimetype
    });


});



vehiculoRoutes.get('/fotos/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getVehiculoUrl(userId, img);

    res.sendFile( pathFoto );
    
});


// buscar Vehiculos
vehiculoRoutes.get('/buscarVehiculo/:idVehiculo', (req: Request, res: Response ) => {

    //const body = req.body;
    const idVehiculo = req.params.idVehiculo;

       
        modelos.Vehiculos.findOne({ where: {idVehiculo: idVehiculo}}).then(function(vehiculo:any) {

                if (!vehiculo) {
                    return res.json({
                        ok: false,
                        mensaje: 'no se encontro el vehiculos'
                    });
                } else {
                    return res.json({
                        ok: true,
                        vehiculos: vehiculo
                    });
                }
    
            })
            .catch(function(err){
            console.log(err);
            throw err;
            });          
        
    });




export default vehiculoRoutes;
