export interface TiendaInterface {
    nombre: string;
    ubicacion: string;
    imagenUrl: string;
}

export interface TiendasCercanas {
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