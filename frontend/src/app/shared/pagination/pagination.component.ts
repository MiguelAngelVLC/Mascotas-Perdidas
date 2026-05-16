import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <nav class="flex items-center justify-between px-2 py-4" aria-label="Paginación">
        <p class="text-sm text-gray-300">
          {{ totalElements }} resultado{{ totalElements !== 1 ? 's' : '' }}
        </p>
        <ul class="flex items-center gap-1 list-none m-0 p-0">
          <li>
            <button [disabled]="currentPage === 0"
                    (click)="pageChange.emit(currentPage - 1)"
                    class="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-white hover:bg-white/20
                           disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior">
              ‹
            </button>
          </li>
          @for (p of pages(); track p) {
            <li>
              <button (click)="pageChange.emit(p)"
                      [class]="p === currentPage
                        ? 'px-3 py-1.5 text-sm rounded-lg bg-primary-light text-white font-semibold'
                        : 'px-3 py-1.5 text-sm rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors'"
                      [attr.aria-current]="p === currentPage ? 'page' : null"
                      [attr.aria-label]="'Página ' + (p + 1)">
                {{ p + 1 }}
              </button>
            </li>
          }
          <li>
            <button [disabled]="currentPage === totalPages - 1"
                    (click)="pageChange.emit(currentPage + 1)"
                    class="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-white hover:bg-white/20
                           disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente">
              ›
            </button>
          </li>
        </ul>
      </nav>
    }
  `,
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages  = 0;
  @Input() totalElements = 0;
  @Output() pageChange = new EventEmitter<number>();

  pages(): number[] {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, this.currentPage - half);
    const end   = Math.min(this.totalPages, start + maxVisible);
    start = Math.max(0, end - maxVisible);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }
}
