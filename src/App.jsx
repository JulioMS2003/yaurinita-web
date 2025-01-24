import { useState } from 'react';

export function App() {
  const [codigo, setCodigo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCodigo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Código enviado al backend:', codigo);

    if (codigo.trim() === '') {
      alert('Por favor ingrese un código de cliente.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Usamos la variable de entorno
      const response = await fetch(`${import.meta.env.VITE_API_URL}/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clienteTerm: codigo }),
      });
      

      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const data = await response.json();
      setResultados(data);
    } catch (error) {
      setError('Hubo un problema al realizar la búsqueda');
      console.error('Error al buscar cliente por código:', error);
    }

    setLoading(false);
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <div>
        <img alt="Yaurinita" src='./img/logo.png' />
      </div>

      <form
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="codigo"
          id="codigo"
          value={codigo}
          onChange={handleChange}
          placeholder="Buscar cliente por código..."
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
            width: '250px'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {resultados.length > 0 && (
        <div>
          <h3>Resultados de búsqueda:</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              fontWeight: 'bold',
              backgroundColor: '#e0e0e0',
              borderRadius: '8px 8px 0 0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              color: '#333'
            }}
          >
            <span style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ccc', padding: '5px' }}>Nombre</span>
            <span style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ccc', padding: '5px' }}>Número de puesto</span>
            <span style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ccc', padding: '5px' }}>Mercado</span>
            <span style={{ flex: 1, textAlign: 'center', padding: '5px' }}>Distrito</span>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {resultados.map((clientes, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                  borderBottom: '1px solid #ccc',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                <span style={{ flex: 1, textAlign: 'center', color: '#333', borderRight: '1px solid #ccc', padding: '5px' }}>
                  {clientes.nombre_cliente ? clientes.nombre_cliente : 'Nombre no disponible'}
                </span>
                <span style={{ flex: 1, textAlign: 'center', color: '#555', borderRight: '1px solid #ccc', padding: '5px' }}>
                  {clientes.numero_puesto ? clientes.numero_puesto : 'No disponible'}
                </span>
                <span style={{ flex: 1, textAlign: 'center', color: '#555', borderRight: '1px solid #ccc', padding: '5px' }}>
                  {clientes.mercado ? clientes.mercado : 'No disponible'}
                </span>
                <span style={{ flex: 1, textAlign: 'center', color: '#555', padding: '5px' }}>
                  {clientes.distrito ? clientes.distrito : 'No disponible'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
