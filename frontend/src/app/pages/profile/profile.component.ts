import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { Report } from '../../core/models/report.model';
import { PageResponse } from '../../core/models/page.model';
import { ReportCardComponent } from '../../shared/report-card/report-card.component';
import { ReportDetailModalComponent } from '../../shared/report-detail-modal/report-detail-modal.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReportCardComponent, ReportDetailModalComponent,
    PaginationComponent, LoadingComponent, EmptyStateComponent,
  ],
  template: `
    <div class="px-4 sm:px-8 py-6 max-w-5xl mx-auto">

      <!-- Cabecera perfil -->
      <div class="card p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div class="w-20 h-20 bg-red-pet rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
          {{ initial() }}
        </div>
        <div class="flex-1 text-center sm:text-left">
          <h1 class="text-2xl font-bold text-gray-900">{{ auth.user()?.fullName }}</h1>
          <p class="text-gray-500 text-sm">{{ auth.user()?.email }}</p>
          @if (auth.user()?.phone) {
            <p class="text-gray-500 text-sm">{{ auth.user()?.phone }}</p>
          }
          <div class="flex gap-2 mt-3 justify-center sm:justify-start flex-wrap">
            @for (role of auth.user()?.roles ?? []; track role) {
              <span class="text-xs bg-primary-light/20 text-primary-light font-medium px-2.5 py-0.5 rounded-full">
                {{ role }}
              </span>
            }
          </div>
        </div>
        <a routerLink="/reportar" class="btn-teal text-sm flex-shrink-0">+ Nuevo reporte</a>
      </div>

      <!-- Mis reportes -->
      <h2 class="section-title mb-4">Mis Reportes</h2>

      @if (loading()) {
        <app-loading />
      } @else if (page()?.content?.length === 0) {
        <app-empty-state
          icon="📋"
          title="Sin publicaciones"
          message="Todavía no has publicado ningún reporte."
          actionLabel="Publicar ahora"
          actionLink="/reportar" />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          @for (report of page()?.content ?? []; track report.id) {
            <app-report-card [report]="report" (selected)="selected.set($event)" />
          }
        </div>
        <app-pagination
          [currentPage]="currentPage()"
          [totalPages]="page()?.totalPages ?? 0"
          [totalElements]="page()?.totalElements ?? 0"
          (pageChange)="onPageChange($event)" />
      }
    </div>

    <app-report-detail-modal [report]="selected()" (closed)="selected.set(null)" />
  `,
})
export class ProfileComponent implements OnInit {
  auth         = inject(AuthService);
  loading      = signal(true);
  page         = signal<PageResponse<Report> | null>(null);
  selected     = signal<Report | null>(null);
  currentPage  = signal(0);

  constructor(private reportService: ReportService) {}

  ngOnInit(): void { this.load(); }

  onPageChange(p: number): void {
    this.currentPage.set(p);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.reportService.getMyReports(this.currentPage(), 9).subscribe({
      next:  p => { this.page.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  initial(): string {
    return (this.auth.user()?.fullName ?? '?').charAt(0).toUpperCase();
  }
}
