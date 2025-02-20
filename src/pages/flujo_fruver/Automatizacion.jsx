import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import "./Automatizacion.css";

const Automatizacion = () => {
  const [formData, setFormData] = useState({
    descripcion: "",
    sede: "",
    correo_asignado: "",
  });
  // Usamos react-datepicker para las fechas (objetos Date)
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

  // URL base para los PDFs en Supabase (bucket: pdf-cristian, carpeta: pdfs)
  const SUPABASE_PDF_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/pdf-cristian/pdfs";

  const obtenerHistorial = async () => {
    if (isLoadingHistorial) return;
    setIsLoadingHistorial(true);
    try {
      const response = await axios.get(
        `${API_URL}/historial/${formData.correo_asignado}`
      );
      if (Array.isArray(response.data)) {
        setHistorial(response.data);
      } else {
        setHistorial([]);
      }
      setMostrarHistorial(true);
      setTimeout(() => {
        const historialElement = document.getElementById("automatizacion-historial");
        if (historialElement) {
          historialElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 0);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      alert("Hubo un error al cargar el historial.");
    } finally {
      setIsLoadingHistorial(false);
    }
  };

  const toggleHistorial = () => {
    if (mostrarHistorial) {
      setMostrarHistorial(false);
    } else {
      obtenerHistorial();
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setPdf(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    data.append("descripcion", formData.descripcion);
    data.append("pdf", pdf);
    data.append("sede", formData.sede);
    // Enviar fechas en formato yyyy-MM-dd
    data.append("fecha_inicial", fechaInicial.toISOString().split("T")[0]);
    data.append("fecha_final", fechaFinal.toISOString().split("T")[0]);
    data.append("correo_asignado", formData.correo_asignado);

    try {
      await axios.post(`${API_URL}/registro`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cambiarEstado = (index, nuevoEstado) => {
    const nuevoHistorial = [...historial];
    nuevoHistorial[index].estado = nuevoEstado;
    setHistorial(nuevoHistorial);
  };

  const actualizarObservacion = (index, nuevaObservacion) => {
    const nuevoHistorial = [...historial];
    nuevoHistorial[index].observacion = nuevaObservacion;
    setHistorial(nuevoHistorial);
  };

  // Se utiliza la URL original sin incluir el id en la URL,
  // y se envía el id en el body, que es lo que espera el backend.
  const guardarCambios = async (index) => {
    const item = historial[index];
    try {
      await axios.put(`${API_URL}/historial`, {
        id: item.id,
        estado: item.estado,
        observacion: item.observacion,
      });
      alert("Cambios guardados exitosamente.");
      setEditRowId(null);
    } catch (error) {
      console.error(
        "Error al guardar los cambios:",
        error.response ? error.response.data : error
      );
      alert("Hubo un error al guardar los cambios.");
    }
  };

  // Definición de columnas para DataTable con wrap activado
  const columns = [
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      wrap: true,
    },
    {
      name: "Sede",
      selector: (row) => row.sede,
      wrap: true,
    },
    {
      name: "Fecha Inicial",
      selector: (row) => row.fecha_inicial,
      sortable: true,
      wrap: true,
    },
    {
      name: "Fecha Final",
      selector: (row) => row.fecha_final,
      sortable: true,
      wrap: true,
    },
    {
      name: "Correo",
      selector: (row) => row.correo_asignado,
      wrap: true,
    },
    {
      name: "PDF",
      cell: (row) =>
        row.pdf ? (
          <a
            href={
              row.pdf.startsWith("http")
                ? row.pdf
                : `${SUPABASE_PDF_URL}/${row.pdf}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver PDF
          </a>
        ) : (
          "Sin PDF"
        ),
      wrap: true,
    },
    {
      name: "Estado",
      cell: (row) => {
        const index = historial.findIndex((item) => item.id === row.id);
        if (editRowId === row.id) {
          return (
            <select
              value={row.estado}
              onChange={(e) => cambiarEstado(index, e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="No Completado">No Completado</option>
            </select>
          );
        }
        return row.estado;
      },
      wrap: true,
    },
    {
      name: "Observación",
      cell: (row) => {
        const index = historial.findIndex((item) => item.id === row.id);
        if (editRowId === row.id) {
          return (
            <input
              type="text"
              value={row.observacion}
              onChange={(e) => actualizarObservacion(index, e.target.value)}
            />
          );
        }
        return row.observacion;
      },
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => {
        const index = historial.findIndex((item) => item.id === row.id);
        if (editRowId === row.id) {
          return (
            <button
              className="accion-button guardar"
              onClick={() => guardarCambios(index)}
            >
              Guardar
            </button>
          );
        }
        return (
          <button
            className="accion-button editar"
            onClick={() => setEditRowId(row.id)}
          >
            Editar
          </button>
        );
      },
      ignoreRowClick: true,
      wrap: true,
    },
  ];

  // Estilos personalizados para DataTable
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "var(--secondary-color)",
        color: "#fff",
        fontWeight: "600",
        verticalAlign: "middle",
      },
    },
    headCells: {
      style: {
        padding: "10px",
        verticalAlign: "middle",
        textAlign: "center",
      },
    },
    cells: {
      style: {
        padding: "10px",
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflow: "visible",
        verticalAlign: "middle",
        textAlign: "center",
        minHeight: "50px",
        height: "auto",
        lineHeight: "1.5",
      },
    },
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
          "Que otra cosa puede hacer el hombre bondadoso, si no es hacer el bien por los demás hombres."<br /> Marco Aurelio
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
                  className="automatizacion-input"
                >
                  <option value="" disabled>
                    Selecciona una sede
                  </option>
                  <option value="Copacabana Plaza">Copacabana Plaza</option>
                  <option value="Villa Hermosa">Villa Hermosa</option>
                  <option value="Girardota parque">Girardota Parque</option>
                  <option value="Girardota llano">Girardota llano</option>
                  <option value="Carnes barbosa">Carnes Barbosa</option>
                  <option value="Copacabana Vegas">Copacabana Vegas</option>
                  <option value="Copacabana San Juan">
                    Copacabana San Juan
                  </option>
                  <option value="Barbosa">Barbosa</option>
                </select>
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Fecha Inicial:</label>
                <ReactDatePicker
                  selected={fechaInicial}
                  onChange={(date) => setFechaInicial(date)}
                  dateFormat="yyyy-MM-dd"
                  className="automatizacion-input"
                />
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Fecha Final:</label>
                <ReactDatePicker
                  selected={fechaFinal}
                  onChange={(date) => setFechaFinal(date)}
                  dateFormat="yyyy-MM-dd"
                  className="automatizacion-input"
                />
              </div>

              <div className="automatizacion-form-field">
                <label className="automatizacion-label">Correo Asignado:</label>
                <select
                  type="email"
                  name="correo_asignado"
                  value={formData.correo_asignado}
                  onChange={handleChange}
                  required
                  className="automatizacion-input"
                >
                  <option value="">Seleccione un correo</option>
                  <option value="fruver@merkahorrosas.com">
                    fruver@merkahorrosas.com
                  </option>
                  <option value="gerencia1@merkahorrosas.com">
                    gerencia1@merkahorrosas.com
                  </option>
                </select>
              </div>

              <div className="automatizacion-form-field automatizacion-submit-container">
                <button
                  type="submit"
                  className="automatizacion-submit-button"
                  disabled={isSubmitting}
                >
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
          <button className="floating-button" onClick={toggleHistorial}>
            📜
          </button>

          {mostrarHistorial && (
            <div
              id="automatizacion-historial"
              className="automatizacion-historial desplegado"
            >
              <h2>Historial reposición Fruver</h2>
              <DataTable
                columns={columns}
                data={historial}
                pagination
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { Automatizacion };
