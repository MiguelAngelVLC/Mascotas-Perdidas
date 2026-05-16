import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

const TOKEN_KEY = 'mp_token';
const USER_KEY  = 'mp_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user   = signal<User | null>(this.loadUser());
  private _token  = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly user          = this._user.asReadonly();
  readonly token         = this._token.asReadonly();
  readonly isLoggedIn    = computed(() => this._token() !== null);
  readonly isAdmin       = computed(() => this._user()?.roles.includes('ROLE_ADMIN') ?? false);

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', req).pipe(
      tap(res => this.persist(res))
    );
  }

  register(req: RegisterRequest): Observable<User> {
    return this.http.post<User>('/api/auth/register', req);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._token.set(res.token);
    this._user.set(res.user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
