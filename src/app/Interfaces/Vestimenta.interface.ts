export interface ListaVestimenta {
    vestimentaID?: number;
    nombrePrenda?: string;
    precioPorDia?: number;
    imagen1?: string;
    nombreTalla?: string;
    nombreEstilo?: string;
    nombreEstablecimiento?: string;
}

export interface InformacionVestimenta {
    vestimentaID?: number;
    nombrePrenda?: string;
    precioPorDia?: string;
    stock?: number;
    fechaDePublicacion?: Date;
    vestimentaEstatus?: boolean;
    descripcion?: string;
    imagen1?: string;
    imagen2?: string;
    imagen3?: string;
    imagen4?: string;

    nombreTalla?: string;
    nombreEstilo?: string;
}

export interface RequerimientosVestimentas {
    estado?: string;
    municipio?: string;
    pagina?: number;
}

export interface VestimentaEstablecimientos {
    establecimiento?: number;
    usuario?: number;
    pagina?: number;
}