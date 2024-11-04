import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FuncionesService } from '../../../Services/funciones.service';

@Component({
  selector: 'app-menu-adm',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './menu-adm.component.html',
  styleUrl: './menu-adm.component.css'
})
export class MenuAdmComponent implements OnInit{

  token: string | null = null;
  usuarioID: number | null = null
  img: string | null = null;
  nombre: string | null = null;

  
  constructor(private Funciones: FuncionesService, private cookie: CookieService, private readonly Rutas: Router, private form: FormBuilder){}

  ngOnInit(): void {
   
    this.token  = this.cookie.get('token');

    if(this.token)
    {
      const obtener = this.Funciones.DecodificarToken(this.token);

      this.img = obtener?.imagen || null;
      this.nombre = obtener?.nombre || null;

      this.usuarioID = obtener?.usuario ? Number(obtener.usuario) : null;
    }
  }


  regresarCliente(): void {
    this.Rutas.navigate(['/Cliente/home'])
  }
  
  TodosLosEstablecimientos(usuario?: number) : void {
    if(usuario) {
      this.Rutas.navigate(['/Administrador/TodosEstablecimientos', this.usuarioID]);
    }
    else
    {
      console.error('Ocurrio un error!.');
    }
  }

  TodosLosUsuarios(usuario?: number) : void {
    if(usuario) {
      this.Rutas.navigate(['/Administrador/TodosLosUsaurios', this.usuarioID]);
    }
    else
    {
      console.error('Ocurrio un error!.');
    }
  }

  TodasLasPeticiones(usuario?: number) : void {
    if(usuario) {
      this.Rutas.navigate(['/Administrador/Peticiones', this.usuarioID]);
    }
    else
    {
      console.error('Ocurrio un error!.');
    }
  }

}
