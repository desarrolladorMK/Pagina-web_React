import React, { useState, useEffect } from 'react';
import './HistorialTransporte.css';

const API_URL = 'https://backend-transporte.vercel.app/api/historial';

const HistorialTransporte = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ estado: 'Pendiente', observacion_anny: '' });
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error('Error al obtener el historial');
        }
        const data = await res.json();
        setRegistros(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const handleEditClick = (registro) => {
    setEditingId(registro.id);
    setEditValues({
      estado: registro.estado ? registro.estado : 'Pendiente',
      observacion_anny: registro.observacion_anny || '',
    });
    setUpdateMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({ estado: 'Pendiente', observacion_anny: '' });
    setUpdateMessage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`https://backend-transporte.vercel.app/api/registro/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });
      const result = await res.json();
      if (res.ok) {
        setUpdateMessage({ type: 'success', text: 'Registro actualizado correctamente' });
        setRegistros((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...editValues } : r))
        );
        setEditingId(null);
      } else {
        setUpdateMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (err) {
      setUpdateMessage({ type: 'error', text: 'Error al actualizar el registro' });
    }
  };

  if (loading) return <div className="automatizacion-historial"><p>Cargando historial...</p></div>;
  if (error) return <div className="automatizacion-historial"><p>Error: {error}</p></div>;

  return (
    <div className="automatizacion-historial">
      <h2>Historial de Transporte</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo Formulario</th>
            <th>Conductor</th>
            <th>Placa Vehículo</th>
            <th>Fecha Viaje</th>
            <th>Origen</th>
            <th>Sedes</th>
            <th>Valor Total</th>
            <th>Observación</th>
            <th>Estado</th>
            <th>Observación Anny</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={index}>
              <td>{registro.fecha ? registro.fecha.slice(0, 10) : '-'}</td>
              <td>{registro.tipo_formulario}</td>
              <td>{registro.conductor}</td>
              <td>{registro.placa_vehiculo}</td>
              <td>{registro.fecha_viaje ? registro.fecha_viaje.slice(0, 10) : '-'}</td>
              <td>{Array.isArray(registro.origen) ? registro.origen.join(', ') : registro.origen}</td>
              <td>{Array.isArray(registro.sedes) ? registro.sedes.join(', ') : registro.sedes}</td>
              <td>{registro.valor_total}</td>
              <td>{registro.observacion}</td>
              <td>
                {editingId === registro.id ? (
                  <select name="estado" value={editValues.estado} onChange={handleEditChange}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                  </select>
                ) : (
                  registro.estado || 'Pendiente'
                )}
              </td>
              <td>
                {editingId === registro.id ? (
                  <textarea
                    name="observacion_anny"
                    value={editValues.observacion_anny}
                    onChange={handleEditChange}
                    placeholder="Observación de admin"
                  />
                ) : (
                  registro.observacion_anny || '-'
                )}
              </td>
              <td>
                {editingId === registro.id ? (
                  <>
                    <button className="accion-button guardar" onClick={() => handleSaveEdit(registro.id)}>
                      Guardar
                    </button>
                    <button className="accion-button cancelar" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                    {updateMessage && (
                      <p className={`automatizacion-submitted-message ${updateMessage.type}`}>
                        {updateMessage.text}
                      </p>
                    )}
                  </>
                ) : (
                  <button className="accion-button editar" onClick={() => handleEditClick(registro)}>
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export  {HistorialTransporte};
