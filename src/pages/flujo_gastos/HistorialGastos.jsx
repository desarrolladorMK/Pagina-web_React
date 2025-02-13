import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistorialGastos.css';

const HistorialGastos = () => {
  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(true);

  // Estado local para edición
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ estado: 'Pendiente', observacion: '' });
  const [updateMessage, setUpdateMessage] = useState(null);

  // URL de la API de historial de gastos
  const API_URL = "https://backend-gastos.vercel.app/api/requerimientos/obtenerRequerimientos";
  // Supongamos que para actualizar un requerimiento usas:
  const UPDATE_URL = "https://backend-gastos.vercel.app/api/requerimientos"; 
  const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones"; 

  useEffect(() => {
    // Obtener los datos del historial de gastos al cargar el componente
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
    // Rellenar los campos con los valores actuales
    setEditValues({
      estado: gasto.estado || 'Pendiente',
      observacion: gasto.observacion || '',
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

  // Maneja la actualización (PUT) en el backend
  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(`${UPDATE_URL}/${id}`, editValues);
      if (response.status === 200) {
        // Actualizar el estado local
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

  

  return (
    <div className="gastos-historial">
      <h2>Historial de Gastos</h2>

      {errorMessage && (
        <div className="gastos-error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {!isSubmitted && mostrarHistorial && (
        <div id="gastos-historial" className="gastos-historial desplegado">
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
              </tr>
            </thead>
            <tbody>
              {historial.map((gasto) => {
                const nombreArchivo = gasto.archivo_cotizacion
                  ? gasto.archivo_cotizacion.split("/").pop()
                  : null;
                const archivoCotizacionUrl = nombreArchivo
                  ? `${SUPABASE_URL}/cotizaciones/${nombreArchivo}`
                  : '';

                const archivosProveedor =
                  typeof gasto.archivos_proveedor === "string"
                    ? JSON.parse(gasto.archivos_proveedor)
                    : gasto.archivos_proveedor;

                const archivosProveedorUrls = Array.isArray(archivosProveedor)
                  ? archivosProveedor
                  : [];

                return (
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
                      {archivoCotizacionUrl && (
                        <a
                          href={archivoCotizacionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-pdf-button"
                        >
                          Ver
                        </a>
                      )}
                    </td>
                    <td>
                      {archivosProveedorUrls.length > 0 ? (
                        archivosProveedorUrls.map((url, index) => (
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
                        <span>No hay archivos de proveedor</span>
                      )}
                    </td>

                    {/* Observación (editable + botón copiar) */}
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
                        <>
                          {gasto.observacion || "Sin observación"}
                          
                        </>
                      )}
                    </td>

                    {/* Estado (Pendiente, Necesario, No necesario) */}
                    <td
                      className={
                        editingId === gasto.id
                          ? ""
                          : getEstadoClass(gasto.estado)
                      }
                    >
                      {editingId === gasto.id ? (
                        <select
                          name="estado"
                          value={editValues.estado}
                          onChange={handleEditChange}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Necesario">Necesario</option>
                          <option value="No necesario">No necesario</option>
                        </select>
                      ) : (
                        gasto.estado
                      )}
                    </td>

                    {/* Acciones (Editar / Guardar / Cancelar) */}
                    <td>
                      {editingId === gasto.id ? (
                        <>
                          <button
                            className="accion-button guardar"
                            onClick={() => handleSaveEdit(gasto.id)}
                          >
                            Guardar
                          </button>
                          <button
                            className="accion-button cancelar"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </button>
                          {updateMessage && (
                            <p
                              className={`automatizacion-submitted-message ${updateMessage.type}`}
                            >
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { HistorialGastos };
