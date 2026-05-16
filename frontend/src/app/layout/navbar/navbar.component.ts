import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-nav py-2 px-4" aria-label="Navegación principal">
      <div class="max-w-7xl mx-auto">
        <!-- Desktop -->
        <ul class="hidden sm:flex items-center justify-center gap-1 list-none m-0 p-0">
          @for (link of links; track link.path) {
            <li>
              <a [routerLink]="link.path"
                 routerLinkActive="!bg-primary-light !text-white"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700
                        hover:bg-primary-light hover:text-white transition-all duration-200 no-underline">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <!-- Mobile hamburger -->
        <div class="sm:hidden flex justify-between items-center">
          <span class="text-white font-semibold">Mascotas Perdidas</span>
          <button (click)="open.set(!open())"
                  class="text-white text-2xl focus-visible:outline-2"
                  [attr.aria-expanded]="open()"
                  aria-label="Abrir menú">
            {{ open() ? '✕' : '☰' }}
          </button>
        </div>

        @if (open()) {
          <ul class="sm:hidden flex flex-col gap-1 mt-2 list-none m-0 p-0">
            @for (link of links; track link.path) {
              <li>
                <a [routerLink]="link.path"
                   routerLinkActive="bg-primary-light text-white"
                   [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                   (click)="open.set(false)"
                   class="block px-4 py-2 rounded-lg text-sm font-medium text-white
                          hover:bg-primary-light transition-all duration-200 no-underline">
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  open = signal(false);
  links = [
    { path: '/',             label: 'Inicio' },
    { path: '/perdidos',     label: 'Perdidos' },
    { path: '/encontrados',  label: 'Encontrados' },
    { path: '/reportar',     label: 'Publicar' },
    { path: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { path: '/contacto',     label: 'Contacto' },
  ];
}
