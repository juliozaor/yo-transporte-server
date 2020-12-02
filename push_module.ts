const modelos = require('./models');
import  { Sequelize} from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

const vapid = require('./vapid.json');
const URLSafeBase64 = require('urlsafe-base64');


const fs = require('fs');

const webpush = require('web-push');

let suscripciones: any = require('./subs-db.json');


webpush.setVapidDetails(
  'mailto:julio.jimenez@cun.edu.co',
  vapid.publicKey,
  vapid.privateKey
);

module.exports.getKey = () => {
    return URLSafeBase64.decode( vapid.publicKey );
};


module.exports.addSubscription = ( suscripcion: any ) => {

    suscripciones.push( suscripcion );

    fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones));

}

module.exports.sendPush = ( post: any, destino: any, idDestino = "", ciudad: any ) => {

    let ciudadDestino: any;
    const notificacionesEnviadas: any = [];

    suscripciones.forEach( (suscripcion, i) => {



        if(idDestino !== ""){

        if( suscripcion.usuario === idDestino){



        const pushProm = webpush.sendNotification( suscripcion , JSON.stringify( post ))
        .then( console.log('Notificación enviada'))
        .catch( err => {
            console.log('La notificación falló');

            if( err.statusCode === 410 ) { // GONE, ya no existe
                suscripciones[i].borrar = true;

            }
        });

        notificacionesEnviadas.push( pushProm );



        }
    }else{

        if(destino === 'i'){

            modelos.Conductores.findAll({ where: {esInterurbano: '1'}}).then(function(conductorDB:any) {


                conductorDB.forEach(conductor => {

                    modelos.Usuarios.findOne( {
                        attributes: ['codCiudad' ], 
                        where: {idUsuario: conductor.idConductor}}).then(function(usuarioDB:any) { 
               
                       ciudadDestino = usuarioDB.codCiudad;
                      
                



                    if( suscripcion.usuario === conductor.idConductor && ciudadDestino == ciudad){



                        const pushProm = webpush.sendNotification( suscripcion , JSON.stringify( post ))
                        .then( console.log('Notificación enviada'))
                        .catch( err => {
                            console.log('La notificación falló');
                
                            if( err.statusCode === 410 ) { // GONE, ya no exist
                                suscripciones[i].borrar = true;
                
                            }
                        });
                
                        notificacionesEnviadas.push( pushProm );
                
                
                
                        }

     
                    });



                });
                         
                  
        });


        }else if(destino === 'u'){

            modelos.Conductores.findAll({ where: {esInterurbano: '0'}}).then(function(conductorDB:any) {


                

                conductorDB.forEach(conductor => {

                    modelos.Usuarios.findOne( {
                        attributes: ['codCiudad' ], 
                        where: {idUsuario: conductor.idConductor}}).then(function(usuarioDB:any) { 
                            
                        ciudadDestino = usuarioDB.codCiudad;

                    if( suscripcion.usuario === conductor.idConductor  && ciudadDestino == ciudad){



                        const pushProm = webpush.sendNotification( suscripcion , JSON.stringify( post ))
                        .then( console.log('Notificación enviada'))
                        .catch( err => {
                            console.log('La notificación falló');
                
                            if( err.statusCode === 410 ) { // GONE, ya no existe
                                suscripciones[i].borrar = true;
                
                            }
                        });
                
                        notificacionesEnviadas.push( pushProm );
                
                
                
                        }



                    });

                });
                         
                  
        });

        }

    }



    });

    Promise.all( notificacionesEnviadas ).then( () => {
        suscripciones = suscripciones.filter( subs => !subs.borrar );
        fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones));
    })

}