import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, retry } from 'rxjs';
import { EstadoInterface } from '../Interfaces/estado.interface';
import { MunicipioInterface } from '../Interfaces/municipios.interfaces';
import { GeneroInterface } from '../Interfaces/genero.interfaces';
import { ListaDePedidoRequerimientos, ListaPedido, RequerimientosIniciarSesion, RequerimientosUsuario } from '../Interfaces/iniciarSesion.interface';
import { CarritoDeCompra, EstilosInterfaces, ListaVestimenta, PagoCarrito, RequerimientosVestimentas, TallasInterfaces, VestimentaEstablecimientos } from '../Interfaces/Vestimenta.interface';
import { ConsultarPedidos, MisEstablecimientos, RequerimientosConsultarPedidos, RequerimientosDeMisEstablecimientos, RequerimientosDenegarEstablecimientos, RequerimientosTiendasCercanas, TiendasCercanas } from '../Interfaces/tienda.interface';
import { ActualizarContrasena, RequerimientoCorreo, ValidarToken } from '../Interfaces/contrasena.interface';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  private API_RentOutfit: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

// #region Funciones para descodificar
  DecodificarToken(token: string): any {
    try 
    {
      const payload = token.split('.')[1];
      const descodificacionPayload = this.base64UrlCode(payload);
    return JSON.parse(decodeURIComponent(escape(descodificacionPayload)));
    }
    catch(error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  base64UrlCode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    switch (base64.length % 4) {
    case 2: base64 += '=='; break;
    case 3: base64 += '='; break;
  }
  return atob(base64);
  }

  obtenerDatosDesdeGeocoding(url: string): Observable<any> {
    return this.httpClient.get(url);
  }
// #endregion 

  
// #region Funciones para obtener listas
  ObtenerClientes(usuarioID: string): Observable<any>{
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/ObtenerCliente?usuarioID=', usuarioID);
  }

  ObtenerEstados() : Observable<EstadoInterface[]> {
    return this.httpClient.post<EstadoInterface[]>(this.API_RentOutfit + '/Listas/ObtenerEstados', {});
  }

  ObtenerMunicipios(estadoID: number) : Observable<MunicipioInterface[]> {
    return this.httpClient.post<MunicipioInterface[]>(this.API_RentOutfit + '/Listas/ObtenerMunicipios', estadoID);
  }

  ObtenerGeneros() : Observable<GeneroInterface[]> {
    return this.httpClient.post<GeneroInterface[]>(this.API_RentOutfit + '/Listas/ObtenerGeneros', {})
  }

  ObtenerEstilos() : Observable<EstilosInterfaces[]> {
    return this.httpClient.post<EstilosInterfaces[]>(this.API_RentOutfit + '/Listas/ObtenerEstilos', {})
  }

  ObtenerTallas() : Observable<TallasInterfaces[]>{
    return this.httpClient.post<TallasInterfaces[]>(this.API_RentOutfit + '/Listas/ObtenerTallas', {})
  }
// #endregion 


// #region Funciones para cliente
  IniciarSesion(data: RequerimientosIniciarSesion) : Observable<any> 
  {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/IniciarSesion', data);
  }

  RegistrarCliente( formData: FormData) : Observable<any>
  {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/RegistrarCliente', formData);
  }

  MostrarVestimentas(data: RequerimientosVestimentas): Observable<ListaVestimenta[]> {
    return this.httpClient.post<ListaVestimenta[]>(this.API_RentOutfit + '/Cliente/MostrarVestimentas', data);
  }

  InformacionVestimenta(vestimenta: number): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/InformacionVestimenta', vestimenta);
  }

  EstablecimientosCercanos(data: RequerimientosTiendasCercanas): Observable<TiendasCercanas[]> {
    return this.httpClient.post<TiendasCercanas[]>(this.API_RentOutfit + '/Cliente/EstablecimientosCercanos', data);
  }

  ObtenerCliente(data: RequerimientosUsuario) : Observable<any>
  {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/ObtenerCliente', data)
  }

  InformacionEstablecimiento(establecimiento: number) : Observable<any>{
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/InformacionEstablecimiento', establecimiento);
  }

  VestimentasEstablecimientos(data: VestimentaEstablecimientos) : Observable<ListaVestimenta[]> {
    return this.httpClient.post<TiendasCercanas[]>(this.API_RentOutfit + '/Cliente/VestimentasDeEstablecimientos', data);
  }
// #endregion 


// #region Funciones para vendedor
  DarDeAltaUnVendedor(usuario: number): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Vendedor/DarDeAltaUnVendedor', usuario);
  }
   
  DarDeAltaEstablecimiento(formData: FormData) : Observable<any>
  {
    return this.httpClient.post(this.API_RentOutfit + '/Vendedor/DarDeAltaEstablecimiento', formData);
  }

  RegistrarVestimenta(formData: FormData) : Observable<any>
  {
    return this.httpClient.post(this.API_RentOutfit + '/Vendedor/RegistrarVestimenta', formData);
  }

  MisEstablecimientos(data: RequerimientosDeMisEstablecimientos) : Observable<MisEstablecimientos[]> {
    return this.httpClient.post<MisEstablecimientos[]>(this.API_RentOutfit + '/Vendedor/MisEstablecimientos', data);
  }

  generarPdfEstablecimientos(usuarioID: number): Observable<Blob> {
    return this.httpClient.post(this.API_RentOutfit + '/Vendedor/GenerarPdfEstablecimientos', usuarioID, { responseType: 'blob'});
  }

  ConsultarPedidos(data: RequerimientosConsultarPedidos) : Observable<ConsultarPedidos[]> {
    return this.httpClient.post<ConsultarPedidos[]>(this.API_RentOutfit + '/Vendedor/consultarPedidos', data);
  }
