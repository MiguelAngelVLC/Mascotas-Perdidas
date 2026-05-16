import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div class="card w-full max-w-lg p-8">
        <div class="text-center mb-8">
          <span class="text-5xl" aria-hidden="true">🐾</span>
          <h1 class="text-2xl font-bold text-gray-900 mt-3">Crear cuenta</h1>
          <p class="text-gray-500 text-sm mt-1">Únete a la comunidad de Mascotas Perdidas</p>
        </div>

        @if (errorMsg()) {
          <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4" role="alert">
            {{ errorMsg() }}
          </div>
        }
        @if (success()) {
          <div class="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4" role="status">
            ✅ Cuenta creada correctamente. <a routerLink="/login" class="underline font-medium">Inicia sesión</a>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="form-label" for="username">Nombre de usuario *</label>
              <input id="username" type="text" formControlName="username" class="form-input"
                     placeholder="mi_usuario" autocomplete="username">
              @if (form.get('username')?.invalid && form.get('username')?.touched) {
                <p class="form-error">
                  @if (form.get('username')?.errors?.['required']) { Requerido. }
                  @else if (form.get('username')?.errors?.['minlength']) { Mínimo 3 caracteres. }
                  @else { Solo letras, números y guiones bajos. }
                </p>
              }
            </div>
            <div>
              <label class="form-label" for="fullName">Nombre completo *</label>
              <input id="fullName" type="text" formControlName="fullName" class="form-input"
                     placeholder="Juan Pérez" autocomplete="name">
              @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
                <p class="form-error">Requerido, mínimo 2 caracteres.</p>
              }
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label" for="email">Email *</label>
            <input id="email" type="email" formControlName="email" class="form-input"
                   placeholder="tu@email.com" autocomplete="email">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="form-error">Introduce un email válido.</p>
            }
          </div>

          <div class="mb-4">
            <label class="form-label" for="phone">Teléfono</label>
            <input id="phone" type="tel" formControlName="phone" class="form-input"
                   placeholder="+34 600 000 000" autocomplete="tel">
          </div>

          <div class="mb-4">
            <label class="form-label" for="reg-password">Contraseña *</label>
            <div class="relative">
              <input id="reg-password" [type]="showPwd() ? 'text' : 'password'"
                     formControlName="password" class="form-input pr-10"
                     placeholder="Mínimo 8 caracteres"
                     autocomplete="new-password">
              <button type="button" (click)="showPwd.set(!showPwd())"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      [attr.aria-label]="showPwd() ? 'Ocultar' : 'Mostrar'">
                {{ showPwd() ? '🙈' : '👁️' }}
              </button>
            </div>
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <p class="form-error">La contraseña debe tener al menos 8 caracteres.</p>
            }
          </div>

          <div class="mb-6">
            <label class="form-label" for="confirm">Confirmar contraseña *</label>
            <input id="confirm" type="password" formControlName="confirm" class="form-input"
                   placeholder="Repite la contraseña" autocomplete="new-password">
            @if (form.errors?.['mismatch'] && form.get('confirm')?.touched) {
              <p class="form-error">Las contraseñas no coinciden.</p>
            }
          </div>

          <button type="submit" [disabled]="submitting()" class="btn-primary w-full text-center">
            {{ submitting() ? 'Creando cuenta…' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="text-primary-light hover:underline font-medium">Iniciar sesión</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitting = signal(false);
  errorMsg   = signal('');
  success    = signal(false);
  showPwd    = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email:    ['', [Validators.required, Validators.email]],
      phone:    [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm:  ['', Validators.required],
    }, { validators: this.matchPasswords });
  }

  matchPasswords(group: FormGroup) {
    return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.errorMsg.set('');
    const { confirm, ...req } = this.form.value;
    this.auth.register(req).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Error al registrar. Inténtalo de nuevo.');
        this.submitting.set(false);
      },
    });
  }
}
