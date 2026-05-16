import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { ReportFormData } from '../../core/models/report.model';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="px-4 sm:px-8 py-6 max-w-3xl mx-auto">
      <a routerLink="/" class="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4">
        ← Volver
      </a>

      <div class="card p-6 sm:p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Publicar Reporte</h1>
        <p class="text-gray-500 text-sm mb-6">Completa el formulario para reportar un animal perdido o encontrado.</p>

        @if (errorMsg()) {
          <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4" role="alert">
            {{ errorMsg() }}
          </div>
        }

        @if (success()) {
          <div class="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4" role="status">
            ¡Reporte publicado correctamente! <a routerLink="/" class="underline font-medium">Volver al inicio</a>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

          <!-- Estado -->
          <div class="mb-5">
            <fieldset>
              <legend class="form-label mb-2">Estado del animal *</legend>
              <div class="flex gap-3">
                <label class="flex-1 cursor-pointer">
                  <input type="radio" formControlName="status" value="LOST" class="sr-only">
                  <div [class]="form.value.status === 'LOST'
                    ? 'text-center py-2 px-4 rounded-lg border-2 border-red-pet bg-red-pet/10 text-red-600 font-medium text-sm'
                    : 'text-center py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-600 text-sm hover:border-red-pet cursor-pointer'">
                    🔴 He perdido a mi mascota
                  </div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" formControlName="status" value="FOUND" class="sr-only">
                  <div [class]="form.value.status === 'FOUND'
                    ? 'text-center py-2 px-4 rounded-lg border-2 border-teal bg-teal/10 text-teal-700 font-medium text-sm'
                    : 'text-center py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-600 text-sm hover:border-teal cursor-pointer'">
                    🟢 He encontrado un animal
                  </div>
                </label>
              </div>
              @if (form.get('status')?.invalid && form.get('status')?.touched) {
                <p class="form-error">Selecciona el estado del animal.</p>
              }
            </fieldset>
          </div>

          <!-- Tipo, Nombre, Raza -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="form-label" for="animalType">Tipo de animal *</label>
              <select id="animalType" formControlName="animalType" class="form-input">
                <option value="DOG">🐶 Perro</option>
                <option value="CAT">🐱 Gato</option>
                <option value="BIRD">🐦 Ave</option>
                <option value="OTHER">🐾 Otro</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="name">Nombre</label>
              <input id="name" type="text" formControlName="name" class="form-input" placeholder="Ej. Max">
            </div>
            <div>
              <label class="form-label" for="breed">Raza</label>
              <input id="breed" type="text" formControlName="breed" class="form-input" placeholder="Ej. Labrador">
            </div>
          </div>

          <!-- Color, Tamaño, Fecha -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="form-label" for="color">Color</label>
              <input id="color" type="text" formControlName="color" class="form-input" placeholder="Ej. Marrón, Negro">
            </div>
            <div>
              <label class="form-label" for="size">Tamaño</label>
              <select id="size" formControlName="size" class="form-input">
                <option value="">— Sin especificar</option>
                <option value="SMALL">Pequeño</option>
                <option value="MEDIUM">Mediano</option>
                <option value="LARGE">Grande</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="eventDate">Fecha del evento *</label>
              <input id="eventDate" type="date" formControlName="eventDate" class="form-input"
                     [max]="today">
              @if (form.get('eventDate')?.invalid && form.get('eventDate')?.touched) {
                <p class="form-error">La fecha es requerida y no puede ser futura.</p>
              }
            </div>
          </div>

          <!-- Descripción -->
          <div class="mb-4">
            <label class="form-label" for="description">Descripción</label>
            <textarea id="description" formControlName="description" class="form-input resize-y"
                      rows="3" placeholder="Describe al animal en detalle…"></textarea>
          </div>

          <!-- Características -->
          <div class="mb-4">
            <label class="form-label" for="distinctiveFeatures">Características distintivas</label>
            <input id="distinctiveFeatures" type="text" formControlName="distinctiveFeatures" class="form-input"
                   placeholder="Collar rojo, mancha blanca en pata, separadas por comas">
          </div>

          <!-- Ubicación -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div class="sm:col-span-3">
              <label class="form-label" for="locationText">Ubicación</label>
              <input id="locationText" type="text" formControlName="locationText" class="form-input"
                     placeholder="Ej. Parque Central, junto al quiosco">
            </div>
            <div>
              <label class="form-label" for="city">Ciudad</label>
              <input id="city" type="text" formControlName="city" class="form-input" placeholder="Madrid">
            </div>
            <div>
              <label class="form-label" for="province">Provincia</label>
              <input id="province" type="text" formControlName="province" class="form-input" placeholder="Madrid">
            </div>
          </div>

          <!-- Imagen -->
          <div class="mb-6">
            <label class="form-label" for="image">Foto del animal</label>
            <input id="image" type="file" accept="image/*"
                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0 file:text-sm file:font-medium
                          file:bg-primary-light file:text-white hover:file:bg-blue-600 cursor-pointer"
                   (change)="onFileChange($event)"
                   aria-describedby="image-help">
            <p id="image-help" class="text-xs text-gray-400 mt-1">Máximo 10 MB. Formatos: JPG, PNG, GIF, WEBP.</p>
            @if (imagePreview()) {
              <div class="mt-3">
                <img [src]="imagePreview()!" alt="Previsualización" class="w-40 h-28 object-cover rounded-lg border border-gray-200">
              </div>
            }
          </div>

          <hr class="my-6 border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Información de contacto</h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label class="form-label" for="contactName">Tu nombre *</label>
              <input id="contactName" type="text" formControlName="contactName" class="form-input"
                     placeholder="Juan Pérez">
              @if (form.get('contactName')?.invalid && form.get('contactName')?.touched) {
                <p class="form-error">El nombre es requerido.</p>
              }
            </div>
            <div>
              <label class="form-label" for="contactPhone">Teléfono *</label>
              <input id="contactPhone" type="tel" formControlName="contactPhone" class="form-input"
                     placeholder="+34 600 000 000">
              @if (form.get('contactPhone')?.invalid && form.get('contactPhone')?.touched) {
                <p class="form-error">El teléfono es requerido.</p>
              }
            </div>
            <div>
              <label class="form-label" for="contactEmail">Email</label>
              <input id="contactEmail" type="email" formControlName="contactEmail" class="form-input"
                     placeholder="tu@email.com">
              @if (form.get('contactEmail')?.invalid && form.get('contactEmail')?.touched) {
                <p class="form-error">El email no es válido.</p>
              }
            </div>
          </div>

          <p class="text-xs text-gray-400 mb-6">
            Los datos de contacto serán visibles para otros usuarios. Asegúrate de que son correctos.
          </p>

          <div class="flex justify-end gap-3">
            <a routerLink="/" class="btn-secondary">Cancelar</a>
            <button type="submit" [disabled]="submitting()" class="btn-primary">
              {{ submitting() ? 'Publicando…' : 'Publicar Reporte' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ReportFormComponent implements OnInit {
  form!: FormGroup;
  submitting  = signal(false);
  errorMsg    = signal('');
  success     = signal(false);
  imagePreview = signal<string | null>(null);
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      status:               ['LOST', Validators.required],
      animalType:           ['DOG', Validators.required],
      name:                 [''],
      breed:                [''],
      color:                [''],
      size:                 [''],
      eventDate:            ['', [Validators.required]],
      description:          [''],
      distinctiveFeatures:  [''],
      locationText:         [''],
      city:                 [''],
      province:             [''],
      contactName:          ['', Validators.required],
      contactPhone:         ['', Validators.required],
      contactEmail:         ['', Validators.email],
    });
  }

  onFileChange(ev: Event): void {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.form.patchValue({ image: file });
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMsg.set('');

    const raw = this.form.value;
    const data: ReportFormData = {
      ...raw,
      size: raw.size || undefined,
      image: (document.getElementById('image') as HTMLInputElement)?.files?.[0],
    };

    this.reportService.createReport(data).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        setTimeout(() => this.router.navigate(['/']), 2500);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Error al publicar el reporte. Inténtalo de nuevo.');
        this.submitting.set(false);
      },
    });
  }
}
