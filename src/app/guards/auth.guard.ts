// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

// Guard para proteger rotas que precisam de autenticação
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Se estiver autenticado, permite acesso
        return true;
      } else {
        // Se não estiver autenticado, redireciona para login
        console.log('Usuário não autenticado, redirecionando para login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

// Guard para impedir acesso às páginas de login/register quando já logado
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Se já estiver logado, redireciona para home
        console.log('Usuário já autenticado, redirecionando para home');
        router.navigate(['/home']);
        return false;
      } else {
        // Se não estiver logado, permite acesso à página de login/register
        return true;
      }
    })
  );
};