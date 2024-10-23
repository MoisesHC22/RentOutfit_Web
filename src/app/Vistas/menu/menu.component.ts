import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  faHouse = faHouse;
  faBag = faBagShopping;
  faShirt = faShirt;
  faSearch = faMagnifyingGlass;  
  faBell = faBell;
  faGear = faGear;

  constructor(private cookie: CookieService){}

  token: string | null = null;
  img: string | null = null;
  nombre: string | null = null;
  
  ngOnInit(): void {
    
    this.token = this.cookie.get('token');
    
    if (this.token)
      {
        const tokenValido = this.VerificaExpiracion(this.token);

        if(!tokenValido){
          this.CerrarSesion();
          window.location.reload();
        }
        else {
          const obtener = this.DecodificarToken(this.token);
          this.img = obtener?.imagen || null;
          this.nombre = obtener?.nombre || null;
        }
        
      }
  }

  DecodificarToken(token: string): any {
    try 
    {
      const payload = token.split('.')[1];
      const descodificacionPayload = atob(payload);
      return JSON.parse(descodificacionPayload);
    }
    catch(error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  CerrarSesion(): void {
    this.cookie.delete('token', '/');
    this.token = null;
    this.img = null;
    this.nombre =null;
  }

  VerificaExpiracion(token: string): boolean {
    const descodificar = this.DecodificarToken(token);
    
    if(descodificar && descodificar.exp) {
      const tiempoActual = Math.floor(Date.now() / 1000);
      return descodificar.exp > tiempoActual;
    }
    return false;
  }

}
