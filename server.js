import express from 'express';

const app = express();
const port = 5000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente!');
});

// Levanta el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
