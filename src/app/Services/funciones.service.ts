import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoInterface } from '../Interfaces/estado.interface';
import { MunicipioInterface } from '../Interfaces/municipios.interfaces';
import { GeneroInterface } from '../Interfaces/genero.interfaces';
import { RequerimientosIniciarSesion, RequerimientosUsuario } from '../Interfaces/iniciarSesion.interface';
import { InformacionVestimenta, ListaVestimenta, RequerimientosVestimentas, VestimentaEstablecimientos } from '../Interfaces/Vestimenta.interface';
import { MisEstablecimientos, RequerimientosDeMisEstablecimientos, RequerimientosTiendasCercanas, TiendasCercanas } from '../Interfaces/tienda.interface';
import { ActualizarContrasena, RequerimientoCorreo, ValidarToken } from '../Interfaces/contrasena.interface';


@Injectable({
  providedIn: 'root'
})
export class FuncionesService {


  private API_RentOutfit: string = 'https://localhost:7110';


  constructor(private httpClient: HttpClient) { }

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



  //Funciones para Cliente

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




  //Funciones para vendedor

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






  //Funciones para recuperar contraseña

  EnviarCorreo(data: RequerimientoCorreo): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/RecuperarContrasena/ObtenerToken', data);
  }
  
  ValidarToken(data: ValidarToken): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/RecuperarContrasena/validarToken', data);
  }

  ActualizarContrasena(data: ActualizarContrasena): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/RecuperarContrasena/ActualizarContrasena', data);
  }




}
