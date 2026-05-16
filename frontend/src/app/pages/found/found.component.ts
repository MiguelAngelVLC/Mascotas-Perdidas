import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { Report, ReportFilter } from '../../core/models/report.model';
import { PageResponse } from '../../core/models/page.model';
import { ReportCardComponent } from '../../shared/report-card/report-card.component';
import { ReportDetailModalComponent } from '../../shared/report-detail-modal/report-detail-modal.component';
import { ReportFilterComponent } from '../../shared/report-filter/report-filter.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';

@Component({
  selector: 'app-found',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReportCardComponent, ReportDetailModalComponent,
    ReportFilterComponent, PaginationComponent, LoadingComponent, EmptyStateComponent,
  ],
  template: `
    <div class="px-4 sm:px-8 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="section-title">
          <span class="inline-block w-4 h-4 rounded-full bg-teal mr-2 align-middle" aria-hidden="true"></span>
          Animales Encontrados
        </h1>
        <a routerLink="/reportar" class="btn-teal text-sm">+ Publicar</a>
      </div>

      <app-report-filter [initialStatus]="'FOUND'" (filterChange)="onFilter($event)" />

      @if (loading()) {
        <app-loading />
      } @else if (page()?.content?.length === 0) {
        <app-empty-state
          icon="🐾"
          title="No hay animales encontrados"
          message="No se encontraron publicaciones de animales encontrados con esos filtros."
          actionLabel="Publicar uno"
          actionLink="/reportar" />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          @for (report of page()?.content ?? []; track report.id) {
            <app-report-card [report]="report" (selected)="selected.set($event)" />
          }
        </div>
        <app-pagination
          [currentPage]="filter().page"
          [totalPages]="page()?.totalPages ?? 0"
          [totalElements]="page()?.totalElements ?? 0"
          (pageChange)="onPageChange($event)" />
      }
    </div>

    <app-report-detail-modal [report]="selected()" (closed)="selected.set(null)" />
  `,
})
export class FoundComponent implements OnInit {
  loading  = signal(true);
  page     = signal<PageResponse<Report> | null>(null);
  selected = signal<Report | null>(null);
  filter   = signal<ReportFilter>({ status: 'FOUND', page: 0, size: 9 });

  constructor(private reportService: ReportService) {}

  ngOnInit(): void { this.load(); }

  onFilter(partial: Partial<ReportFilter>): void {
    this.filter.set({ ...this.filter(), ...partial, status: 'FOUND', page: 0 });
    this.load();
  }

  onPageChange(p: number): void {
    this.filter.update(f => ({ ...f, page: p }));
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private load(): void {
    this.loading.set(true);
    this.reportService.getReports(this.filter()).subscribe({
      next:  p => { this.page.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
