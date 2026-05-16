import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report, ReportFilter, ReportFormData } from '../models/report.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ReportService {

  constructor(private http: HttpClient) {}

  getReports(filter: ReportFilter): Observable<PageResponse<Report>> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());
    if (filter.status)     params = params.set('status', filter.status);
    if (filter.animalType) params = params.set('animalType', filter.animalType);
    if (filter.city)       params = params.set('city', filter.city);
    if (filter.q)          params = params.set('q', filter.q);
    return this.http.get<PageResponse<Report>>('/api/reports', { params });
  }

  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`/api/reports/${id}`);
  }

  createReport(data: ReportFormData): Observable<Report> {
    return this.http.post<Report>('/api/reports', this.toFormData(data));
  }

  updateReport(id: number, data: ReportFormData): Observable<Report> {
    return this.http.put<Report>(`/api/reports/${id}`, this.toFormData(data));
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`/api/reports/${id}`);
  }

  getMyReports(page = 0, size = 9): Observable<PageResponse<Report>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Report>>('/api/users/me/reports', { params });
  }

  private toFormData(data: ReportFormData): FormData {
    const fd = new FormData();
    (Object.keys(data) as (keyof ReportFormData)[]).forEach(key => {
      const val = data[key];
      if (val === undefined || val === null) return;
      if (key === 'image' && val instanceof File) {
        fd.append('image', val, val.name);
      } else {
        fd.append(key, String(val));
      }
    });
    return fd;
  }
}
