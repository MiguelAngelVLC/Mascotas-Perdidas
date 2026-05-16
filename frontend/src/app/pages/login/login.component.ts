import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div class="card w-full max-w-md p-8">
        <div class="text-center mb-8">
          <span class="text-5xl" aria-hidden="true">🐾</span>
          <h1 class="text-2xl font-bold text-gray-900 mt-3">Iniciar sesión</h1>
          <p class="text-gray-500 text-sm mt-1">Bienvenido de nuevo a Mascotas Perdidas</p>
        </div>

        @if (errorMsg()) {
          <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4" role="alert">
            {{ errorMsg() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="mb-4">
            <label class="form-label" for="usernameOrEmail">Email o nombre de usuario</label>
            <input id="usernameOrEmail" type="text" formControlName="usernameOrEmail"
                   class="form-input" placeholder="tu@email.com"
                   autocomplete="username">
            @if (form.get('usernameOrEmail')?.invalid && form.get('usernameOrEmail')?.touched) {
              <p class="form-error">Este campo es requerido.</p>
            }
          </div>

          <div class="mb-6">
            <label class="form-label" for="password">Contraseña</label>
            <div class="relative">
              <input id="password" [type]="showPwd() ? 'text' : 'password'"
                     formControlName="password" class="form-input pr-10"
                     placeholder="••••••••"
                     autocomplete="current-password">
              <button type="button" (click)="showPwd.set(!showPwd())"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                      [attr.aria-label]="showPwd() ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                {{ showPwd() ? '🙈' : '👁️' }}
              </button>
            </div>
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <p class="form-error">La contraseña es requerida.</p>
            }
          </div>

          <button type="submit" [disabled]="submitting()" class="btn-primary w-full text-center">
            {{ submitting() ? 'Entrando…' : 'Iniciar sesión' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?
          <a routerLink="/registro" class="text-primary-light hover:underline font-medium">Regístrate</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitting = signal(false);
  errorMsg   = signal('');
  showPwd    = signal(false);

  private returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
    this.form = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password:        ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.errorMsg.set('');
    this.auth.login(this.form.value).subscribe({
      next:  () => this.router.navigateByUrl(this.returnUrl),
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Credenciales incorrectas');
        this.submitting.set(false);
      },
    });
  }
}
