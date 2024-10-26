import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoInterface } from '../Interfaces/estado.interface';
import { MunicipioInterface } from '../Interfaces/municipios.interfaces';
import { GeneroInterface } from '../Interfaces/genero.interfaces';
import { RequerimientosIniciarSesion } from '../Interfaces/iniciarSesion.interface';
import { InformacionVestimenta, ListaVestimenta, RequerimientosVestimentas } from '../Interfaces/Vestimenta.interface';
import { RequerimientosTiendasCercanas, TiendasCercanas } from '../Interfaces/tienda.interface';


@Injectable({
  providedIn: 'root'
})
export class FuncionesService {


  private API_RentOutfit: string = 'https://localhost:7110';


  constructor(private httpClient: HttpClient) { }

   
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

  IniciarSesion(data: RequerimientosIniciarSesion) : Observable<any> 
  {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/IniciarSesion', data);
  }

  RegistrarCliente( formData: FormData) : Observable<any>
  {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/RegistrarCliente', formData);
  }

  ObtenerCliente(usuarioID: number) : Observable<any>
  {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/ObtenerCliente', usuarioID)
  }



  
  MostrarVestimentas(data: RequerimientosVestimentas): Observable<ListaVestimenta[]> {
    return this.httpClient.post<ListaVestimenta[]>(this.API_RentOutfit + '/Cliente/MostrarVestimentas', data);
  }

  EstablecimientosCercanos(data: RequerimientosTiendasCercanas): Observable<TiendasCercanas[]> {
    return this.httpClient.post<TiendasCercanas[]>(this.API_RentOutfit + '/Cliente/EstablecimientosCercanos', data);
  }

  InformacionVestimenta(vestimenta: number): Observable<any> {
    return this.httpClient.post(this.API_RentOutfit + '/Cliente/InformacionVestimenta', vestimenta);
  }
  
  obtenerDatosDesdeGeocoding(url: string): Observable<any> {
    return this.httpClient.get(url);
  }
  


    
  DarDeAltaUnVendedor(usuario: number): Observable<any>{
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

}
