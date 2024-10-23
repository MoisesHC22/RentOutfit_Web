import { Component } from '@angular/core';
import { TiendaInterface } from '../../../Interfaces/tienda.interface';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell,} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faWhatsapp} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AppComponent,
    FontAwesomeModule,
    LottieComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
  
})

export class HomeComponent {
  tiendas: TiendaInterface[] = [
    { nombre: 'Disfraces Diana', ubicacion: 'Centro, 42950 Tula, Hgo.', imagenUrl: '/Recursos/DisfracesDiana.png' },
    { nombre: 'Trajes y calzado Zoto', ubicacion: 'Centro, 42844 EL Carmen, Hgo.', imagenUrl: '/Recursos/TiendaZoto.png' },
    { nombre: 'King of Flow', ubicacion: 'Tepeji', imagenUrl: '/Recursos/King.png' },
    { nombre: 'Suelas y disfraces', ubicacion: '16 de Enero', imagenUrl: '/Recursos/Suelas.png' },
    { nombre: 'My Outfit', ubicacion: 'San Marcos', imagenUrl: '/Recursos/My Outfit.png' },
    { nombre: 'Rent', ubicacion: 'La sesenta y uno', imagenUrl: '/Recursos/perro.jpg' },
  ];

  faHouse = faHouse;
  faBag = faBagShopping;
  faShirt = faShirt;
  faSearch = faMagnifyingGlass;  
  faBell = faBell;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faWhatsapp = faWhatsapp;

}
