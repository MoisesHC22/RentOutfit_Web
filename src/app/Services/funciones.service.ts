import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EstadoInterface } from '../Interfaces/estado.interface';
import { MunicipioInterface } from '../Interfaces/municipios.interfaces';
import { GeneroInterface } from '../Interfaces/genero.interfaces';
import { RequerimientosIniciarSesion, RequerimientosUsuario } from '../Interfaces/iniciarSesion.interface';
import { ListaVestimenta, RequerimientosVestimentas, VestimentaEstablecimientos } from '../Interfaces/Vestimenta.interface';
import { MisEstablecimientos, RequerimientosDeMisEstablecimientos, RequerimientosTiendasCercanas, TiendasCercanas } from '../Interfaces/tienda.interface';
import { ActualizarContrasena, RequerimientoCorreo, ValidarToken } from '../Interfaces/contrasena.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FuncionesService {


  private API_RentOutfit: string = environment.apiUrl;

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






  //Funciones para administrador
  TodosLosEstablecimientos(data: RequerimientosDeMisEstablecimientos) : Observable<TiendasCercanas[]> {
    return this.httpClient.post<TiendasCercanas[]>(this.API_RentOutfit + '/Administrador/TodosLosEstablecimientos', data);
  }

  ListaDeEstablecimientosParaAprobar(data: RequerimientosDeMisEstablecimientos): Observable<MisEstablecimientos[]> {
    return this.httpClient.post<MisEstablecimientos[]>(this.API_RentOutfit + '/Administrador/EstablecimientosParaAprobacion', data);
  }

  AprobarEstablecimiento(establecimiento: number): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Administrador/AprobarEstablecimiento', establecimiento);
  }

  DenegarEstablecimiento(establecimiento: number): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Administrador/DenegarEstablecimiento', establecimiento);
  }

  obtenerDatosPorCodigoPostal(codigoPostal: string): Observable<{ municipio: string, estado: string, asentamiento:string  } | null> {
    return this.httpClient.post<{ municipio: string, estado: string , asentamiento:string}>(this.API_RentOutfit + '/vendedor/CodigoPostalProxy', { codigoPostal }).pipe(
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


}
