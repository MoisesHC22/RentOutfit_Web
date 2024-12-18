import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, Router } from '@angular/router';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell, faGear, faDoorOpen, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequerimientosUsuario } from '../../../Interfaces/iniciarSesion.interface';
import { ItemsCarrito } from '../../../Interfaces/Vestimenta.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  // #region Iconos
  faHouse = faHouse;
  faBag = faBagShopping;
  faShirt = faShirt;
  faSearch = faMagnifyingGlass;  
  faBell = faBell;
  faGear = faGear;
  faDoorOpen = faDoorOpen;
  faCartShopping = faCartShopping;
  // #endregion 

  constructor(private Funciones: FuncionesService, private cookie: CookieService, private Rutas: Router){}

  token: string | null = null;
  usuarioID: number | null = null;
  pagina: number | null = 1;
  img: string | null = null;
  nombre: string | null = null;

  rol: number | null = null;
  vendedor = false;
  Admin = false;

  searchQuery: string = '';

  ListaCarritoBack: ItemsCarrito[]=[];
  ActivarCarrito = false;
  
  ngOnInit(): void {

     this.token = this.Funciones.obtenerToken();
     if (this.token) {
       const obtener = this.Funciones.DecodificarToken(this.token);

       this.img = obtener?.imagen || null;
       this.nombre = obtener?.nombre || null;
       this.rol = obtener?.role || null;

       if(this.rol == 2)
       {
         this.vendedor = true;
       }
       else if(this.rol == 3) {
         this.Admin = true;
       }

      this.usuarioID = obtener?.usuario ? Number(obtener.usuario) : null;

      if (this.usuarioID) {
        this.Funciones.CargarCarrito(this.usuarioID).subscribe({
          next: (result: ItemsCarrito[]) => {
              this.ActivarCarrito = result.length > 0;
          },
          error: (err) => {
            console.error("Error al cargar el carrito:", err);
          },
        });
  
        this.Funciones.carritoCambiado$.subscribe((estado) => {
          this.ActivarCarrito = estado;
        });

        this.ObtenerMiInformacion(this.usuarioID, this.pagina!);
      }

     }
  }

  CerrarSesion(): void {
   this.Funciones.CerrarSesion();
  }


  ObtenerMiInformacion(usuarioID: number, pagina: number) {

    const data : RequerimientosUsuario =
    {
      usuarioID: this.usuarioID!,
      pagina: this.pagina!,
      activar: false
    }

    this.Funciones.ObtenerCliente(data).subscribe({
      next: (response) => {
        this.cookie.set('info', response.token, { path: '/', secure: true})
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
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
  
  TodosLosEstablecimientos(usuario?: number) :void {
    if(usuario) {
      this.Rutas.navigate(['/Administrador/TodosEstablecimientos', this.usuarioID]);
    }
    else
    {
      console.error('Ocurrio un error!.');
    }
  }


  buscarVestimenta(): void {
    if(this.searchQuery.trim()) {
      this.Rutas.navigate(['/Cliente/vestimentas'], { queryParams: { q: this.searchQuery } });
    }
  }


  misRentas(usuario?: number) : void {
    if(usuario) {
      this.Rutas.navigate(['/Cliente/misRentas', this.usuarioID]);
    } else {
      console.error('Ocurrio un error!.');     
    }
  }



}
