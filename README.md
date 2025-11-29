# AnimeHub – Catálogo de Series de Anime

Aplicación Node.js + Express que expone un pequeño catálogo de series de anime, permite crear/editar títulos, añadir reseñas y navegar un front-end estático (HTML/JS). El proyecto persiste la información en un archivo `series.json`, por lo que no requiere base de datos.

## Contenido

- `index.js`: servidor Express (API REST + archivos estáticos).
- `public/`: front-end estático con 4 vistas (inicio, listado, alta de serie y detalle/reseñas), estilos en `public/css/style.css`, imágenes en `public/image/`.
- `series.json`: base de datos simple en formato JSON.

## Requisitos

- Node.js 18+ recomendado.

## Instalación y ejecución

```bash
npm install
node index.js
```

Disponible en `http://localhost:8080`.

## Front-end

| Página | Ruta | Descripción |
| --- | --- | --- |
| Inicio | `/index.html` | Navegación principal. |
| Listado | `/pages/list.html` | Tarjetas de series con imagen, descripción y enlace a detalle. Incluye botón “+ Agregar serie”. |
| Nueva serie | `/pages/new.html` | Formulario para crear series (nombre, descripción, imagen). |
| Detalle | `/pages/detail.html?id={id}` | Edita la serie y ofrece enlace a reseñas. |
| Reseñas | `/pages/review.html?id={id}` | Lista y crea reseñas para una serie. |
| Error | `/404.html` | Página 404 personalizada (se envía automáticamente en rutas inexistentes). |

> Nota: las páginas dentro de `public/pages/` se sirven estáticamente por Express gracias a `app.use(express.static('public'))`.

## API REST

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/series` | Lista todas las series. |
| GET | `/api/series/:id` | Obtiene una serie. |
| POST | `/api/series` | Crea serie `{ nombre, descripcion, imagen }`. |
| PUT | `/api/series/:id` | Actualiza serie existente. |
| GET | `/api/series/:id/reviews` | Lista reseñas. |
| POST | `/api/series/:id/reviews` | Agrega reseña `{ usuario, puntuacion, comentario }`. |

Todas las operaciones leen/escriben el archivo `series.json`.

## Imágenes

- Guardar archivos en `public/image/`.
- En el formulario de alta/edición, puedes:
  - Colocar una URL completa (`https://...`), o
  - Escribir solo el nombre del archivo (ej. `naruto.jpg`). El front normaliza el valor a `image/naruto.jpg`.
- Si agregas imágenes manualmente, recuerda copiarlas a `public/image/`.

## Datos persistentes

- `series.json` se carga al vuelo para cada petición y se reescribe al agregar/editar series o reseñas.
- Haz un respaldo antes de eliminarlo; es la única fuente de datos.

## Créditos

- Fondo de pantalla tomado de [Crunchyroll](https://static.crunchyroll.com/cr-acquisition/assets/img/start/hero/us-global/background-desktop.jpg).
