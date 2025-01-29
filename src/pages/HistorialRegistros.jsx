import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './HistorialRegistros.css';

const HistorialRegistros = () => {
  const { correo } = useParams();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`https://backend-cristian.vercel.app/historial/${correo}`);
        setHistorial(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('Error al obtener el historial');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [correo]);

  if (loading) {
    return (
      <div className="loading-container">
        <span>Cargando...</span>
        {/* Puedes agregar un spinner aquí si lo deseas */}
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="historial-container">
      <h1 className="historial-header">Historial de Registros de {correo}</h1>
      <table className="historial-table">
        <thead>
          <tr>
            <th className="historial-th">Descripción</th>
            <th className="historial-th">Sede</th>
            <th className="historial-th">Fecha de Inicio</th>
            <th className="historial-th">Fecha Final</th>
            <th className="historial-th">Estado</th>
            <th className="historial-th">Observación</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item) => (
            <tr key={item.id} className="historial-tr">
              <td className="historial-td">{item.descripcion}</td>
              <td className="historial-td">{item.sede}</td>
              <td className="historial-td">{item.fecha_inicial}</td>
              <td className="historial-td">{item.fecha_final}</td>
              <td className="historial-td">{item.estado}</td>
              <td className="historial-td">{item.observacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { HistorialRegistros };
