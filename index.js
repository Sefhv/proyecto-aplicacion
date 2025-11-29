const express = require('express')
const fs = require('fs');
const SERIES_FILE = 'series.json';

const PORT = 8080
const app = express()
app.disable('x-powered-by')

app.use(express.json())
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('<h1>Bienvenid a mi página web para continuar da click<a href="index.html">aquí</a></h1>')
})

let elementos = [
  { id: 1, nombre: "Elemento de prueba", descripcion: "Texto de muestra" }
];


app.get('/api/elementos', (req, res) => {
  res.json(elementos);
});

app.get('/api/elementos/:id', (req, res) => {
  const elemento = elementos.find(e => e.id === Number(req.params.id));
  if (!elemento) return res.status(404).json({ error: 'No encontrado' });
  res.json(elemento);
});

app.post('/api/elementos', (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  const nuevo = { id: nextId++, nombre, descripcion };
  elementos.push(nuevo);
  res.status(201).json(nuevo);
});

app.put('/api/elementos/:id', (req, res) => {
  const { nombre, descripcion } = req.body;
  const elemento = elementos.find(e => e.id === Number(req.params.id));
  if (!elemento) return res.status(404).json({ error: 'No encontrado' });
  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  elemento.nombre = nombre;
  elemento.descripcion = descripcion;
  res.json(elemento);
});

function loadSeries() {
  try {
    return JSON.parse(fs.readFileSync(SERIES_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSeries(series) {
  fs.writeFileSync(SERIES_FILE, JSON.stringify(series, null, 2));
}

function getNextId(series) {
  return series.length ? Math.max(...series.map(s => s.id)) + 1 : 1;
}

// Todas las rutas acceden al archivo
// Listar series
app.get('/api/series', (req, res) => {
  res.json(loadSeries());
});

// Detalle serie
app.get('/api/series/:id', (req, res) => {
  const series = loadSeries();
  const serie = series.find(e => e.id === Number(req.params.id));
  if (!serie) return res.status(404).json({ error: 'No encontrado' });
  res.json(serie);
});
// Crear serie
app.post('/api/series', (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  const series = loadSeries();
  const nuevaSerie = { id: getNextId(series), nombre, descripcion, imagen, reviews: [] };
  series.push(nuevaSerie);
  saveSeries(series);
  res.status(201).json(nuevaSerie);
});
// Editar serie
app.put('/api/series/:id', (req, res) => {
  const { nombre, descripcion, imagen } = req.body;
  const series = loadSeries();
  const serie = series.find(e => e.id === Number(req.params.id));
  if (!serie) return res.status(404).json({ error: 'No encontrado' });
  if (!nombre || !descripcion || !imagen) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  serie.nombre = nombre;
  serie.descripcion = descripcion;
  serie.imagen = imagen;
  saveSeries(series);
  res.json(serie);
});

// Listar reseñas de una serie
app.get('/api/series/:id/reviews', (req, res) => {
  const series = loadSeries();
  const serie = series.find(e => e.id === Number(req.params.id));
  if (!serie) return res.status(404).json({ error: 'No encontrado' });
  res.json(serie.reviews);
});
// Agregar reseña a serie
app.post('/api/series/:id/reviews', (req, res) => {
  const { usuario, puntuacion, comentario } = req.body;
  const series = loadSeries();
  const serie = series.find(e => e.id === Number(req.params.id));
  if (!serie) return res.status(404).json({ error: 'No encontrado' });
  if (!usuario || !comentario || typeof puntuacion !== 'number') {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const review = { usuario, puntuacion, comentario };
  serie.reviews.push(review);
  saveSeries(series);
  res.status(201).json(review);
});

// Si no se encuentra la página (debe ir al final)
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})