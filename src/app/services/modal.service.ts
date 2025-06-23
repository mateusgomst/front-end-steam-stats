import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showWelcomeModalSubject = new BehaviorSubject<boolean>(false);
  public showWelcomeModal$ = this.showWelcomeModalSubject.asObservable();

  private readonly WELCOME_MODAL_KEY = 'welcomeModalShown';

  constructor(private storageService: StorageService) { }

  /**
   * Verifica se deve mostrar o modal de boas-vindas
   * Só mostra se nunca foi mostrado antes (usando localStorage)
   */
  checkAndShowWelcomeModal(): void {
    const hasShownBefore = this.storageService.getItem(this.WELCOME_MODAL_KEY);
    
    if (!hasShownBefore) {
      this.showWelcomeModal();
    }
  }

  /**
   * Força a exibição do modal de boas-vindas
   */
  showWelcomeModal(): void {
    this.showWelcomeModalSubject.next(true);
  }

  /**
   * Fecha o modal e marca como já visualizado
   */
  closeWelcomeModal(): void {
    this.showWelcomeModalSubject.next(false);
    this.storageService.setItem(this.WELCOME_MODAL_KEY, 'true');
  }

  /**
   * Reseta o estado do modal (útil para testes ou reset da aplicação)
   */
  resetWelcomeModal(): void {
    this.storageService.removeItem(this.WELCOME_MODAL_KEY);
  }
}