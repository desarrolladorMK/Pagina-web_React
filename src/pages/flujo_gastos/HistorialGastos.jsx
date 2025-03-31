import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './HistorialGastos.css';
import * as XLSX from "xlsx";
import Fuse from "fuse.js";

const HistorialGastos = () => {
  // Recupera el correo del usuario autenticado desde sessionStorage
  const currentUserEmail = sessionStorage.getItem("correo_empleado");
  const isUsuario10 = currentUserEmail === import.meta.env.VITE_LOGIN_EMAIL_10;

  // Define un mapeo entre líderes y áreas
  const mapaAreaLideres = {
    'operaciones@merkahorrosas.com': 'Operaciones',
    'johanmerkahorro777@gmail.com': 'Gestión humana',
    'juanmerkahorro@gmail.com': 'Comercial',
    'administracion@merkahorrosas.com': 'Administración'
  };

  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(true);
  const [loading, setLoading] = useState(true);

  // Estado de edición (incluye observacionC)
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ estado: 'Pendiente', observacion: '', observacionC: '' });
  const [updateMessage, setUpdateMessage] = useState(null);

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  // Estado que almacenará el resultado filtrado usando Fuse.js
  const [filteredHistorial, setFilteredHistorial] = useState([]);

  // Estado para guardar los IDs de filas ocultas
  const [hiddenRows, setHiddenRows] = useState([]);
  // Estado para controlar la visibilidad de la sección de filas ocultas
  const [showHiddenRowsList, setShowHiddenRowsList] = useState(false);

  // URL de la API
  const API_URL = "https://backend-gastos.vercel.app/api/requerimientos/obtenerRequerimientos";
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

  // Cargar historial de la API con filtrado según área del líder si aplica
  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          let data = response.data.data || [];
          // Si el usuario autenticado es un líder, filtra por su área
          const areaLider = mapaAreaLideres[currentUserEmail];
          if (areaLider) {
            data = data.filter(gasto => gasto.area === areaLider);
          }
          setHistorial(data);
          setFilteredHistorial(data); // Inicialmente se muestran todos los registros filtrados
        } else {
          setErrorMessage("No se pudo cargar el historial de gastos.");
        }
      } catch (error) {
        console.error("Error al obtener el historial de gastos:", error);
        setErrorMessage("No se pudo cargar el historial de gastos.");
      }
    };

    obtenerHistorial();
  }, [currentUserEmail]);

  // Cargar hiddenRows desde localStorage al montar el componente
  useEffect(() => {
    const storedHiddenRows = localStorage.getItem('hiddenRows');
    if (storedHiddenRows) {
      setHiddenRows(JSON.parse(storedHiddenRows));
    }
  }, []);

  // Guardar hiddenRows en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('hiddenRows', JSON.stringify(hiddenRows));
  }, [hiddenRows]);

  // Integración de Fuse.js: Filtrar historial según searchQuery
  useEffect(() => {
    // Si la búsqueda está vacía, muestra todos los registros filtrados previamente
    if (searchQuery.trim() === "") {
      setFilteredHistorial(historial);
      return;
    }
    // Configuración de Fuse.js con las claves deseadas
    const fuse = new Fuse(historial, {
      keys: [
        'fecha_creacion',
        'nombre_completo',
        'descripcion',
        'monto_estimado',
        'area',
        'sede',
        'unidad',
        'centro_costos',
        'estado',
        'procesos'
      ],
      threshold: 0.3,
      includeScore: true,
    });
    const results = fuse.search(searchQuery);
    setFilteredHistorial(results.map(result => result.item));
  }, [searchQuery, historial]);

  // Función para exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(historial);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
    XLSX.writeFile(workbook, "historial_gastos.xlsx");
  };

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
      observacionC: gasto.observacionC || '',
    });
    setUpdateMessage(null);
  };

  // Maneja el clic en "Cancelar"
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({ estado: 'Pendiente', observacion: '', observacionC: '' });
    setUpdateMessage(null);
  };

  // Maneja los cambios en campos de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  // Actualiza el registro; si es Usuario 10, solo actualiza observacionC
  const handleSaveEdit = async (id) => {
    try {
      const payload = isUsuario10 ? { observacionC: editValues.observacionC } : editValues;
      const response = await axios.put(`${UPDATE_URL}/${id}`, payload);
      if (response.status === 200) {
        setHistorial((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...payload } : item
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

  // Actualiza la verificación
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

  // Se excluyen las filas ocultas para la tabla principal
  const visibleHistorial = filteredHistorial.filter((gasto) => !hiddenRows.includes(gasto.id));

  // Función para ocultar una fila
  const handleHideRow = (id) => {
    setHiddenRows([...hiddenRows, id]);
  };

  // Función para restaurar (mostrar) una fila oculta individualmente
  const handleShowHiddenRow = (id) => {
    setHiddenRows(hiddenRows.filter(hiddenId => hiddenId !== id));
  };

  if (isSubmitted || !mostrarHistorial) return null;
  if (errorMessage) return <div className="gastos-historial"><p>Error: {errorMessage}</p></div>;

  return (
    <div className="gastos-historial">
      <h2>Historial de Gastos</h2>
      <h4 className="fraseMotivacional">
        “No es la abundancia de bienes lo que define una vida plena, sino la prudencia con que utilizamos lo que tenemos.”
      </h4>

      {/* Contenedor de búsqueda y exportación */}
      <div className="busqueda-export-container">
        <div className="busqueda-container">
          <button
            className="busqueda-boton"
            onClick={() => {
              setShowSearchInput(!showSearchInput);
              if (showSearchInput) setSearchQuery('');
            }}
          >
            🔍
          </button>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`busqueda-input ${showSearchInput ? 'active' : ''}`}
          />
        </div>
        <button className="excel-button-gastos" onClick={exportToExcel}>
          Exportar a Excel
        </button>
      </div>

      {/* Botón para revelar u ocultar la sección de filas ocultas */}
      {hiddenRows.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <button
            className="boton-mostrar-ocultos"
            onClick={() => setShowHiddenRowsList(!showHiddenRowsList)}
          >
            {showHiddenRowsList ? "Ocultar" : "Mostrar filas ocultas"}
          </button>
        </div>
      )}

      {/* Sección de filas ocultas */}
      {showHiddenRowsList && hiddenRows.length > 0 && (
        <div className="hidden-rows-container">
          <h3>Filas Ocultas</h3>
          <ul>
            {historial.filter(gasto => hiddenRows.includes(gasto.id)).map((gasto) => (
              <li key={gasto.id}>
                <span>
                  {gasto.nombre_completo} - {gasto.fecha_creacion ? gasto.fecha_creacion.slice(0, 10) : ''} - Obs... Claudia: {gasto.observacionC || "Sin observación"}
                </span>
                <button
                  className="boton-mostrar-oculto-individual"
                  onClick={() => handleShowHiddenRow(gasto.id)}
                >
                  Mostrar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

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
                  <th>Anticipo</th>
                  <th>Tiempo/Fecha Pago</th>
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
                {visibleHistorial.map((gasto) => (
                  <tr key={gasto.id}>
                    <td>{gasto.fecha_creacion ? gasto.fecha_creacion.slice(0, 10) : ''}</td>
                    <td>{gasto.nombre_completo}</td>
                    <td>{gasto.area}</td>
                    <td>{gasto.procesos}</td>
                    <td>{Array.isArray(gasto.sede) ? gasto.sede.join(", ") : gasto.sede}</td>
                    <td>{Array.isArray(gasto.unidad) ? gasto.unidad.join(", ") : gasto.unidad}</td>
                    <td>{Array.isArray(gasto.centro_costos) ? gasto.centro_costos.join(", ") : gasto.centro_costos}</td>
                    <td>{gasto.descripcion}</td>
                    <td>{formatoCOP.format(gasto.monto_estimado)}</td>
                    <td>{gasto.monto_sede}</td>
                    <td>{formatoCOP.format(gasto.anticipo)}</td>
                    <td>{gasto.tiempo_fecha_pago ? gasto.tiempo_fecha_pago.slice(0, 10) : "No especificado"}</td>
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
                      {isUsuario10 ? (
                        gasto.observacion || "Sin observación"
                      ) : (
                        editingId === gasto.id ? (
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
                        )
                      )}
                    </td>
                  


                    <td className={!isUsuario10 && editingId === gasto.id ? "" : getEstadoClass(gasto.estado)}>
                      {isUsuario10 ? (
                        gasto.estado
                      ) : (
                        editingId === gasto.id ? (
                          <select name="estado" value={editValues.estado} onChange={handleEditChange}>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Necesario">Necesario</option>
                            <option value="No necesario">No necesario</option>
                          </select>
                        ) : (
                          gasto.estado
                        )
                      )}
                    </td>
                    <td>
                      {editingId === gasto.id ? (
                        <>
                          <button className="accion-button guardar" onClick={() => handleSaveEdit(gasto.id)}>
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
                        <>
                          <button className="accion-button editar" onClick={() => handleEditClick(gasto)}>
                            Editar
                          </button>
                          <button className="accion-button ocultar" onClick={() => handleHideRow(gasto.id)}>
                            Ocultar
                          </button>
                        </>
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
          {/* Botones de scroll */}
          <button className="scroll-button left" onClick={scrollLeft} style={{ display: 'none' }}>‹</button>
          <button className="scroll-button right" onClick={scrollRight}>›</button>
        </div>
      </div>
    </div>
  );
};

export { HistorialGastos };
