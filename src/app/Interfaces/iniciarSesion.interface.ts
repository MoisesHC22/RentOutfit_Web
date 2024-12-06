export interface IniciarSesionInterface {
    detalleRolID?: number;
    nombreCliente?: string;
    linkImagenPerfil?: string;
    nombreEstado?: string;
    municipio?: string;
}

export interface RequerimientosIniciarSesion {
    email?: string;
    contrasena?: string;
}

export interface RequerimientosUsuario {
    usuarioID?: number;
    pagina?: number;
    activar?: boolean;
}

export interface ListaDePedidoRequerimientos {
    usuarioID?: number;
    mes?: number;
    ano?: number;
    pagina?: number;
}

export interface ListaPedido {
    detalleVentaID?: number;
    imagen1?: string;
    nombrePrenda?: string;
    fechaPrestamo?: Date;
    totalRegistros?: number;
}