import { Routes } from '@angular/router';
import { HomeComponent } from './Vistas/Comercial/home/home.component';
import { LoginComponent } from './Vistas/Comercial/login/login.component';
import { MenuComponent } from './Vistas/Comercial/menu/menu.component';
import { RegisterComponent } from './Vistas/Comercial/register/register.component';
import { InformacionUsuarioComponent } from './Vistas/Comercial/informacion-usuario/informacion-usuario.component';
import { ListaVestimentasComponent } from './Vistas/Comercial/Vestimenta/lista-vestimentas/lista-vestimentas.component';
import { InformacionVestimentaComponent } from './Vistas/Comercial/Vestimenta/informacion-vestimenta/informacion-vestimenta.component';
import { HomeVestimentasComponent } from './Vistas/Vendedor/VestimentasVen/home-vestimentas/home-vestimentas.component';
import { AgregarVestimentaComponent } from './Vistas/Vendedor/VestimentasVen/agregar-vestimenta/agregar-vestimenta.component';
import { DestalleVestimentaComponent } from './Vistas/Vendedor/VestimentasVen/destalle-vestimenta/destalle-vestimenta.component';
import { InformacionEstablecimientoComponent } from './Vistas/Comercial/Establecimientos/informacion-establecimiento/informacion-establecimiento.component';
import { HomeEstablecimientosComponent } from './Vistas/Vendedor/EstablecimientosVen/home-establecimientos/home-establecimientos.component';
import { MenuVenComponent } from './Vistas/Vendedor/menu-ven/menu-ven.component';
import { HomeVentasComponent } from './Vistas/Vendedor/VentasVen/home-ventas/home-ventas.component';
import { NuevoVendedorComponent } from './Vistas/Vendedor/nuevo-vendedor/nuevo-vendedor.component';
import { MenuAdmComponent } from './Vistas/Adminstrador/menu-adm/menu-adm.component';
import { TodosLosEstablecimientosComponent } from './Vistas/Adminstrador/todos-los-establecimientos/todos-los-establecimientos.component';
import { RecuperarContrasenaComponent } from './Vistas/Comercial/recuperar-contrasena/recuperar-contrasena.component';

export const routes: Routes = [

    {path: '', redirectTo:'/Cliente/home', pathMatch: 'full'},
    
    {
     path: 'Cliente',
     component: MenuComponent,
     children: [
        {path: 'home', component: HomeComponent},
        {path: 'informacion', component: InformacionUsuarioComponent} ,
        {path: 'vestimentas', component: ListaVestimentasComponent},
        {path: 'masInformacionVestimenta/:vestimenta', component: InformacionVestimentaComponent},
        {path: 'NuevoVendedor', component: NuevoVendedorComponent},
        {path: 'masInformacionEstablecimiento/:establecimiento', component: InformacionEstablecimientoComponent}
     ],
    }, 
    {
        path: 'Vendedor',
        component: MenuVenComponent,
        children: [
            {path: 'misEstablecimientos/:usuario', component:HomeEstablecimientosComponent},
            {path: 'ventas', component: HomeVentasComponent},
            {path: 'misVestimenta', component: HomeVestimentasComponent},
            {path: 'agregarVestimenta', component: AgregarVestimentaComponent},
            {path: 'detalleVestimenta', component: DestalleVestimentaComponent}
        ]
    },
    {
        path: 'Administrador',
        component: MenuAdmComponent,
        children: [
            {path: 'TodosEstablecimientos', component: TodosLosEstablecimientosComponent}
        ]
    },

    {path: 'Login', component: LoginComponent},
    {path: 'Register', component: RegisterComponent},
    {path: 'OlvideMiContrasena', component: RecuperarContrasenaComponent }

];
