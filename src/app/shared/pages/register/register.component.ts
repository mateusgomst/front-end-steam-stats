import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-box">
        <h1 class="title">CRIAR CONTA</h1>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="form">
          <div class="form-group">
            <input 
              type="text" 
              formControlName="name"
              placeholder="Nome"
              [class.invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
            >
          </div>

          <div class="form-group">
            <input 
              type="email" 
              formControlName="login"
              placeholder="Email"
              [class.invalid]="registerForm.get('login')?.invalid && registerForm.get('login')?.touched"
            >
          </div>

          <div class="form-group">
            <input 
              type="password" 
              formControlName="password"
              placeholder="Senha"
              [class.invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            >
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || isLoading"
            class="submit-button"
          >
            {{ isLoading ? 'CARREGANDO...' : 'REGISTRAR' }}
          </button>

          <button 
            type="button"
            class="toggle-button"
            [disabled]="isLoading"
            routerLink="/login"
          >
            JÁ TEM CONTA? FAÇA LOGIN
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0a0a0a;
      padding: 2rem;
      font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    }

    .register-box {
      background-color: #1a1a1a;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .title {
      color: #5c4d7d;
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
      text-shadow: 2px 2px 0 #000;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    input {
      width: 100%;
      padding: 1rem;
      background-color: #0a0a0a;
      border: 1px solid #333;
      border-radius: 4px;
      color: #fff;
      font-family: inherit;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }

    input:focus {
      outline: none;
      border-color: #5c4d7d;
      box-shadow: 0 0 10px rgba(92, 77, 125, 0.3);
    }

    input.invalid {
      border-color: #ff4444;
    }

    input::placeholder {
      color: #666;
    }

    .submit-button {
      width: 100%;
      background-color: #5c4d7d;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 4px;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 1rem;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #7c6a9f;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(92, 77, 125, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-message {
      color: #ff4444;
      text-align: center;
      margin: 1rem 0;
      font-size: 0.8rem;
      line-height: 1.4;
      padding: 0.75rem;
      background-color: rgba(255, 68, 68, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(255, 68, 68, 0.3);
    }

    .toggle-button {
      width: 100%;
      background: none;
      border: 1px solid #333;
      color: #00ffc3;
      padding: 0.75rem;
      margin-top: 1rem;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle-button:hover:not(:disabled) {
      border-color: #00ffc3;
      background-color: rgba(0, 255, 195, 0.1);
    }

    .toggle-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    button:disabled {
      animation: pulse 1.5s infinite;
    }

    @media (max-width: 480px) {
      .register-box {
        padding: 1.5rem;
      }

      input {
        padding: 0.8rem;
      }

      .submit-button {
        padding: 0.8rem;
      }

      .title {
        font-size: 1.2rem;
      }

      input, .submit-button, .toggle-button {
        font-size: 0.7rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.errorMessage = '';
    this.isLoading = true;

    if (this.registerForm.valid) {
      console.log('Formulário válido, enviando:', this.registerForm.value);

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registro bem-sucedido:', response);
          this.isLoading = false;
          this.router.navigate(['/login']);
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
} 