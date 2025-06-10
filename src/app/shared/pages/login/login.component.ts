import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegistering = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  isAuthenticated$;
  currentUser$;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.errorMessage = '';
    this.isLoading = true;

    if (this.isRegistering) {
      this.handleRegister();
    } else {
      this.handleLogin();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login válido, enviando:', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Ocorreu um erro ao tentar fazer login';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.errors) {
          if (key === 'login' && control.errors['email']) {
            this.errorMessage = 'Por favor, insira um email válido';
          } else if (key === 'password' && control.errors['minlength']) {
            this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
          }
        }
      });
    }
  }

  private handleRegister(): void {
    if (this.registerForm.valid) {
      console.log('Registro válido, enviando:', this.registerForm.value);

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registro bem-sucedido:', response);
          this.isLoading = false;
          // Após registro bem-sucedido, faz login automático
          this.authService.login(this.registerForm.value).subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Erro no login após registro:', error);
              this.isRegistering = false;
              this.errorMessage = 'Registro concluído! Por favor, faça login.';
            }
          });
        },
        error: (error) => {
          console.error('Erro no registro:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Ocorreu um erro ao tentar fazer o registro';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.errors) {
          if (key === 'login' && control.errors['email']) {
            this.errorMessage = 'Por favor, insira um email válido';
          } else if (key === 'password' && control.errors['minlength']) {
            this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
          }
        }
      });
    }
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
  }
} 