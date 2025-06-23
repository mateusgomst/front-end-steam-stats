import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-modal.component.html',
  styleUrl: './welcome-modal.component.css'
})
export class WelcomeModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: Event): void {
    // Fecha o modal apenas se clicar no overlay, não no conteúdo
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}