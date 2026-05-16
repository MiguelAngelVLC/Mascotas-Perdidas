# Guía de Estilos — Mascotas Perdidas

## Paleta de Colores

| Token Tailwind       | Hex       | Uso                                         |
|----------------------|-----------|---------------------------------------------|
| `primary`            | `#023d7f` | Fondo principal de la app                   |
| `primary-light`      | `#529bee` | Botones primarios, enlaces activos, footer  |
| `teal`               | `#4ecdc4` | Estado ENCONTRADO, CTA, logo, badge verde   |
| `teal-dark`          | `#45b8b0` | Hover de teal                               |
| `red-pet`            | `#ff6b6b` | Estado PERDIDO, avatar, alertas             |
| `yellow-pet`         | `#ffe66d` | Estadísticas totales, paso 3                |
| `nav`                | `#33a9c7` | Barra de navegación                         |

## Tipografía

- **Fuente**: Roboto (Google Fonts), pesos 400 / 500 / 600 / 700
- **Tamaños base**:
  - Títulos de sección: `text-3xl font-bold`
  - Subtítulos: `text-xl font-semibold`
  - Cuerpo: `text-sm` / `text-base`
  - Labels: `text-sm font-semibold`
  - Metadata: `text-xs`

## Componentes Clave

### Tarjeta de animal
- Fondo blanco, bordes redondeados `rounded-2xl`, sombra `shadow-card`
- Imagen 192px de altura, `object-cover`
- Badge de estado en esquina superior derecha (`badge-lost` / `badge-found`)
- Hover: elevación y sombra mayor

### Botones
| Clase          | Color relleno    | Uso                          |
|----------------|------------------|------------------------------|
| `btn-primary`  | `#529bee`        | Acción principal             |
| `btn-teal`     | `#4ecdc4`        | ENCONTRADO, CTA secundario   |
| `btn-red`      | `#ff6b6b`        | PERDIDO, peligro             |
| `btn-secondary`| Gris             | Cancelar, acción secundaria  |
| `btn-outline`  | Transparente     | CTA sobre fondo de color     |

Todos los botones tienen `rounded-full` (forma píldora).

### Modal de detalle
- Overlay oscuro 60% opacidad
- Contenido dividido: imagen izquierda (45%), datos derecha (55%)
- En móvil se apilan verticalmente
- Animación `animate-slide-up` al aparecer

### Formularios
- Inputs: `form-input` (border, focus ring primary-light)
- Labels: `form-label` (negrita, color gris oscuro)
- Errores: `form-error` (rojo pequeño debajo del campo)

## Accesibilidad

- `role="dialog"`, `aria-modal="true"`, `aria-label` en el modal
- `aria-label` en todos los botones con solo iconos
- `focus-visible:outline-2` en todos los elementos interactivos
- `alt` descriptivo en todas las imágenes
- `sr-only` para textos solo para lectores de pantalla
- `role="alert"` en mensajes de error
- `aria-current="page"` en paginación

## Responsive

- **Mobile first**: columna única por defecto
- **≥640px (sm)**: 2 columnas en listas, menú horizontal
- **≥1024px (lg)**: 3 columnas en listas
- Navegación hamburger en móvil
