const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;  

const corsOptions = {
  origin: "https://yaurinita.netlify.app", 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  
app.use(express.json());

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


db.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

app.get('/api/get-data', (req, res) => {
  // Lógica de tu API
  res.json({ message: 'Datos desde EC2' });
});
// Ruta de ejemplo
app.post('/buscar', (req, res) => {
  const { clienteTerm } = req.body;
  console.log('Código recibido en backend:', clienteTerm);

  const query = 'SELECT * FROM clientes WHERE codigo = ?';

  db.query(query, [clienteTerm], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error en la búsqueda' });
    }

    console.log('Resultados de la búsqueda por código:', results);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron resultados para el código ingresado' });
    }

    res.json(results);  // Responder con los resultados de la consulta
  });
});

// Configurar el servidor para escuchar en todas las interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor backend corriendo en http://0.0.0.0:${port}`);
});
