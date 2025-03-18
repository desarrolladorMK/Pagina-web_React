import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import './HistorialCartera.css';
import * as XLSX from "xlsx";
import Fuse from "fuse.js";
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistorialCartera = () => {
  const currentUserEmail = sessionStorage.getItem("correo_empleado");

  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const [pendingNotifications, setPendingNotifications] = useState(new Set());
  const [sentVouchers, setSentVouchers] = useState(new Set());

  const API_URL = "https://backend-gastos.vercel.app/api/requerimientos/obtenerRequerimientos";
  const UPDATE_URL = "https://backend-gastos.vercel.app/api/requerimientos";
  const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones";

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 500, behavior: 'smooth' });
    }
  };

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistorial(historial);
      return;
    }
    const fuse = new Fuse(historial, {
      keys: ['fecha_creacion', 'nombre_completo', 'descripcion', 'area', 'sede', 'unidad', 'centro_costos'],
      threshold: 0.3,
      includeScore: true,
    });
    const results = fuse.search(searchQuery);
    setFilteredHistorial(results.map(result => result.item));
  }, [searchQuery, historial]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(historial);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
    XLSX.writeFile(workbook, "historial_cartera.xlsx");
  };

  const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

  const VoucherNotification = ({ id, nombreCompleto, correo_empleado }) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleClick = () => {
      if (!isButtonDisabled) {
        setIsButtonDisabled(true); // Desactiva inmediatamente al primer clic
        handleSendVoucher(id, correo_empleado);
      }
    };

    return (
      <div>
        Voucher asignado para {nombreCompleto}.<br />
        <button
          className="toast-send-button"
          onClick={handleClick}
          disabled={isButtonDisabled || sentVouchers.has(id)}
        >
          Enviar notificación
        </button>
      </div>
    );
  };

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
        setHistorial(prev =>
          prev.map(item =>
            item.id === id ? { ...item, voucher: response.data.archivo_comprobante } : item
          )
        );
        setPendingNotifications(prev => new Set(prev).add(id));
        const gasto = historial.find(item => item.id === id);
        const nombreCompleto = gasto?.nombre_completo || "Usuario desconocido";
        const correo_empleado = gasto?.correo_empleado;
        toast.info(
          <VoucherNotification id={id} nombreCompleto={nombreCompleto} correo_empleado={correo_empleado} />,
          {
            position: "bottom-right",
            autoClose: false,
            closeOnClick: false,
            draggable: true,
            toastId: `voucher-${id}`,
          }
        );
      }
    })
    .catch(error => {
      console.error("Error al subir el voucher:", error);
      toast.error("Error al subir el voucher.");
    });
  }, [UPDATE_URL, currentUserEmail, historial, sentVouchers]);

  const handleDeleteVoucher = async (id) => {
    try {
      const response = await axios.put(`${UPDATE_URL}/${id}`, { voucher: null });
      if (response.status === 200) {
        setHistorial(prev =>
          prev.map(item =>
            item.id === id ? { ...item, voucher: null } : item
          )
        );
        setPendingNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        const updatedResponse = await axios.get(API_URL);
        if (updatedResponse.status === 200) {
          const updatedData = updatedResponse.data.data || [];
          setHistorial(updatedData);
          setFilteredHistorial(updatedData);
        }

        toast.success("Voucher eliminado correctamente.");
      } else {
        throw new Error(`Respuesta inesperada del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al eliminar el voucher:", error.response?.data || error.message);
      toast.error(`Error al eliminar el voucher: ${error.message}`);
    }
  };

  const handleSendVoucher = async (id, correo_empleado) => {
    if (sentVouchers.has(id)) return;

    try {
      setSentVouchers(prev => new Set(prev).add(id));
      const response = await axios.post(`${UPDATE_URL}/enviarVoucher`, { id, correo_empleado });
      if (response.status === 200) {
        setPendingNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success("Voucher enviado al correo del solicitante.");
        toast.dismiss(`voucher-${id}`);
      }
    } catch (error) {
      console.error("Error al enviar el voucher:", error);
      toast.error("Error al enviar el voucher.");
      setSentVouchers(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const FileDropzone = ({ id }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: acceptedFiles => onDropVoucher(acceptedFiles, id),
      multiple: false,
      accept: { 'image/*': [], 'application/pdf': [] }
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

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Pendiente": return "estado-pendiente";
      case "Necesario": return "estado-aprobado";
      case "No necesario": return "estado-rechazado";
      default: return "";
    }
  };

  if (errorMessage) return <div className="cartera-historial"><p>Error: {errorMessage}</p></div>;

  return (
    <div className="cartera-historial">
      <h2>Historial de Cartera</h2>

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
                            Eliminar Voucher
                          </button>
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

      <ToastContainer />
    </div>
  );
};

export { HistorialCartera };