// #endregion   


// #region Funciones para recuperar la contraseña
  EnviarCorreo(data: RequerimientoCorreo): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/RecuperarContrasena/ObtenerToken', data);
  }
  
  ValidarToken(data: ValidarToken): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/RecuperarContrasena/validarToken', data);
  }

  ActualizarContrasena(data: ActualizarContrasena): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/RecuperarContrasena/ActualizarContrasena', data);
  }
// #endregion 


// #region Funciones para administrador
  TodosLosEstablecimientos(data: RequerimientosDeMisEstablecimientos) : Observable<TiendasCercanas[]> {
    return this.httpClient.post<TiendasCercanas[]>(this.API_RentOutfit + '/Administrador/TodosLosEstablecimientos', data);
  }

  ListaDeEstablecimientosParaAprobar(data: RequerimientosDeMisEstablecimientos): Observable<{ establecimientos: MisEstablecimientos[], totalRegistros: number }> {
    return this.httpClient.post<{ establecimientos: MisEstablecimientos[], totalRegistros: number }>(this.API_RentOutfit + '/Administrador/EstablecimientosParaAprobacion', data);
  }

  AprobarEstablecimiento(establecimiento: number): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Administrador/AprobarEstablecimiento', establecimiento);
  }

  DenegarEstablecimiento(data: RequerimientosDenegarEstablecimientos): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Administrador/DenegarEstablecimiento', data);
  }

  
// #endregion 


// #region Funciones para obtener direccion
obtenerDatosPorCodigoPostal(codigoPostal: string): Observable<{ municipio: string, estado: string, asentamiento:string  } | null> {
  return this.httpClient.post<{ municipio: string, estado: string , asentamiento:string}>(this.API_RentOutfit + '/CodigoPostalProxy/ObtenerDireccion', { codigoPostal }).pipe(
    map(response => {
      console.log('Respuesta cruda de la API:', response); // Comprobar la respuesta
      if (response && response.municipio && response.estado && response.asentamiento) {
        return { municipio: response.municipio, estado: response.estado, asentamiento:response.asentamiento};
      }
      console.warn('No se encontraron los campos esperados en la respuesta de la API.');
      return null;
    })
  );
}
// #endregion 


// #region Funciones para capturar login
   private cookie = inject(CookieService);
   private Rutas = inject(Router);
   private estadoSesion = new BehaviorSubject<{ logeo: boolean, darDeAlta: boolean }>({ logeo: true, darDeAlta: false });
   estadoSesion$ = this.estadoSesion.asObservable();

   private validar = new BehaviorSubject<boolean>(this.hasToken());
   validar$ = this.validar.asObservable();
   
   iniciarlizarEstadoSesion(): void {
    const token = this.obtenerToken();
    if(token) {
      const usuario = this.DecodificarToken(token);
      if(usuario && (usuario.role == 1 || usuario.role == 2 || usuario.role == 3)){
        this.actualizarEstadoSesion(false, true);
      } else {
        this.actualizarEstadoSesion(true, false);
      }
    } else {
      this.actualizarEstadoSesion(true, false);
    }
   }

   private hasToken(): boolean {
    return !!this.cookie.get('token');
   }

   actualizarEstadoSesion(logeo: boolean, darDeAlta: boolean) {
    this.estadoSesion.next({ logeo, darDeAlta});
   }

   Login(token: string): void {
    this.cookie.set('token', token, {path: '/', secure: true});
    this.validar.next(true);
    this.actualizarEstadoSesion(false, true);
  }

  CerrarSesion(): void {
    this.cookie.delete('token', '/');
    this.cookie.delete('info', '/');
    this.validar.next(false);
    this.actualizarEstadoSesion(true, false);
    this.Rutas.navigate(['/Cliente/home']).then(() => {
      window.location.reload();
    });
  }

  obtenerToken(): string | null {
    return this.cookie.get('token');
  }
// #endregion 


// #region Funciones para carrito de compras
private CarritoActualizado = new BehaviorSubject<boolean>(false);
carritoCambiado$ = this.CarritoActualizado.asObservable();

notificarCambio(estado: boolean): void {
  this.CarritoActualizado.next(estado);
}

ModificarCarrito(data: CarritoDeCompra) : Observable<any> 
{
  return this.httpClient.post(this.API_RentOutfit + '/Cliente/ModificarCarrito', data);
}

CargarCarrito(usuarioID: number) : Observable<any>
{
  return this.httpClient.post(this.API_RentOutfit + '/Cliente/CargarCarrito', usuarioID);
}

GenerarToken(usuarioID: number): Observable<any>
{
  return this.httpClient.post(this.API_RentOutfit + '/Cliente/GenerarTokenMercadoPago', usuarioID);
}

GuadarPago(data: PagoCarrito): Observable<any>
{
  return this.httpClient.post(this.API_RentOutfit + '/Cliente/GuardarPago', data);
}

ListaDeRentas(data: ListaDePedidoRequerimientos): Observable<ListaPedido[]>
{
  return this.httpClient.post<ListaPedido[]>(this.API_RentOutfit + '/Cliente/ListaDeRentas', data);
}
// #endregion 


}