import { Routes } from '@angular/router';
import { HomeComponent } from './Vistas/Comercial/home/home.component';
import { LoginComponent } from './Vistas/Comercial/login/login.component';
import { MenuComponent } from './Vistas/menu/menu.component';
import { RegisterComponent } from './Vistas/Comercial/register/register.component';
import { InformacionUsuarioComponent } from './Vistas/Comercial/informacion-usuario/informacion-usuario.component';
import { VestimentasComponent } from './Vistas/Comercial/vestimentas/vestimentas.component';

export const routes: Routes = [

    {path: '', redirectTo:'/Cliente/home', pathMatch: 'full'},
    
    {
     path: 'Cliente',
     component: MenuComponent,
     children: [
        {path: 'home', component: HomeComponent},
        {path: 'informacion', component: InformacionUsuarioComponent} ,
        {path: 'vestimentas', component: VestimentasComponent}
        
     ],
    }, 

    {path: 'Login', component: LoginComponent},
    {path: 'Register', component: RegisterComponent}

];
