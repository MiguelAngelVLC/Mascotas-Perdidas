import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-primary-light text-gray-900 text-center py-8 px-4 mt-8">
      <div class="max-w-7xl mx-auto">
        <p class="text-lg font-semibold mb-1">Mascotas Perdidas</p>
        <p class="text-sm mb-3">Conectando familias con sus mascotas perdidas</p>
        <nav class="flex flex-wrap justify-center gap-4 text-sm mb-4" aria-label="Pie de página">
          <a routerLink="/"              class="hover:underline">Inicio</a>
          <a routerLink="/perdidos"      class="hover:underline">Perdidos</a>
          <a routerLink="/encontrados"   class="hover:underline">Encontrados</a>
          <a routerLink="/sobre-nosotros" class="hover:underline">Sobre Nosotros</a>
          <a routerLink="/contacto"      class="hover:underline">Contacto</a>
        </nav>
        <p class="text-xs text-gray-700">© {{ year }} Mascotas Perdidas. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
