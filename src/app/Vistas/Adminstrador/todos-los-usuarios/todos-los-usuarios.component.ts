import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { RequerimientosUsuario } from '../../../Interfaces/iniciarSesion.interface';
import { response } from 'express';

@Component({
  selector: 'app-todos-los-usuarios',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './todos-los-usuarios.component.html',
  styleUrl: './todos-los-usuarios.component.css'
})
export class TodosLosUsuariosComponent implements OnInit {

 constructor(private Rutas: ActivatedRoute, private Funciones: FuncionesService){}

  
  usuarioID: number | null = null;
  pagina: number | null = 1;
  clientes: any[] = [];

  ngOnInit(): void {

    this.Rutas.paramMap.subscribe(params => {
      const usuario = params.get('usuario');

      if(usuario){
        this.usuarioID = +usuario;
        this.obtenerUsuarios(this.usuarioID, this.pagina!);
      }
    });
  }

  obtenerUsuarios(usuarioID: number, pagina: number) {

    const data : RequerimientosUsuario = 
    {
      usuarioID: this.usuarioID!,
      pagina: this.pagina!,
      activar: true 
    }

    this.Funciones.ObtenerCliente(data).subscribe({
      next: (response) => {
        const token = response.token;
        if(token){
          const descodificar = this.Funciones.DecodificarToken(token);
          this.clientes = JSON.parse(descodificar?.Clientes || '[]');
        }
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }


}
