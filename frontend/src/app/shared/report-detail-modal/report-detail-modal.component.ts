import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Report, STATUS_LABELS, ANIMAL_TYPE_LABELS, ANIMAL_TYPE_ICONS } from '../../core/models/report.model';

@Component({
  selector: 'app-report-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (report) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
           role="dialog"
           [attr.aria-label]="'Detalles de ' + (report.name || 'animal')"
           aria-modal="true"
           (click)="onOverlayClick($event)">

        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-modal animate-slide-up"
             (click)="$event.stopPropagation()">

          <!-- Cerrar -->
          <button class="absolute top-3 right-4 text-3xl text-gray-500 hover:text-gray-800 bg-transparent border-0 cursor-pointer leading-none z-10"
                  (click)="closed.emit()"
                  aria-label="Cerrar modal">×</button>

          <div class="flex flex-col md:flex-row">
            <!-- Imagen -->
            <div class="md:w-5/12 min-h-48 md:min-h-auto overflow-hidden">
              <img [src]="report.primaryImageUrl || 'assets/images/no-photo.svg'"
                   [alt]="report.name || 'Animal'"
                   class="w-full h-full object-cover"
                   (error)="onImgError($event)">
            </div>

            <!-- Detalles -->
            <div class="md:w-7/12 p-6 overflow-y-auto">
              <div class="flex items-start gap-3 mb-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 m-0">{{ report.name || 'Sin nombre' }}</h2>
                  <p class="text-gray-500 text-sm mt-0.5">{{ report.breed || 'Raza desconocida' }}</p>
                </div>
                <span [class]="badgeClass()" class="ml-auto mt-1 text-sm whitespace-nowrap">
                  {{ statusLabel() }}
                </span>
              </div>

              <!-- Info -->
              <div class="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                <div>
                  <span class="font-semibold">Tipo:</span>
                  {{ typeIcon() }} {{ typeLabel() }}
                </div>
                @if (report.color) {
                  <div><span class="font-semibold">Color:</span> {{ report.color }}</div>
                }
                @if (report.size) {
                  <div><span class="font-semibold">Tamaño:</span> {{ sizeLabel() }}</div>
                }
                <div>
                  <span class="font-semibold">Fecha:</span>
                  {{ report.eventDate | date:'dd/MM/yyyy' }}
                </div>
                @if (report.locationText || report.city) {
                  <div class="col-span-2">
                    <span class="font-semibold">📍 Ubicación:</span>
                    {{ report.locationText || '' }} {{ report.city ? '(' + report.city + ')' : '' }}
                  </div>
                }
              </div>

              @if (report.description) {
                <p class="text-sm text-gray-600 mb-4 leading-relaxed">{{ report.description }}</p>
              }

              @if (report.distinctiveFeatures) {
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
                  <span class="font-semibold">Características distintivas:</span>
                  {{ report.distinctiveFeatures }}
                </div>
              }

              <!-- Contacto -->
              <div class="border-t border-gray-100 pt-4 mt-4">
                <h3 class="font-semibold text-gray-800 mb-3">Información de contacto</h3>
                <div class="space-y-1.5 text-sm text-gray-700">
                  <div class="flex items-center gap-2">
                    <span aria-hidden="true">👤</span>
                    <span>{{ report.contactName }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span aria-hidden="true">📞</span>
                    <a [href]="'tel:' + report.contactPhone" class="text-primary-light hover:underline">
                      {{ report.contactPhone }}
                    </a>
                  </div>
                  @if (report.contactEmail) {
                    <div class="flex items-center gap-2">
                      <span aria-hidden="true">✉️</span>
                      <a [href]="'mailto:' + report.contactEmail" class="text-primary-light hover:underline">
                        {{ report.contactEmail }}
                      </a>
                    </div>
                  }
                </div>
              </div>

              <div class="mt-4 text-xs text-gray-400">
                Publicado el {{ report.createdAt | date:'dd/MM/yyyy HH:mm' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ReportDetailModalComponent {
  @Input() report: Report | null = null;
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() { this.closed.emit(); }

  onOverlayClick(ev: MouseEvent) {
    if ((ev.target as HTMLElement).classList.contains('fixed')) {
      this.closed.emit();
    }
  }

  badgeClass() { return this.report?.status === 'LOST' ? 'badge-lost' : 'badge-found'; }
  statusLabel() { return this.report ? STATUS_LABELS[this.report.status] : ''; }
  typeLabel() { return this.report ? ANIMAL_TYPE_LABELS[this.report.animalType] : ''; }
  typeIcon() { return this.report ? ANIMAL_TYPE_ICONS[this.report.animalType] : ''; }
  sizeLabel() {
    const map = { SMALL: 'Pequeño', MEDIUM: 'Mediano', LARGE: 'Grande' };
    return this.report?.size ? map[this.report.size] : '';
  }
  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/images/no-photo.svg';
  }
}
