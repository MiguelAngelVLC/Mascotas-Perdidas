import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  name:     string;
  email:    string;
  subject?: string;
  message:  string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  send(data: ContactRequest): Observable<void> {
    return this.http.post<void>('/api/contact', data);
  }
}
