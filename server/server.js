const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'Adriano2k03', 
  database: 'yaurinita',  
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

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

    res.json(results);  
  });
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
