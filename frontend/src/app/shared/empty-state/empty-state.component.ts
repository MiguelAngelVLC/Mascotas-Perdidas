import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-white/70 text-center">
      <span class="text-6xl mb-4" aria-hidden="true">{{ icon }}</span>
      <h3 class="text-xl font-semibold text-white mb-2">{{ title }}</h3>
      <p class="text-sm mb-6 max-w-sm">{{ message }}</p>
      @if (actionLabel) {
        <a [routerLink]="actionLink" class="btn-teal text-sm">{{ actionLabel }}</a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon        = '🐾';
  @Input() title       = 'Sin resultados';
  @Input() message     = 'No se encontraron publicaciones que coincidan con tu búsqueda.';
  @Input() actionLabel = '';
  @Input() actionLink  = '/reportar';
}
