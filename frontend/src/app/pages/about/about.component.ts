import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="px-4 sm:px-8 py-6 max-w-4xl mx-auto">
      <h1 class="section-title mb-6">Sobre Nosotros</h1>

      <!-- Misión -->
      <div class="card p-6 sm:p-10 mb-6 flex flex-col sm:flex-row gap-6 items-start">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Nuestra misión</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            <strong>Mascotas Perdidas</strong> nació con un objetivo claro: facilitar el reencuentro entre
            mascotas perdidas y sus familias. Sabemos lo angustioso que puede ser perder a un compañero
            animal, y por eso hemos construido una plataforma gratuita, fácil de usar y con alcance
            en toda España.
          </p>
          <p class="text-gray-600 leading-relaxed">
            Cualquier persona puede publicar un reporte de animal perdido o encontrado, buscar coincidencias
            y ponerse en contacto directo con el anunciante. Sin intermediarios, sin costes.
          </p>
        </div>
        <div class="w-full sm:w-48 flex-shrink-0 flex items-center justify-center">
          <span class="text-8xl" aria-hidden="true">🐾</span>
        </div>
      </div>

      <!-- Pilares -->
      <h2 class="section-title mb-4">Nuestros valores</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        @for (pillar of pillars; track pillar.icon) {
          <div class="card p-5 text-center">
            <span class="text-4xl" aria-hidden="true">{{ pillar.icon }}</span>
            <h3 class="font-semibold text-gray-900 mt-3 mb-2">{{ pillar.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ pillar.desc }}</p>
          </div>
        }
      </div>

      <!-- CTA -->
      <div class="card p-8 text-center bg-gradient-to-br from-primary to-primary-light text-white">
        <h2 class="text-2xl font-bold mb-3">¿Listo para ayudar?</h2>
        <p class="mb-6 max-w-md mx-auto text-white/90">
          Únete a nuestra comunidad y ayúdanos a reunir a más familias con sus mascotas.
        </p>
        <div class="flex gap-3 justify-center flex-wrap">
          <a routerLink="/registro" class="bg-white text-primary font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Crear cuenta
          </a>
          <a routerLink="/reportar" class="btn-outline border-white text-white hover:bg-white/20">
            Publicar reporte
          </a>
        </div>
      </div>
    </div>
  `,
})
export class AboutComponent {
  pillars = [
    { icon: '❤️', title: 'Comunidad',    desc: 'Creemos en el poder de las personas que se ayudan entre sí para hacer el bien.' },
    { icon: '🔓', title: 'Gratuito',      desc: 'Todos los reportes son gratuitos. La información fluye sin barreras.' },
    { icon: '🛡️', title: 'Privacidad',   desc: 'Solo mostramos los datos que el usuario decide compartir voluntariamente.' },
  ];
}
