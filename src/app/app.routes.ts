import { Routes } from '@angular/router';
import { HomeComponent } from './Vistas/Comercial/home/home.component';
import { LoginComponent } from './Vistas/Comercial/login/login.component';
import { MenuComponent } from './Vistas/menu/menu.component';
import { RegisterComponent } from './Vistas/Comercial/register/register.component';
import { InformacionUsuarioComponent } from './Vistas/Comercial/informacion-usuario/informacion-usuario.component';
import { ListaVestimentasComponent } from './Vistas/Comercial/Vestimenta/lista-vestimentas/lista-vestimentas.component';
import { InformacionVestimentaComponent } from './Vistas/Comercial/Vestimenta/informacion-vestimenta/informacion-vestimenta.component';
import { HomeVestimentasComponent } from './Vistas/Vendedor/Vestimentas/home-vestimentas/home-vestimentas.component';
import { AgregarVestimentaComponent } from './Vistas/Vendedor/Vestimentas/agregar-vestimenta/agregar-vestimenta.component';
import { DestalleVestimentaComponent } from './Vistas/Vendedor/Vestimentas/destalle-vestimenta/destalle-vestimenta.component';
import { AddRentadorComponent } from './Vistas/Adminstrador/add-rentador/add-rentador.component';

export const routes: Routes = [

    {path: '', redirectTo:'/Cliente/home', pathMatch: 'full'},
    
    {
     path: 'Cliente',
     component: MenuComponent,
     children: [
        {path: 'home', component: HomeComponent},
        {path: 'informacion', component: InformacionUsuarioComponent} ,
        {path: 'vestimentas', component: ListaVestimentasComponent},
        {path: 'masInformacion/:vestimenta', component: InformacionVestimentaComponent},
        {path: 'NuevoVendedor', component: AddRentadorComponent}
     ],
    }, 
    {
        path: 'Vendedor',
        component: MenuComponent,
        children: [
            {path: 'vestimenta', component: HomeVestimentasComponent},
            {path: 'agregarVestimenta', component: AgregarVestimentaComponent},
            {path: 'detalleVestimenta', component: DestalleVestimentaComponent}
        ]
    },

    {path: 'Login', component: LoginComponent},
    {path: 'Register', component: RegisterComponent},


];
