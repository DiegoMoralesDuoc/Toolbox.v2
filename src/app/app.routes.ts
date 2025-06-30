import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Perfil } from './components/perfil/perfil';
import { Register } from './components/register/register';
import { Soporte } from './components/soporte/soporte';
import { Listalluser } from './components/listalluser/listalluser';
import { Tickets } from './components/tickets/tickets';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard]},
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard] },
  { path: 'register', component: Register, canActivate: [AuthGuard] },
  { path: 'soporte', component: Soporte, canActivate: [AuthGuard] },
  { path: 'listalluser', component: Listalluser, canActivate: [AuthGuard] },
  { path: 'tickets', component: Tickets, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
