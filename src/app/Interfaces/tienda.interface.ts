export interface TiendaInterface {
    nombre: string;
    ubicacion: string;
    imagenUrl: string;
}

export interface TiendasCercanas {
    establecimientosID?: number;
    nombreEstablecimiento?: string;
    linkImagenEstablecimiento?: string;
    calle?: string;
    codigoPostal?: string;
    nombreEstado?: string;
    nombreMunicipio?: string;
}

export interface RequerimientosTiendasCercanas {
    estado?: string;
    municipio?: string;
    pagina?: number;
}

export interface DarDeAltaUnaTienda{
    usuarioID?: number;
    nombreEstablecimiento?: string;
    codigoPostal?: string;
    colonia?: string;
    calle?: string;
    noInt?: string;
    noExt?: string;
    estadoID?: number;
    municipio?: string;
    imagen?: File;
 }

 export interface InformacionTienda {
    establecimientosID?: number;
    nombreEstablecimiento?: string;
    linkImagenEstablecimiento?: string;
    nombreEstado?: string;
    municipio?: string;
    colonia?: string;
    calle?: string;
    noInt?: string;
    noExt?: string;
    codigoPostal?: string;
    linkImagenPerfil?: string;
    usuarioID?: number;
    nombreCliente?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
 }

 export interface RequerimientosDeMisEstablecimientos {
    usuario?: number;
    pagina?: number;
 }


 export interface MisEstablecimientos {
    establecimientosID?: number;
    nombreEstablecimiento?: string;
    linkImagenEstablecimiento?: string;
    ultimaModificacionEstablecimiento?: string | Date;
 }