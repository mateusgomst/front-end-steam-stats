// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './shared/pages/login/login.component';
import { HomeComponent } from './shared/pages/home/home.component';
import { RegisterComponent } from './shared/pages/register/register.component';
import { WishlistComponent } from './shared/pages/wishlist/wishlist.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rota padrão - redireciona para login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Rotas públicas (não precisam de autenticação)
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loginGuard] // Impede acesso se já estiver logado
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [loginGuard] // Impede acesso se já estiver logado
  },
  
  // Rotas protegidas (precisam de autenticação)
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard] // Só permite se estiver logado
  },
  { 
    path: 'wishlist', 
    component: WishlistComponent,
    canActivate: [authGuard] // Só permite se estiver logado
  },
  
  // Rota para páginas não encontradas
  { path: '**', redirectTo: '/login' }
];