import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalService } from '../../../services/modal.service';
import { WelcomeModalComponent } from '../../_components/welcome-modal/welcome-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, WelcomeModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegistering = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  isAuthenticated$;
  currentUser$;
  showWelcomeModal$;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
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
    this.showWelcomeModal$ = this.modalService.showWelcomeModal$;
  }

  ngOnInit(): void {
    // Verifica se deve mostrar o modal de boas-vindas
    this.modalService.checkAndShowWelcomeModal();
    
    // Se o usuário já estiver autenticado, redireciona para home
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/home']);
      }
    });
  }

  onCloseWelcomeModal(): void {
    this.modalService.closeWelcomeModal();
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
      this.validateFormAndSetError(this.loginForm);
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
      this.validateFormAndSetError(this.registerForm);
    }
  }

  private validateFormAndSetError(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control?.errors) {
        if (key === 'login' && control.errors['email']) {
          this.errorMessage = 'Por favor, insira um email válido';
        } else if (key === 'password' && control.errors['minlength']) {
          this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (key === 'name' && control.errors['required']) {
          this.errorMessage = 'O nome é obrigatório';
        }
      }
    });
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    // Reset dos formulários ao alternar
    this.loginForm.reset();
    this.registerForm.reset();
  }
}