import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, Router } from '@angular/router';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell, faGear, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    FontAwesomeModule,
    ReactiveFormsModule,
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

  rol: number | null = null;
  vendedor = false;
  Admin = false;
  
  ngOnInit(): void {
    
    this.token = this.cookie.get('token');
    
    if (this.token)
      {
        const tokenValido = this.VerificaExpiracion(this.token);

        if(!tokenValido){
          this.CerrarSesion();
        }
        else {

          const obtener = this.Funciones.DecodificarToken(this.token);
          
          this.img = obtener?.imagen || null;
          this.nombre = obtener?.nombre || null;
          this.rol = obtener?.role || null;
          
          if(this.rol == 2) {
            this.vendedor = true;
          } else if (this.rol == 3) {
            this.Admin = true;
          }

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

  CerrarSesion(): void {
    this.cookie.delete('token', '/');
    this.cookie.delete('info', '/');
    this.token = null;
    this.img = null;
    this.nombre =null;
  }

  VerificaExpiracion(token: string): boolean {
    const descodificar = this.Funciones.DecodificarToken(token);
    
    if(descodificar && descodificar.exp) {
      const tiempoActual = Math.floor(Date.now() / 1000);
      return descodificar.exp > tiempoActual;
      window.location.reload();
    }
    return false;
  }

  MisEstablecimientos(usuario?: number) : void {
    if(usuario) {
      this.Rutas.navigate(['/Vendedor/misEstablecimientos', usuario]);
    } else {
      console.error('No se encontro tus establecimientos.');
    }
  }

}