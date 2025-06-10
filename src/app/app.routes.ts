import { Routes } from '@angular/router';
import { LoginComponent } from './shared/pages/login/login.component';
import { HomeComponent } from './shared/pages/home/home.component';
import { RegisterComponent } from './shared/pages/register/register.component';
import { WishlistComponent } from './shared/pages/wishlist/wishlist.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: '**', redirectTo: '/login' }
];
