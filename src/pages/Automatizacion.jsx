import React, { useState } from 'react';
import axios from 'axios';

function Automatizacion() {
  const [descripcion, setDescripcion] = useState('');
  const [pdf, setPdf] = useState(null);
  const [sedes, setSedes] = useState('');
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [correo, setCorreo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crea un FormData para manejar el archivo PDF
    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('pdf', pdf);
    formData.append('sedes', sedes);
    formData.append('fechaInicial', fechaInicial);
    formData.append('fechaFinal', fechaFinal);
    formData.append('correo', correo);

    try {
      // Imprimir los datos de FormData para depurar
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Enviar los datos al backend
      const response = await axios.post('http://localhost:7777/enviar-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      if (error.response) {
        alert('Hubo un error al enviar el correo: ' + error.response.data);
      } else if (error.request) {
        alert('No se recibió respuesta del servidor');
      } else {
        alert('Hubo un error desconocido');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Descripción" 
        value={descripcion} 
        onChange={(e) => setDescripcion(e.target.value)} 
      />
      <input 
        type="file" 
        onChange={(e) => setPdf(e.target.files[0])} 
      />
      <input 
        type="text" 
        placeholder="Sedes" 
        value={sedes} 
        onChange={(e) => setSedes(e.target.value)} 
      />
      <input 
        type="date" 
        value={fechaInicial} 
        onChange={(e) => setFechaInicial(e.target.value)} 
      />
      <input 
        type="date" 
        value={fechaFinal} 
        onChange={(e) => setFechaFinal(e.target.value)} 
      />
      <input 
        type="email" 
        placeholder="Correo" 
        value={correo} 
        onChange={(e) => setCorreo(e.target.value)} 
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

export { Automatizacion };
