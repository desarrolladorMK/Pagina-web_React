import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './HistorialGastos.css';

const HistorialGastos = () => {
  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(true);
  const [loading, setLoading] = useState(true); // Asegúrate de declararlo
  
  // Estado local para edición
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ estado: 'Pendiente', observacion: '' });
  const [updateMessage, setUpdateMessage] = useState(null);
  
  // URL de la API de historial de gastos
  const API_URL = "https://backend-gastos.vercel.app/api/requerimientos/obtenerRequerimientos";
  // URL para actualizar
  const UPDATE_URL = "https://backend-gastos.vercel.app/api/requerimientos"; 
  const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones"; 

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -500,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 500,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          const data = response.data.data || [];
          setHistorial(data);
        } else {
          setErrorMessage("No se pudo cargar el historial de gastos.");
        }
      } catch (error) {
        console.error("Error al obtener el historial de gastos:", error);
        setErrorMessage("No se pudo cargar el historial de gastos.");
      }
    };

    obtenerHistorial();
  }, []);

  // Formateo de moneda en COP
  const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

  // Asigna clases CSS según el estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "estado-pendiente";
      case "Necesario":
        return "estado-aprobado";
      case "No necesario":
        return "estado-rechazado";
      default:
        return "";
    }
  };

  // Maneja el clic en "Editar"
  const handleEditClick = (gasto) => {
    setEditingId(gasto.id);
    setEditValues({
      estado: gasto.estado || 'Pendiente',
      observacion: gasto.observacion || '',
      observacionC : gasto.observacionC || '', // Agregar observacionesClaudia al estado para el modal
    });
    setUpdateMessage(null);
  };

  // Maneja el clic en "Cancelar"
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({ estado: 'Pendiente', observacion: '' });
    setUpdateMessage(null);
  };

  // Maneja los cambios en los campos de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja la actualización (PUT) en el backend para editar estado y observación
  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(`${UPDATE_URL}/${id}`, editValues);
      if (response.status === 200) {
        setHistorial((prev) =>
          prev.map((item) => 
            item.id === id ? { ...item, ...editValues } : item
          )
        );
        setEditingId(null);
        setUpdateMessage({ type: 'success', text: 'Registro actualizado correctamente' });
      } else {
        setUpdateMessage({ type: 'error', text: 'Error al actualizar el registro' });
      }
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      setUpdateMessage({ type: 'error', text: 'Error al actualizar el registro' });
    }
  };

  // Maneja el cambio de la casilla "Verificado"
  const handleToggleVerified = async (id, currentValue) => {
    try {
      const newValue = !currentValue;
      const response = await axios.put(`${UPDATE_URL}/${id}`, { verificado: newValue });
      if (response.status === 200) {
        setHistorial((prev) =>
          prev.map((item) => 
            item.id === id ? { ...item, verificado: newValue } : item
          )
        );
      } else {
        alert('Error al actualizar la verificación');
      }
    } catch (error) {
      console.error("Error al actualizar la verificación:", error);
      alert('Error al actualizar la verificación');
    }
  };

  if (isSubmitted || !mostrarHistorial) return null;
  if (errorMessage) return <div className="gastos-historial"><p>Error: {errorMessage}</p></div>;

  return (
    <div className="gastos-historial">
      <h2>Historial de Gastos</h2>
      <div id="gastos-historial" className="gastos-historial desplegado">
        <div className="scroll-container-wrapper">
          <button className="scroll-button left" onClick={scrollLeft}>‹</button>
          <div className="scroll-container" ref={scrollContainerRef}>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Área</th>
                  <th>Procesos</th>
                  <th>Sede</th>
                  <th>Unidad de negocio</th>
                  <th>Centro de costos</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Monto por sede</th>
                  <th>Cotización</th>
                  <th>Proveedor</th>
                  <th>Observación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                  <th>Verificado</th>
                  <th>Observación Claudia</th> 
                </tr>
              </thead>
              <tbody>
                {historial.map((gasto) => (
                  <tr key={gasto.id}>
                    <td>{gasto.fecha_creacion ? gasto.fecha_creacion.slice(0, 10) : ''}</td>
                    <td>{gasto.nombre_completo}</td>
                    <td>{gasto.area}</td>
                    <td>{gasto.procesos}</td>
                    <td>{gasto.sede}</td>
                    <td>{Array.isArray(gasto.unidad) ? gasto.unidad.join(", ") : gasto.unidad}</td>
                    <td>{Array.isArray(gasto.centro_costos) ? gasto.centro_costos.join(", ") : gasto.centro_costos}</td>
                    <td>{gasto.descripcion}</td>
                    <td>{formatoCOP.format(gasto.monto_estimado)}</td>
                    <td>{gasto.monto_sede}</td>
                    <td>
                      {gasto.archivo_cotizacion && (
                        <a
                          href={`${SUPABASE_URL}/cotizaciones/${gasto.archivo_cotizacion.split("/").pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-pdf-button"
                        >
                          Ver
                        </a>
                      )}
                    </td>
                    <td>
                      {gasto.archivos_proveedor ? (
                        Array.isArray(JSON.parse(gasto.archivos_proveedor)) ? (
                          JSON.parse(gasto.archivos_proveedor).map((url, index) => (
                            <div key={index}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-pdf-button"
                              >
                                Ver
                              </a>
                            </div>
                          ))
                        ) : (
                          <a
                            href={gasto.archivos_proveedor}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-pdf-button"
                          >
                            Ver
                          </a>
                        )
                      ) : (
                        <span>No hay archivos de proveedor</span>
                      )}
                    </td>
                    <td>
                      {editingId === gasto.id ? (
                        <textarea
                          name="observacion"
                          value={editValues.observacion}
                          onChange={handleEditChange}
                          rows={3}
                          className="observacion-textarea"
                          placeholder="Observación"
                        />
                      ) : (
                        gasto.observacion || "Sin observación"
                      )}
                    </td>
                    <td className={editingId === gasto.id ? "" : getEstadoClass(gasto.estado)}>
                      {editingId === gasto.id ? (
                        <select name="estado" value={editValues.estado} onChange={handleEditChange}>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Necesario">Necesario</option>
                          <option value="No necesario">No necesario</option>
                        </select>
                      ) : (
                        gasto.estado
                      )}
                    </td>
                    <td>
                      {editingId === gasto.id ? (
                        <>
                          <button
                            className="accion-button guardar"
                            onClick={() => handleSaveEdit(gasto.id)}
                          >
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
                        <button
                          className="accion-button editar"
                          onClick={() => handleEditClick(gasto)}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={gasto.verificado || false}
                        onChange={() => handleToggleVerified(gasto.id, gasto.verificado)}
                      />
                    </td>
                    <td>
                      {editingId === gasto.id ? (
                        <textarea
                          name="observacionC"
                          value={editValues.observacionC}
                          onChange={handleEditChange}
                          rows={3}
                          className="observacion-textarea"
                          placeholder="Observación Claudia"
                        />
                      ) : (
                        gasto.observacionC || "Sin observación"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="scroll-button left" onClick={scrollLeft}>‹</button>
          <button className="scroll-button right" onClick={scrollRight}>›</button>
        </div>
      </div>
    </div>
  );
};

export { HistorialGastos };
