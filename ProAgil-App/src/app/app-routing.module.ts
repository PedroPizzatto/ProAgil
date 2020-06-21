import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventosComponent } from './Eventos/Eventos.component';
import { PalestrantesComponent } from './Palestrantes/Palestrantes.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { ContatosComponent } from './Contatos/Contatos.component';
import { UserComponent } from './User/User.component';
import { LoginComponent } from './User/Login/Login.component';
import { RegistrationComponent } from './User/Registration/Registration.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
   { path: 'User', component: UserComponent },
   { path: 'User/Login', component: LoginComponent },
   { path: 'User/Registration', component: RegistrationComponent },
   { path: 'Eventos', component: EventosComponent, canActivate: [AuthGuard]},
   { path: 'Palestrantes', component: PalestrantesComponent, canActivate: [AuthGuard]},
   { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
   { path: 'Contatos', component: ContatosComponent, canActivate: [AuthGuard]},
   { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
   { path: '**', redirectTo: 'Dashboard', pathMatch: 'full' },
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [
      RouterModule
   ],
   declarations: [
   ]
})
export class AppRoutingModule { }
