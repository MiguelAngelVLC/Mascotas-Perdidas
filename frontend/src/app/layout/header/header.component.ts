import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="bg-white shadow-sm px-4 sm:px-8 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between">

        <!-- Logo + nombre -->
        <a routerLink="/" class="flex items-center gap-3 no-underline">
          <div class="w-12 h-12 bg-teal rounded-xl flex items-center justify-center text-2xl" aria-hidden="true">🐾</div>
          <span class="text-xl font-bold text-gray-900 hidden sm:block">Mascotas Perdidas</span>
        </a>

        <!-- Perfil / Login -->
        <div class="flex items-center gap-2">
          @if (auth.isLoggedIn()) {
            <a routerLink="/reportar"
               class="btn-teal text-sm hidden sm:inline-flex items-center gap-1">
              <span>+ Publicar</span>
            </a>
            <a routerLink="/perfil"
               class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
               [attr.aria-label]="'Perfil de ' + auth.user()?.fullName">
              <div class="w-8 h-8 bg-red-pet rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ initial() }}
              </div>
              <span class="text-gray-900 text-sm font-medium hidden md:block">{{ auth.user()?.fullName }}</span>
            </a>
            <button (click)="auth.logout()"
                    class="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                    aria-label="Cerrar sesión">
              Salir
            </button>
          } @else {
            <a routerLink="/login"
               class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Iniciar sesión
            </a>
            <a routerLink="/registro"
               class="btn-primary text-sm">
              Registrarse
            </a>
          }
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  auth = inject(AuthService);

  initial(): string {
    return (this.auth.user()?.fullName ?? '?').charAt(0).toUpperCase();
  }
}
