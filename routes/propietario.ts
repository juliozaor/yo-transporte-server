import { Router, Request, Response } from "express";
import { verificaToken } from '../middlewares/autenticacion';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clasess/file-system';

const propietarioRoutes = Router();
const modelos = require('../models');
const fileSystem = new FileSystem();



propietarioRoutes.post('/create', [verificaToken], async(req: any, res: Response) => {

    const body = req.body;
    body.idPropietario = req.usuario.idUsuario;

    
     const fotoImg = await fileSystem.imagenesDeTempHaciaFoto( String(req.usuario.idUsuario) );
     await fotoImg.forEach(element => {
         if(element.includes("runt")){
            body.runt = element;
         }
     });

      modelos.Propietarios.create( body ).then( propietarioDB => {


        res.json({
            ok: true,
            propietario: propietarioDB

        });
      

    }).catch( err => {
        res.json(err);
    });  

    

});




//servicio para subir archivos
propietarioRoutes.post('/upload/:nombre', [verificaToken], async(req: any, res: Response) => {

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

    //console.log("el id del usuario es :", req.usuario._id);

    const nombreFoto =  req.params.nombre;
    
    await fileSystem.guardarImagenTemporal(file, String(req.usuario.idUsuario), nombreFoto);
    
    res.json({
        ok: true,
        file: file.mimetype
    });


});



propietarioRoutes.get('/fotos/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img);

    res.sendFile( pathFoto );
    
});




export default propietarioRoutes;
