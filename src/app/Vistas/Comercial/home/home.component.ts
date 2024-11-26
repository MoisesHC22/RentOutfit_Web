import { Component, OnInit } from '@angular/core';
import { RequerimientosTiendasCercanas, TiendaInterface, TiendasCercanas } from '../../../Interfaces/tienda.interface';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell, faDownload, faStore} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faWhatsapp, faXTwitter} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ReactiveFormsModule } from '@angular/forms';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet, RouterModule, RouterLink, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PagoCarrito } from '../../../Interfaces/Vestimenta.interface';

declare var google: any;

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

// #region Iconos
  faHouse = faHouse;
  faBag = faBagShopping;
  faShirt = faShirt;
  faSearch = faMagnifyingGlass;  
  faBell = faBell;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faWhatsapp = faWhatsapp;
  faDownload = faDownload;
  faStore = faStore;
  faXTwitter = faXTwitter;
// #endregion 

  constructor(private Rutas: Router, private Funciones: FuncionesService, private sanitizer: DomSanitizer, private cookie: CookieService, private Ruta: ActivatedRoute){}

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

  OpcionLogeo: Boolean | null = null;
  OpcionDarDeAlta: Boolean | null = null;
  paymentID: string | null = null;
  
  ngOnInit(): void {
    this.cookie.delete('ubicacion', '/');

    this.obtenerUbicacion();

    this.Funciones.iniciarlizarEstadoSesion();
    this.Funciones.estadoSesion$.subscribe(({logeo, darDeAlta}) => {
      this.OpcionLogeo = logeo;
      this.OpcionDarDeAlta = darDeAlta;
    });

    this.token = this.Funciones.obtenerToken();
    if(this.token) {
      const obtener = this.Funciones.DecodificarToken(this.token);
      this.rol = obtener?.role || null;
      this.usuario = obtener?.usuario ? Number(obtener.usuario) : null;
    }

    this.Ruta.queryParams.subscribe((params) => {
      this.paymentID = params['payment_id'] || null;
      if (this.paymentID) {
        console.log(`Payment ID: ${this.paymentID}`);
        this.GuardarCarrito();
      }
    })
  }
  
  animationExito: AnimationOptions = {
    path: '/Animaciones/Correcto.json'
  }


// #region Funciones para obtener los establecimientos cercanos
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
        this.cargarGoogleMaps();
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

  cargarGoogleMaps(): void {
    if(typeof (window as any).google === 'undefined' || typeof (window as any).google.maps === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCDTIozOvb6f5hDCDyvkWziUMrfQzDjQQk&callback=initMap';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      (window as any).initMap = () => {
        this.generarMapaConMarcador();
      };
    } else {
      this.generarMapaConMarcador();
    }
  }

  generarMapaConMarcador(): void {
    const userLocation = { lat: this.latitud, lng: this.longitud };
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: userLocation,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: true,
      fullscreenControl: true
    });

    new google.maps.Marker({
      position: userLocation,
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Punto rojo
      },
      title: "Tu ubicación",
    });
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
// #endregion 

// #region Funciones para habilitar las opciones del menu segun su rol 
  darDeAltaVendedor(usuario : number){
    this.Funciones.DarDeAltaUnVendedor(usuario).subscribe({
      next: (result) => {

        if(result.tipoError === 0 || result.tipoError === 3) 
        {
          this.Rutas.navigate(['/Cliente/NuevoVendedor']);
          this.OpcionDarDeAlta = false;
        } else {
          console.error('Ocurrio un error.');
        }

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
  // #endregion 


  modalExito = false;

  GuardarCarrito(): void {
    if(this.paymentID)
    {
       const data: PagoCarrito = {
        usuarioId: this.usuario!,
        paymentId: this.paymentID!
       }

       this.Funciones.GuadarPago(data).subscribe({
        next: (response) => {
          if( response.status === 'approved')
          {
            this.modalExito = true;
          } else {
            console.log("El pago no fue aprobado. Estado:", response.status);
          }
        },
        error: (err) => {
          console.error("No se guardo el carrito", err);
        }
      });
    }
  }


  cerrarModal() : void {
    this.modalExito = false;
    this.Rutas.navigate(['/Cliente/home']).then(() => {
      window.location.reload();
    });

  }


}
 