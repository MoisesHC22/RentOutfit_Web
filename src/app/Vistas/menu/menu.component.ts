import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, Router } from '@angular/router';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell, faGear, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../Services/funciones.service';

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
  faDoorOpen = faDoorOpen;

  constructor(private Funciones: FuncionesService, private cookie: CookieService, private Rutas: Router){}

  token: string | null = null;
  usuarioID: number | null = null
  img: string | null = null;
  nombre: string | null = null;
  rol: string | null = null;
  
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

          this.usuarioID = obtener?.usuario ? Number(obtener.usuario) : null;
          
          if(this.usuarioID != null){
            this.ObtenerMiInformacion(this.usuarioID);
          }
        }
      }
  }

  ObtenerMiInformacion(usuarioID: number){
    this.Funciones.ObtenerCliente(usuarioID).subscribe({
      next: (response) => {
        this.cookie.set('info', response.token, { path: '/', secure: true})
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }

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


  CerrarSesion(): void {
    this.cookie.delete('token', '/');
    this.cookie.delete('info', '/');
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
