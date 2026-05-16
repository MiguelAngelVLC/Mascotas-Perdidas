import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-16" role="status" aria-label="Cargando">
      <div class="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      <span class="sr-only">Cargando...</span>
    </div>
  `,
})
export class LoadingComponent {}
