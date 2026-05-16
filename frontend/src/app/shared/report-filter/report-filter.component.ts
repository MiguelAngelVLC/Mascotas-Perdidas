import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportFilter, ReportStatus, AnimalType } from '../../core/models/report.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-report-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form"
          class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-end"
          (submit)="$event.preventDefault()">

      <div class="flex-1 min-w-[160px]">
        <label class="form-label text-white" for="q">Buscar</label>
        <input id="q" type="search" formControlName="q"
               class="form-input" placeholder="Nombre, raza, descripción…"
               aria-label="Buscar animales">
      </div>

      <div class="min-w-[130px]">
        <label class="form-label text-white" for="animalType">Tipo</label>
        <select id="animalType" formControlName="animalType" class="form-input">
          <option value="">Todos</option>
          <option value="DOG">Perro</option>
          <option value="CAT">Gato</option>
          <option value="BIRD">Ave</option>
          <option value="OTHER">Otro</option>
        </select>
      </div>

      <div class="min-w-[130px]">
        <label class="form-label text-white" for="city">Ciudad</label>
        <input id="city" type="text" formControlName="city"
               class="form-input" placeholder="Madrid, Barcelona…"
               aria-label="Filtrar por ciudad">
      </div>

      <button type="button"
              (click)="reset()"
              class="btn-secondary text-sm self-end">
        Limpiar
      </button>
    </form>
  `,
})
export class ReportFilterComponent implements OnInit {
  @Input() initialStatus?: ReportStatus;
  @Output() filterChange = new EventEmitter<Partial<ReportFilter>>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      q:          [''],
      animalType: [''],
      city:       [''],
    });

    this.form.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
    ).subscribe(val => {
      this.filterChange.emit({
        status:     this.initialStatus,
        animalType: val.animalType || undefined,
        city:       val.city || undefined,
        q:          val.q || undefined,
      });
    });
  }

  reset(): void {
    this.form.reset({ q: '', animalType: '', city: '' });
  }
}
