import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="px-4 sm:px-8 py-6 max-w-2xl mx-auto">
      <h1 class="section-title mb-2">Contacto</h1>
      <p class="text-white/70 text-sm mb-6">¿Tienes alguna pregunta o sugerencia? Escríbenos.</p>

      <div class="card p-6 sm:p-8">
        @if (success()) {
          <div class="text-center py-8">
            <span class="text-5xl" aria-hidden="true">✉️</span>
            <h2 class="text-xl font-bold text-gray-900 mt-4 mb-2">¡Mensaje enviado!</h2>
            <p class="text-gray-500 text-sm">Gracias por ponerte en contacto. Te responderemos lo antes posible.</p>
            <button (click)="reset()" class="btn-primary mt-4 text-sm">Enviar otro mensaje</button>
          </div>
        } @else {
          @if (errorMsg()) {
            <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4" role="alert">
              {{ errorMsg() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="form-label" for="cn-name">Nombre *</label>
                <input id="cn-name" type="text" formControlName="name" class="form-input" placeholder="Tu nombre">
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <p class="form-error">Requerido.</p>
                }
              </div>
              <div>
                <label class="form-label" for="cn-email">Email *</label>
                <input id="cn-email" type="email" formControlName="email" class="form-input" placeholder="tu@email.com">
                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                  <p class="form-error">Email válido requerido.</p>
                }
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label" for="cn-subject">Asunto</label>
              <input id="cn-subject" type="text" formControlName="subject" class="form-input" placeholder="Asunto del mensaje">
            </div>

            <div class="mb-6">
              <label class="form-label" for="cn-message">Mensaje *</label>
              <textarea id="cn-message" formControlName="message" class="form-input resize-y"
                        rows="5" placeholder="Escribe tu mensaje aquí…"></textarea>
              @if (form.get('message')?.invalid && form.get('message')?.touched) {
                <p class="form-error">El mensaje es requerido (mínimo 10 caracteres).</p>
              }
            </div>

            <div class="flex justify-end gap-3">
              <button type="reset" class="btn-secondary">Limpiar</button>
              <button type="submit" [disabled]="submitting()" class="btn-primary">
                {{ submitting() ? 'Enviando…' : 'Enviar mensaje' }}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  submitting = signal(false);
  errorMsg   = signal('');
  success    = signal(false);

  constructor(private fb: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.contactService.send(this.form.value).subscribe({
      next:  () => { this.success.set(true); this.submitting.set(false); },
      error: () => { this.errorMsg.set('Error al enviar. Inténtalo de nuevo.'); this.submitting.set(false); },
    });
  }

  reset(): void {
    this.success.set(false);
    this.form.reset();
  }
}
