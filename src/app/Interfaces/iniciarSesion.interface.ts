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