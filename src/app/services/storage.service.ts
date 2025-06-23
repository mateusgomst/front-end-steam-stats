import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  /**
   * Verifica se está rodando no browser
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Salva um item no localStorage (apenas no browser)
   */
  setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
    }
  }

  /**
   * Recupera um item do localStorage (apenas no browser)
   */
  getItem(key: string): string | null {
    if (this.isBrowser()) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Remove um item do localStorage (apenas no browser)
   */
  removeItem(key: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
      }
    }
  }

  /**
   * Limpa todo o localStorage (apenas no browser)
   */
  clear(): void {
    if (this.isBrowser()) {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
      }
    }
  }

  /**
   * Verifica se uma chave existe no localStorage
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }
}