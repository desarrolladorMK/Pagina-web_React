import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "./Automatizacion.css";

const Automatizacion = () => {
  const [formData, setFormData] = useState({
    descripcion: "",
    sede: "",
    correo_asignado: "",
  });
  const [fechaInicial, setFechaInicial] = useState(new Date());
  const [fechaFinal, setFechaFinal] = useState(new Date());
  const [pdf, setPdf] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false);
  const [editRowId, setEditRowId] = useState(null);

  const API_URL = "https://backend-cristian.vercel.app";
  const SUPABASE_PDF_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/pdf-cristian/pdfs";

  // Opciones estáticas
  const SEDES = [
    "Copacabana Plaza", "Villa Hermosa", "Girardota Parque", "Girardota llano",
    "Carnes Barbosa", "Copacabana Vegas", "Copacabana San Juan", "Barbosa",
  ];
  const CORREOS = ["fruver@merkahorrosas.com", "gerencia1@merkahorrosas.com"];

  // Obtener historial completo de todos los correos
  const obtenerHistorial = async () => {
    if (isLoadingHistorial) return;
    setIsLoadingHistorial(true);
    try {
      const response = await axios.get(`${API_URL}/historial`);
      const data = Array.isArray(response.data) ? response.data : [];
      setHistorial(data);
      setMostrarHistorial(true);
      scrollToHistorial();
    } catch (error) {
      console.error("Error al obtener el historial completo:", error);
      toast.error("Error al cargar el historial completo.");
    } finally {
      setIsLoadingHistorial(false);
    }
  };

  // Función para hacer scroll al historial
  const scrollToHistorial = () => {
    setTimeout(() => {
      const historialElement = document.getElementById("automatizacion-historial");
      if (historialElement) {
        historialElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  // Alternar visibilidad del historial
  const toggleHistorial = () => {
    setMostrarHistorial((prev) => !prev);
    if (!mostrarHistorial) obtenerHistorial();
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setPdf(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    data.append("descripcion", formData.descripcion);
    data.append("pdf", pdf);
    data.append("sede", formData.sede);
    data.append("fecha_inicial", fechaInicial.toISOString().split("T")[0]);
    data.append("fecha_final", fechaFinal.toISOString().split("T")[0]);
    data.append("correo_asignado", formData.correo_asignado);

    try {
      await axios.post(`${API_URL}/registro`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsSubmitted(true);
      toast.success("Solicitud enviada exitosamente.");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar estado y observación en el historial
  const updateHistorialField = (index, field, value) => {
    setHistorial((prev) => {
      const newHistorial = [...prev];
      newHistorial[index][field] = value;
      return newHistorial;
    });
  };

  // Guardar cambios en el historial
  const guardarCambios = async (index) => {
    const item = historial[index];
    try {
      await axios.put(`${API_URL}/historial`, {
        id: item.id,
        estado: item.estado,
        observacion: item.observacion || "", // Enviar siempre una cadena, aunque sea vacía
      });
      toast.success("Cambios guardados exitosamente.");
      setEditRowId(null);
    } catch (error) {
      console.error("Error al guardar los cambios:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(`Error al guardar los cambios: ${error.response?.data?.error || error.message}`);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditRowId(null);
    obtenerHistorial(); // Restaurar los datos originales
  };

  // Clase según estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "estado-pendiente";
      case "Completado":
        return "estado-completado";
      case "No Completado":
        return "estado-no-completado";
      default:
        return "";
    }
  };

  // Columnas de DataTable
  const columns = [
    { name: "Descripción", selector: (row) => row.descripcion, wrap: true, grow: 2, width: "300px" },
    { name: "Sede", selector: (row) => row.sede, wrap: true, width: "150px" },
    { name: "F. Inicial", selector: (row) => row.fecha_inicial, sortable: true, wrap: true, width: "120px" },
    { name: "F. Final", selector: (row) => row.fecha_final, sortable: true, wrap: true, width: "120px" },
    { name: "Correo", selector: (row) => row.correo_asignado, wrap: true, width: "180px" },
    {
      name: "PDF",
      cell: (row) =>
        row.pdf ? (
          <a
            href={row.pdf.startsWith("http") ? row.pdf : `${SUPABASE_PDF_URL}/${row.pdf}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver PDF
          </a>
        ) : (
          "Sin PDF"
        ),
      wrap: true,
      width: "100px",
    },
    {
      name: "Estado",
      cell: (row) => {
        const index = historial.findIndex((item) => item.id === row.id);
        return editRowId === row.id ? (
          <select
            value={row.estado}
            onChange={(e) => updateHistorialField(index, "estado", e.target.value)}
            style={{ width: "100%", height: "100%" }}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Completado">Completado</option>
            <option value="No Completado">No Completado</option>
          </select>
        ) : (
          <div className={`estado-cell ${getEstadoClass(row.estado || "Pendiente")}`}>
            {row.estado || "Pendiente"}
          </div>
        );
      },
      wrap: true,
      width: "120px",
    },
    {
      name: "Observación",
      cell: (row) => {
        const index = historial.findIndex((item) => item.id === row.id);
        return editRowId === row.id ? (
          <input
            type="text"
            value={row.observacion || ""}
            onChange={(e) => updateHistorialField(index, "observacion", e.target.value)}
            style={{ width: "100%" }}
          />
        ) : (
          row.observacion || ""
        );
      },
      wrap: true,
      grow: 2,
      width: "250px",
    },
    {
      name: "Acciones",
      cell: (row) => {
        const index = historial.findIndex((item) => item.id === row.id);
        return editRowId === row.id ? (
          <div className="acciones-container">
            <button className="accion-button guardar" onClick={() => guardarCambios(index)}>
              Guardar
            </button>
            <button className="accion-button cancelar" onClick={cancelarEdicion}>
              Cancelar
            </button>
          </div>
        ) : (
          <button className="accion-button editar" onClick={() => setEditRowId(row.id)}>
            Editar
          </button>
        );
      },
      ignoreRowClick: true,
      wrap: true,
      width: "150px",
    },
  ];

  // Estilos personalizados para DataTable
  const customStyles = {
    headRow: { style: { backgroundColor: "var(--secondary-color)", color: "#fff", fontWeight: "600" } },
    headCells: { style: { display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" } },
    cells: { style: { padding: "10px", whiteSpace: "normal", wordBreak: "break-word", textAlign: "center" } },
  };

  return (
    <div>
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <div className="automatizacion-container">
        <h1 className="automatizacion-header">Automatización Fruver</h1>
        <h4 className="fraseMotivacional">
          "Que otra cosa puede hacer el hombre bondadoso, si no es hacer el bien por los demás hombres."
          <br /> Marco Aurelio
        </h4>

        {!isSubmitted ? (
          <div className="automatizacion-form-container">
            <form onSubmit={handleSubmit} className="automatizacion-form">
              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Descripción:</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="automatizacion-input"
                />
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Archivo PDF:</label>
                <input
                  type="file"
                  name="pdf"
                  accept="application/pdf"
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="automatizacion-input"
                />
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Sede:</label>
                <select
                  name="sede"
                  value={formData.sede}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="automatizacion-input"
                >
                  <option value="" disabled>
                    Selecciona una sede
                  </option>
                  {SEDES.map((sede) => (
                    <option key={sede} value={sede}>
                      {sede}
                    </option>
                  ))}
                </select>
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Fecha Inicial:</label>
                <ReactDatePicker
                  selected={fechaInicial}
                  onChange={setFechaInicial}
                  dateFormat="yyyy-MM-dd"
                  disabled={isSubmitting}
                  className="automatizacion-input"
                />
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Fecha Final:</label>
                <ReactDatePicker
                  selected={fechaFinal}
                  onChange={setFechaFinal}
                  dateFormat="yyyy-MM-dd"
                  disabled={isSubmitting}
                  className="automatizacion-input"
                />
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Correo Asignado:</label>
                <select
                  name="correo_asignado"
                  value={formData.correo_asignado}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="automatizacion-input"
                >
                  <option value="" disabled>
                    Seleccione un correo
                  </option>
                  {CORREOS.map((correo) => (
                    <option key={correo} value={correo}>
                      {correo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="automatizacion-form-field automatizacion-submit-container">
                <button type="submit" className="automatizacion-submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="automatizacion-submitted-message">
            <h2>¡Solicitud Enviada Exitosamente!</h2>
          </div>
        )}
      </div>

      {!isSubmitted && (
        <>
          <button className="floating-button" onClick={toggleHistorial} disabled={isLoadingHistorial}>
            {isLoadingHistorial ? "⏳" : "📜"}
          </button>

          {mostrarHistorial && (
            <div id="automatizacion-historial" className="automatizacion-historial desplegado">
              <h2>Historial Completo de Reposición Fruver</h2>
              <DataTable
                columns={columns}
                data={historial}
                pagination
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                noDataComponent="No hay registros en el historial."
              />
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export { Automatizacion };
