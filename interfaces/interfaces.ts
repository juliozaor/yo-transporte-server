export interface OfertaConductor {
    idOfertaConductor?: string;
    codVehiculo?: string;
    comentarios?: string;
    fecha_salida?: string;
    hora_salida?: string;
    origen?: string;
    destino?: string;
    tarifa?: string;
    cantPasajeros?: string;
    capacidadCarga?: string;
    paqueteriaMensajeria?: string;
    terminada?: boolean;
    codTipoServicio?: string;
    codConductor?: string;
  }

export interface OfertaConductorCompleta {
   oferta?: OfertaConductor;
    conductor?: Conductor;
    usuario?: Usuario;
  }

  export interface Conductor {
    idConductor?: string;
    licencia?: string;
    foto1Licencia?: string;
    foto2Licencia?: string;
    ciudad?: string;
    direccion?: string;
    codTipoVehiculo?: string;
    estado?: boolean;
  }

  
    export interface OfertasArregloC {
      count: number;
      rows: OfertaConductor[];
    }

  export interface UsuarioConductor {
    idConductor?: string;
    licencia?: string;
    foto1Licencia?: string;
    foto2Licencia?: string;
    ciudad?: string;
    direccion?: string;
    codTipoVehiculo?: string;
    estado?: boolean;
    usuario?: Usuario;
  }

  export interface Usuario {
    idUsuario?: string;
    cedula?: string;
    nombre?: string;
    email?: string;
    password?: string;
    telefono?: string;
    foto?: string;
  }