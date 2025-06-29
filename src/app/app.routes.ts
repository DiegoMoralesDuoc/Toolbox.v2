import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Perfil } from './components/perfil/perfil';
import { Register } from './components/register/register';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login' ,pathMatch: 'full' },
  { path: 'login', component: Login }, 
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard] },
  { path: 'register', component: Register, canActivate: [AuthGuard] }
];
