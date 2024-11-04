import { Component, OnInit } from '@angular/core';
import { RequerimientosTiendasCercanas, TiendaInterface, TiendasCercanas } from '../../../Interfaces/tienda.interface';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell,} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { ReactiveFormsModule } from '@angular/forms';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    AppComponent,
    FontAwesomeModule,
    LottieComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
  
})

export class HomeComponent implements OnInit {

  faHouse = faHouse;
  faBag = faBagShopping;
  faShirt = faShirt;
  faSearch = faMagnifyingGlass;  
  faBell = faBell;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faWhatsapp = faWhatsapp;

  constructor(private Rutas: Router, private Funciones: FuncionesService, private sanitizer: DomSanitizer, private cookie: CookieService){}

  token: string | null = null;
  estado: string | null = null;
  municipio: string | null = null;
  pagina: number | null = null;

  TiendaList: TiendasCercanas[]=[];

  latitud!: number;
  longitud!: number;
  mapaSafeUrl!: SafeResourceUrl;
  error!: string;

  usuario: number | null = null;
  rol: number | null = null;
  OpcionDarDeAlta = false;
  

  ngOnInit(): void {
    this.cookie.delete('ubicacion', '/');

    this.obtenerUbicacion();


    this.token = this.cookie.get('token');

    if(this.token){
      const obtener = this.Funciones.DecodificarToken(this.token);

      this.rol = obtener?.role || null;
      this.usuario = obtener?.usuario ? Number(obtener.usuario) : null;


      if(this.rol == 1){
        this.OpcionDarDeAlta = true;
      }
      

    }

  }
  
  ListaTiendas(estado: string, municipio: string){
    
    const data: RequerimientosTiendasCercanas = {
      estado: this.estado!,
      municipio: this.municipio!,
      pagina: this.pagina!
    };

    this.Funciones.EstablecimientosCercanos(data).subscribe({
      next: (result) => {
        this.TiendaList = result;
      },
      error: (err) =>{
        console.log("Ocurrio un error.");
      }
    });
  }
  
  obtenerUbicacion(): void {
    if (typeof window !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitud = position.coords.latitude;
        this.longitud = position.coords.longitude;
        this.generarMapaConMarcador();
        this.obtenerEstadoMunicipio(this.latitud, this.longitud);
      },
      (error) => {
        this.error = 'No se pudo obtener la ubicación';
        console.error('Error obteniendo la ubicación:', error);
      }
    );
    } else {
      this.error = 'La geolocalización no es compatible con este navegador';
    }
  }

  generarMapaConMarcador(): void {
    const url = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCDTIozOvb6f5hDCDyvkWziUMrfQzDjQQk&center=${this.latitud},${this.longitud}&zoom=14`;
    
    this.mapaSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  obtenerEstadoMunicipio(latitud: number, longitud: number): void {
    const apiKey = 'AIzaSyCDTIozOvb6f5hDCDyvkWziUMrfQzDjQQk';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${apiKey}`;
    
    this.Funciones.obtenerDatosDesdeGeocoding(url).subscribe(
      (response: any) => {

        // console.log('Respuesta completa de la API:', response);

        let estado: string | null = null;
        let municipio: string | null = null;

        if (response && response.status === 'OK' && Array.isArray(response.results) && response.results.length > 0) {
          response.results.forEach((resultado: any) => {

            if (resultado && Array.isArray(resultado.address_components)) {
              resultado.address_components.forEach((componente: any) => {
                if (componente.types.includes('administrative_area_level_1')) {
                  estado = componente.long_name;
                }
                if (componente.types.includes('administrative_area_level_2')) {
                  municipio = componente.long_name;
                }
              });
            }
          });
  
          if (estado && (estado as string).startsWith('Estado de')) {
            estado = (estado as string).replace('Estado de ', '');
          }

          if (estado && municipio) {
            console.log(`Estado: ${estado}, Municipio: ${municipio}`);
            this.estado = estado;
            this.municipio = municipio;

            const ubicación = {estado: this.estado, municipio: this.municipio};
            this.cookie.set('ubicacion', JSON.stringify(ubicación), 1, '/');

            this.ListaTiendas(this.estado, this.municipio);

          } else {
            console.log('No se encontraron los datos de estado y municipio.');
          }
        } else {
          console.error('La respuesta de la API no es válida o no contiene resultados.');
        }
      },
      (error) => {
        console.error('Error llamando a la API de Google Geocoding:', error);
      }
    );
  }





  darDeAltaVendedor(usuario : number){
    this.Funciones.DarDeAltaUnVendedor(usuario).subscribe({
      next: (result) => {
        this.OpcionDarDeAlta = false;
        this.Rutas.navigate(['/Cliente/NuevoVendedor']);
      },
      error: (err) =>{
        console.log("Ocurrio un error.");
      }
    });
  }



  MasInformacionEstablecimiento(establecimiento?: number): void {
    if(establecimiento){
      this.Rutas.navigate(['/Cliente/masInformacionEstablecimiento', establecimiento]);
    } else {
      console.error('No se obtuvo la informacion del establecimiento.');
    }
  }

}
 