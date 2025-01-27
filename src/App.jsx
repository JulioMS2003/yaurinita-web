import { useState } from 'react';

export function App() {
  const [codigo, setCodigo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || ''; // Lee la URL del backend desde las variables de entorno

  const handleChange = (e) => {
    setCodigo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpia errores previos

    if (!codigo.trim()) {
      alert('Por favor, ingrese un código de cliente.');
      return;
    }

    if (!API_URL) {
      setError('La URL del backend no está configurada.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/buscar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteTerm: codigo }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor.');
      }

      const data = await response.json();
      setResultados(data);
    } catch (error) {
      setError('Hubo un problema al realizar la búsqueda. Por favor, inténtalo de nuevo.');
      console.error('Error al buscar cliente:', error);
    }

    setLoading(false);
  };

  return (
    <header style={styles.container}>
      <img alt="Yaurinita" src="./img/logo.png" style={styles.logo} />

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="codigo"
          id="codigo"
          value={codigo}
          onChange={handleChange}
          placeholder="Buscar cliente por código..."
          style={styles.input}
        />
        <button
          type="submit"
          disabled={!codigo.trim() || loading}
          style={{ ...styles.button, backgroundColor: loading ? '#ccc' : '#4CAF50' }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {resultados.length > 0 && (
        <div>
          <h3 style={styles.title}>Resultados de búsqueda:</h3>
          <div style={styles.resultHeader}>
            <span style={styles.resultCell}>Nombre</span>
            <span style={styles.resultCell}>Número de puesto</span>
            <span style={styles.resultCell}>Mercado</span>
            <span style={styles.resultCell}>Distrito</span>
          </div>
          <ul style={styles.resultList}>
            {resultados.map((cliente, index) => (
              <li key={index} style={styles.resultItem}>
                <span style={styles.resultCell}>{cliente.nombre_cliente || 'Nombre no disponible'}</span>
                <span style={styles.resultCell}>{cliente.numero_puesto || 'No disponible'}</span>
                <span style={styles.resultCell}>{cliente.mercado || 'No disponible'}</span>
                <span style={styles.resultCell}>{cliente.distrito || 'No disponible'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  logo: {
    marginBottom: '20px',
    width: '150px',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '250px',
  },
  button: {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px 8px 0 0',
    color: '#333',
  },
  resultCell: {
    flex: 1,
    textAlign: 'center',
    borderRight: '1px solid #ccc',
    padding: '5px',
  },
  resultList: {
    listStyleType: 'none',
    padding: 0,
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};