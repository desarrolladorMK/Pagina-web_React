import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import './HistorialCartera.css';
import * as XLSX from "xlsx";
import Fuse from "fuse.js";
import { useDropzone } from 'react-dropzone';

const HistorialCartera = () => {
  // Recupera el correo del usuario autenticado
  const currentUserEmail = sessionStorage.getItem("correo_empleado");

  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filteredHistorial, setFilteredHistorial] = useState([]);

  const API_URL = "https://backend-gastos.vercel.app/api/requerimientos/obtenerRequerimientos";
  const UPDATE_URL = "https://backend-gastos.vercel.app/api/requerimientos";
  const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones";

  const scrollContainerRef = useRef(null);

  // Funciones para scroll horizontal
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

  // Cargar historial desde la API
  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          const data = response.data.data || [];
          setHistorial(data);
          setFilteredHistorial(data);
        } else {
          setErrorMessage("No se pudo cargar el historial de cartera.");
        }
      } catch (error) {
        console.error("Error al obtener el historial:", error);
        setErrorMessage("No se pudo cargar el historial de cartera.");
      }
    };

    obtenerHistorial();
  }, []);

  // Integración de Fuse.js para búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistorial(historial);
      return;
    }
    const fuse = new Fuse(historial, {
      keys: [
        'fecha_creacion',
        'nombre_completo',
        'descripcion',
        'area',
        'sede',
        'unidad',
        'centro_costos'
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
    XLSX.writeFile(workbook, "historial_cartera.xlsx");
  };

  // Formateo de moneda en COP
  const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

  // Función para manejar la carga del voucher (llama al endpoint /adjuntarVoucher)
  const onDropVoucher = useCallback((acceptedFiles, id) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('voucher', file);
    formData.append('id', id);
    formData.append('correo_empleado', currentUserEmail);

    axios.post(`${UPDATE_URL}/adjuntarVoucher`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(response => {
      if (response.status === 200) {
        // Actualiza el historial con la URL del comprobante que devuelve el backend
        setHistorial(prev =>
          prev.map(item =>
            item.id === id ? { ...item, voucher: response.data.archivo_comprobante } : item
          )
        );
      }
    })
    .catch(error => {
      console.error("Error al subir el voucher:", error);
    });
  }, [UPDATE_URL, currentUserEmail]);

  // Función para eliminar el voucher (establece voucher a null)
  const handleDeleteVoucher = async (id) => {
    try {
      const response = await axios.put(`${UPDATE_URL}/${id}`, { voucher: null });
      if (response.status === 200) {
        setHistorial(prev =>
          prev.map(item =>
            item.id === id ? { ...item, voucher: null } : item
          )
        );
      }
    } catch (error) {
      console.error("Error al eliminar el voucher:", error);
    }
  };

  // Función para enviar el voucher al correo del solicitante
  // NOTA: Debes implementar en el backend un endpoint que se encargue de reenviar el voucher,
  // por ejemplo, en POST /enviarVoucher.
  const handleSendVoucher = async (id, correo_empleado) => {
    try {
      const response = await axios.post(`${UPDATE_URL}/enviarVoucher`, { id, correo_empleado });
      if (response.status === 200) {
        alert("Voucher enviado al correo del solicitante.");
      }
    } catch (error) {
      console.error("Error al enviar el voucher:", error);
      alert("Error al enviar el voucher.");
    }
  };

  // Componente para la zona de dropzone del voucher, con atributo capture para habilitar la cámara
  const FileDropzone = ({ id }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: acceptedFiles => onDropVoucher(acceptedFiles, id),
      multiple: false,
      accept: {
        'image/*': [],
        'application/pdf': []
      }
    });
  
    return (
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps({ capture: "environment" })} />
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <p>Arrastra un archivo o toma una foto.</p>
        )}
      </div>
    );
  };
  
  // Función para asignar la clase CSS según el estado
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

  if (errorMessage)
    return <div className="cartera-historial"><p>Error: {errorMessage}</p></div>;

  return (
    <div className="cartera-historial">
      <h2>Historial de Cartera</h2>

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
        <button className="excel-button-cartera" onClick={exportToExcel}>
          Exportar a Excel
        </button>
      </div>

      <div id="cartera-historial" className="cartera-historial-table desplegado">
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
                  <th>Voucher</th>
                  <th>Proveedor</th>
                  <th>Observación</th>
                  <th>Estado</th>
                  <th>Observación Claudia</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistorial.map((gasto) => (
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
                      {gasto.voucher ? (
                        <>
                         <a
                          href={`${SUPABASE_URL}/comprobante/${gasto.voucher.split("/").pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-pdf-button"
                        >
                          Ver Voucher
                        </a>
                          <br />
                          <button
                            className="delete-voucher-button"
                            onClick={() => handleDeleteVoucher(gasto.id)}
                          >
                            Eliminar voucher
                          </button>
                          <button
                            className="send-voucher-button"
                            onClick={() => handleSendVoucher(gasto.id, gasto.correo_empleado)}
                          >
                            Enviar voucher
                          </button>
                          <FileDropzone id={gasto.id} />
                        </>
                      ) : (
                        <FileDropzone id={gasto.id} />
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
                    <td>{gasto.observacion || "Sin observación"}</td>
                    <td className={getEstadoClass(gasto.estado)}>{gasto.estado}</td>
                    <td>{gasto.observacionC || "Sin observación"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="scroll-button right" onClick={scrollRight}>›</button>
        </div>
      </div>
    </div>
  );
};

export { HistorialCartera };
