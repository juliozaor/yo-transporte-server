import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid'; // Generar nombres unicos

export default class FileSystem {

    constructor() {};


    guardarImagenTemporal( file: FileUpload, userId: string, nombreFoto: string ) {

        return new Promise(  (resolve, reject) => {

            // Crear carpetas
            const path = this.crearCarpetaUsuario( userId );            

                // Nombre archivo
            const nombreArchivo = this.generarNombreUnico( file.name, nombreFoto );
            
            // Mover el archivo del Temp a nuestra carpeta
            file.mv( `${ path }/${ nombreArchivo }`, ( err: any) => {
    
                if ( err ) {
                    reject(err);
                } else {
                    resolve();
                }
    
            });            

        });

    }

    guardarImagenTemporalV( file: FileUpload, userId: string, nombreFoto: string ) {

        return new Promise(  (resolve, reject) => {

            // Crear carpetas
            const path = this.crearCarpetaUsuarioV( userId );            

                // Nombre archivo
            const nombreArchivo = this.generarNombreUnico( file.name, nombreFoto );
            
            // Mover el archivo del Temp a nuestra carpeta
            file.mv( `${ path }/${ nombreArchivo }`, ( err: any) => {
    
                if ( err ) {
                    reject(err);
                } else {
                    resolve();
                }
    
            });            

        });

    }

    private generarNombreUnico( nombreOriginal: string, nombre: string  ) {
        // 6.copy.jpg
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1 ];

       // const idUnico = uniqid();
        const idUnico = nombre;

        return `${ idUnico }.${ extension }`;
    }


    private crearCarpetaUsuario( userId: string ) {

        const pathUser = path.resolve(  __dirname, '../uploads/', userId );
        const pathUserTemp = pathUser + '/temp';
        //console.log(pathUser);

        const existe = fs.existsSync( pathUser );

        if ( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;

    }

    private crearCarpetaUsuarioV( userId: string ) {

        const pathUser = path.resolve(  __dirname, '../uploadsV/', userId );
        const pathUserTemp = pathUser + '/tempV';
        //console.log(pathUser);

        const existe = fs.existsSync( pathUser );

        if ( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;

    }


    imagenesDeTempHaciaFoto( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' );
        const pathFoto = path.resolve(  __dirname, '../uploads/', userId, 'fotos' );

        if ( !fs.existsSync( pathTemp ) ) {
            return [];
        }

        if ( !fs.existsSync( pathFoto ) ) {
            fs.mkdirSync( pathFoto );
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathFoto }/${ imagen }` )

        });

        return imagenesTemp;

    }


    imagenesDeTempHaciaVehiculo(userId: string ){
        const pathTemp = path.resolve(  __dirname, '../uploadsV/', userId, 'tempV' );
        const pathVehiculo = path.resolve(  __dirname, '../uploadsV/', userId, 'vehiculo' );

        if ( !fs.existsSync( pathTemp ) ) {
            return [];
        }

        if ( !fs.existsSync( pathVehiculo ) ) {
            fs.mkdirSync( pathVehiculo );
        }

        const imagenesTemp = this.obtenerImagenesEnTempV( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathVehiculo }/${ imagen }` )
        });

        return imagenesTemp;


    }

    private obtenerImagenesEnTemp( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' );

        return fs.readdirSync( pathTemp ) || [];

    }

    private obtenerImagenesEnTempV( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploadsV/', userId, 'tempV' );

        return fs.readdirSync( pathTemp ) || [];

    }

    getFotoUrl( userId: string, img: string) {

        const pathFoto = path.resolve(  __dirname, '../uploads/', userId, 'fotos', img );

       const existe = fs.existsSync( pathFoto );

       if(!existe ){
           return path.resolve(  __dirname, '../assets/400x250.jpg' );
       }


        return pathFoto;

    }

    getVehiculoUrl( userId: string, img: string) {

        const pathVehiculo = path.resolve(  __dirname, '../uploadsV/', userId, 'vehiculo', img );

       const existe = fs.existsSync( pathVehiculo );

       if(!existe ){
           return path.resolve(  __dirname, '../assets/400x250.jpg' );
       }


        return pathVehiculo;

    }

}