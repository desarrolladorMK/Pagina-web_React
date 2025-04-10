import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Gastos.css";
import Select from "react-select";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const correosAutorizados = import.meta.env.VITE_EMPLEADOS.split(",");
const nombresAutorizados = import.meta.env.VITE_EMPLEADOS_NOMBRES.split(",");

const initialFormData = {
  fecha_creacion: new Date().toISOString().split("T")[0],
  nombre_completo: "",
  area: "",
  procesos: "",
  sede: [],
  unidad: [],
  centro_costos: [],
  descripcion: "",
  monto_estimado: "",
  monto_sede: "",
  anticipo: "",
  tiempo_fecha_pago: "",
  archivo_cotizacion: null,
  archivos_proveedor: [],
  correo_empleado: localStorage.getItem("correo_empleado") || "", // Cambiado a localStorage
};

const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones";
const SUPABASE_URL_EXCEL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public";
const API_URL = "https://backend-gastos.vercel.app/api";

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
      padding: "7px",
      textAlign: "start",
      verticalAlign: "middle",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "break-word",
      height: "auto",
      maxWidth: "300px",
      overflow: "auto",
      fontSize: "0.80rem",
    },
  },
};

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

const Gastos = () => {
  const [fecha, setFecha] = useState(initialFormData.fecha_creacion);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [decision, setDecision] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [historial, setHistorial] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false);
  const [historialGastos, setHistorialGastos] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarArchivos, setMostrarArchivos] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [archivos, setArchivos] = useState([
    {
      nombre: "Documento interno",
      url: `${SUPABASE_URL_EXCEL}/cotizaciones/proveedores/1738273714697_comprobante%20de%20gastos%20(1)%20(7).xlsx`,
    },
    {
      nombre: "Documento proveedor",
      url: `${SUPABASE_URL_EXCEL}/cotizaciones/proveedores/FORMATO%20DE%20COTIZACION%20(1)%20(1).xlsx`,
    },
  ]);

  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const historialRef = useRef(null);

  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  const obtenerNombrePorCorreo = (correo) => {
    const index = correosAutorizados.indexOf(correo);
    if (index !== -1) {
      return nombresAutorizados[index];
    }
    return "Empleado no autorizado";
  };

  useEffect(() => {
    const correo = localStorage.getItem("correo_empleado"); // Cambiado a localStorage
    if (correo) {
      setFormData((prevData) => ({
        ...prevData,
        correo_empleado: correo,
        nombre_completo: obtenerNombrePorCorreo(correo),
      }));
    } else {
      // Si no hay correo, redirigir al login (opcional, dependiendo de tu lógica)
      setErrorMessage("No se encontró el correo del usuario. Por favor, inicia sesión nuevamente.");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const correoStorage = localStorage.getItem("correo_empleado"); // Cambiado a localStorage
      if (correoStorage && correoStorage !== formData.correo_empleado) {
        setFormData((prevData) => ({
          ...prevData,
          correo_empleado: correoStorage,
          nombre_completo: obtenerNombrePorCorreo(correoStorage),
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [formData.correo_empleado]);

  useEffect(() => {
    if (formData.correo_empleado) {
      const fetchHistorialGastos = async () => {
        setIsLoadingHistorial(true);
        try {
          const response = await axios.get(`${API_URL}/requerimientos/historial`, {
            params: { correo_empleado: formData.correo_empleado },
            headers: { "Cache-Control": "no-cache" },
          });
          if (response.status === 200) {
            setHistorialGastos(response.data);
          }
        } catch (error) {
          console.error("Error al obtener el historial de gastos:", error);
        } finally {
          setIsLoadingHistorial(false);
        }
      };

      fetchHistorialGastos();
      const interval = setInterval(() => {
        fetchHistorialGastos();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [formData.correo_empleado]);

  const checkDecision = async () => {
    try {
      const response = await axios.get(`${API_URL}/requerimientos/estado/${token}`);
      if (response.status === 200) {
        const data = response.data;
        setDecision(data.decision);
      } else {
        setErrorMessage("No se pudo obtener el estado de la solicitud.");
      }
    } catch (error) {
      console.error("Error al obtener el estado de la solicitud:", error);
      setErrorMessage("Hubo un error al obtener el estado.");
    }
  };

  const eliminarRegistro = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el registro de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/requerimientos/eliminar/${id}`);
        setHistorialGastos((prev) => prev.filter((gasto) => gasto.id !== id));
        Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar el registro:", error);
        Swal.fire("Error", "Hubo un problema al eliminar el registro.", "error");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "monto_estimado" || name === "anticipo") {
      const valorNumerico = value.replace(/\D/g, "");
      const valorFormateado = valorNumerico ? formatoCOP.format(valorNumerico) : "";
      setFormData({ ...formData, [name]: valorFormateado });
    } else if (name === "tiempo_fecha_pago") {
      setFormData({ ...formData, tiempo_fecha_pago: value });
    } else if (name === "monto_sede") {
      setFormData({ ...formData, [name]: value });
    } else if (["unidad", "centro_costos", "sede"].includes(name)) {
      const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else if (name === "archivo_cotizacion") {
      setFormData({ ...formData, archivo_cotizacion: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInputChange = (e) => {
    const { name, files } = e.target;
    if (name === "archivos_proveedor") {
      setFormData({
        ...formData,
        archivos_proveedor: files ? Array.from(files) : [],
      });
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };

  const handleSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData({ ...formData, [name]: selectedValues });
  };

  const unidadOptions = [
    { value: "Carnes", label: "Carnes" },
    { value: "Fruver", label: "Fruver" },
    { value: "Abarrotes", label: "Abarrotes" },
    { value: "Administrativo", label: "Administrativo" },
  ];

  const sedeOptions = [
    { value: "Copacabana Plaza", label: "Copacabana Plaza" },
    { value: "Copacabana Vegas", label: "Copacabana Vegas" },
    { value: "Copacabana San Juan", label: "Copacabana San Juan" },
    { value: "Girardota Parque", label: "Girardota Parque" },
    { value: "Girardota Llano", label: "Girardota Llano" },
    { value: "Barbosa", label: "Barbosa" },
    { value: "Carnes Barbosa", label: "Carnes Barbosa" },
    { value: "Villa Hermosa", label: "Villa Hermosa" },
    { value: "Todas las sedes", label: "Todas las sedes" },
  ];

  const centroCostosOptions = [
    { value: "Gerencia", label: "Gerencia" },
    { value: "Contabilidad", label: "Contabilidad" },
    { value: "Tesoreria", label: "Tesoreria" },
    { value: "Gestion humana", label: "Gestion humana" },
    { value: "Generales administrativos", label: "Generales administrativos" },
    { value: "Puntos de venta", label: "Puntos de venta" },
    { value: "Domicilios", label: "Domicilios" },
    { value: "Carnicos", label: "Carnicos" },
    { value: "Fruver", label: "Fruver" },
    { value: "Panaderia", label: "Panaderia" },
    { value: "Bodega", label: "Bodega" },
    { value: "Generales operaciones", label: "Generales operaciones" },
    { value: "Compras", label: "Compras" },
    { value: "Tienda virtual", label: "Tienda virtual" },
    { value: "Callcenter", label: "Callcenter" },
    { value: "Generales comerciales", label: "Generales comerciales" },
    { value: "Generico", label: "Generico" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (hasSubmittedOnce) {
      setErrorMessage("Ya has enviado este formulario. Por favor, espera la respuesta.");
      return;
    }

    setIsSubmitting(true);
    setHasSubmittedOnce(true);

    const valorNumerico = formData.monto_estimado.replace(/\D/g, "");
    const valorNumericoAnticipo = formData.anticipo
      ? formData.anticipo.replace(/\D/g, "")
      : "0";

    const formDataToSend = new FormData();
    formDataToSend.append("fecha_creacion", formData.fecha_creacion);
    formDataToSend.append("nombre_completo", formData.nombre_completo);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("procesos", formData.procesos);

    formData.sede.forEach((item) => formDataToSend.append("sede[]", item));
    formData.unidad.forEach((item) => formDataToSend.append("unidad[]", item));
    formData.centro_costos.forEach((item) => formDataToSend.append("centro_costos[]", item));
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("monto_estimado", valorNumerico);
    if (formData.monto_sede.trim() !== "") {
      formDataToSend.append("monto_sede", formData.monto_sede);
    }
    formDataToSend.append("anticipo", valorNumericoAnticipo);
    formDataToSend.append("tiempo_fecha_pago", formData.tiempo_fecha_pago);
    formDataToSend.append("archivo_cotizacion", formData.archivo_cotizacion);
    formData.archivos_proveedor.forEach((file) => {
      formDataToSend.append("archivos_proveedor", file);
    });
    formDataToSend.append("correo_empleado", formData.correo_empleado);

    console.log("Datos enviados al backend:", Object.fromEntries(formDataToSend.entries()));

    try {
      const response = await axios.post(`${API_URL}/requerimientos/crear`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsSubmitted(true);
      setDecision(response.data.decision);
      setErrorMessage("");
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          ...initialFormData,
          correo_empleado: formData.correo_empleado,
          nombre_completo: formData.nombre_completo,
        });
        setHasSubmittedOnce(false);
      }, 3000);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setErrorMessage("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
      setHasSubmittedOnce(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHistorial = () => {
    setMostrarHistorial((prev) => {
      const nuevoEstado = !prev;
      if (nuevoEstado) {
        setTimeout(() => {
          historialRef.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return nuevoEstado;
    });
  };

  const toggleArchivos = () => {
    setMostrarArchivos((prev) => !prev);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const renderClickableCell = (content) => (
    <div
      onClick={(e) => {
        if (e.target.tagName !== "A") {
          openModal(content);
        }
      }}
      style={{ cursor: "pointer" }}
      title="Haz clic para ver el contenido completo"
    >
      {content}
    </div>
  );

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        checkDecision();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    if (formData.correo_empleado) {
      const nombreResponsable = obtenerNombrePorCorreo(formData.correo_empleado);
      setFormData((prevData) => ({
        ...prevData,
        nombre_completo: nombreResponsable,
      }));
    }
  }, [formData.correo_empleado]);

  useEffect(() => {
    if (formData.correo_empleado) {
      setIsLoadingHistorial(true);
      axios
        .get(`${API_URL}/requerimientos/historial`, {
          params: { correo_empleado: formData.correo_empleado },
        })
        .then((response) => {
          if (response.status === 200) {
            setHistorialGastos(response.data);
          }
        })
        .catch((error) => {
          console.error("Error al obtener el historial de gastos:", error);
        })
        .finally(() => {
          setIsLoadingHistorial(false);
        });
    }
  }, [formData.correo_empleado]);

  const exportToExcel = () => {
    if (!historialGastos || historialGastos.length === 0) return;
    const dataForSheet = historialGastos.map((gasto) => {
      let sedeString = "";
      if (typeof gasto.sede === "string") {
        try {
          const sedesArray = JSON.parse(gasto.sede);
          sedeString = Array.isArray(sedesArray) ? sedesArray.join(", ") : gasto.sede;
        } catch (error) {
          sedeString = gasto.sede.includes(",")
            ? gasto.sede.split(",").map((s) => s.trim()).join(", ")
            : gasto.sede;
        }
      } else if (Array.isArray(gasto.sede)) {
        sedeString = gasto.sede.join(", ");
      }
      return {
        fecha_creacion: gasto.fecha_creacion || "",
        Nombre: gasto.nombre_completo || "",
        Área: gasto.area || "",
        Procesos: gasto.procesos || "",
        Sede: sedeString,
        "Unidad de negocio": Array.isArray(gasto.unidad) ? gasto.unidad.join(", ") : "",
        "Centro de costos": Array.isArray(gasto.centro_costos) ? gasto.centro_costos.join(", ") : "",
        Descripción: gasto.descripcion || "",
        Monto: gasto.monto_estimado || "",
        "Monto por sede": gasto.monto_sede || "",
        Cotización: gasto.archivo_cotizacion || "",
        Proveedor: Array.isArray(gasto.archivos_proveedor) ? gasto.archivos_proveedor.join(", ") : "",
        Observación: gasto.observacion || "",
        Estado: gasto.estado || "",
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
    XLSX.writeFile(workbook, "historial_gastos.xlsx");
  };

  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.fecha_creacion,
      cell: (row) =>
        renderClickableCell(
          row.fecha_creacion ? row.fecha_creacion.slice(0, 10) : "-"
        ),
      sortable: true,
    },
    {
      name: "Nombre",
      cell: (row) => renderClickableCell(row.nombre_completo),
    },
    {
      name: "Área",
      cell: (row) => renderClickableCell(row.area),
    },
    {
      name: "Procesos",
      cell: (row) => renderClickableCell(row.procesos),
    },
    {
      name: "Sede",
      cell: (row) => {
        let sedesArray = [];
        if (typeof row.sede === "string") {
          try {
            sedesArray = JSON.parse(row.sede);
            if (!Array.isArray(sedesArray))
              throw new Error("No es un array");
          } catch (error) {
            sedesArray = row.sede.includes(",")
              ? row.sede.split(",").map((s) => s.trim())
              : [row.sede];
          }
        } else if (Array.isArray(row.sede)) {
          sedesArray = row.sede;
        }
        return renderClickableCell(sedesArray.length > 0 ? sedesArray.join(", ") : "Sin sede");
      },
    },
    {
      name: "Unidad de negocio",
      cell: (row) => renderClickableCell(Array.isArray(row.unidad) ? row.unidad.join(", ") : row.unidad),
    },
    {
      name: "Centro de costos",
      cell: (row) => renderClickableCell(Array.isArray(row.centro_costos) ? row.centro_costos.join(", ") : row.centro_costos),
    },
    {
      name: "Descripción",
      cell: (row) => renderClickableCell(row.descripcion),
    },
    {
      name: "Monto",
      cell: (row) => renderClickableCell(formatoCOP.format(row.monto_estimado)),
    },
    {
      name: "Monto por sede",
      cell: (row) => {
        let montoSede = row.monto_sede || "No especificado";
        if (montoSede && typeof montoSede === "string") {
          montoSede = montoSede
            .split(",")
            .map((entry) => {
              const [sede, monto] = entry.split(":");
              if (monto) {
                return `${sede.trim()}: ${formatoCOP.format(parseFloat(monto.replace(/\D/g, "")))}`;
              } else {
                return `${sede.trim()}: No especificado`;
              }
            })
            .join(", ");
        }
        return renderClickableCell(montoSede);
      },
    },
    {
      name: "Anticipo",
      cell: (row) => renderClickableCell(formatoCOP.format(row.anticipo)),
    },
    {
      name: "Tiempo/Fecha Pago",
      cell: (row) => renderClickableCell(row.tiempo_fecha_pago ? row.tiempo_fecha_pago.slice(0, 10) : "No especificado"),
    },
    {
      name: "Cotización",
      cell: (row) => {
        const nombreArchivo = row.archivo_cotizacion?.split("/").pop();
        const archivoCotizacionUrl = `${SUPABASE_URL}/cotizaciones/${nombreArchivo}`;
        return (
          <div style={{ textAlign: "center", width: "100%" }}>
            <a
              onClick={(e) => e.stopPropagation()}
              href={archivoCotizacionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-pdf-button"
            >
              Ver
            </a>
          </div>
        );
      },
    },
    {
      name: "Proveedor",
      cell: (row) => {
        const archivosProveedor =
          typeof row.archivos_proveedor === "string"
            ? JSON.parse(row.archivos_proveedor)
            : row.archivos_proveedor;
        return Array.isArray(archivosProveedor) && archivosProveedor.length > 0 ? (
          archivosProveedor.map((url, index) => (
            <div key={index}>
              <a
                onClick={(e) => e.stopPropagation()}
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
          renderClickableCell("No hay archivos de proveedor")
        );
      },
    },
    {
      name: "Observación",
      cell: (row) => renderClickableCell(row.observacion || "Sin observación"),
    },
    {
      name: "Voucher",
      cell: (row) => {
        if (Array.isArray(row.vouchers) && row.vouchers.length > 0) {
          return (
            <div style={{ textAlign: "center", width: "100%" }}>
              {row.vouchers.map((url, index) => (
                <div key={index} style={{ marginBottom: "4px" }}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-pdf-button"
                  >
                    Ver Voucher {index + 1}
                  </a>
                </div>
              ))}
            </div>
          );
        } else {
          return renderClickableCell("No hay vouchers");
        }
      },
    },
    {
      name: "Estado",
      cell: (row) => (
        <div
          className={`estado-cell ${getEstadoClass(row.estado)}`}
          onClick={() => openModal(row.estado)}
          title="Haz clic para ver el contenido completo"
        >
          {row.estado}
        </div>
      ),
    },
    {
      name: "Obs..Claudia",
      cell: (row) => renderClickableCell(row.observacionC || "Sin observación"),
    },
    {
      name: "Eliminar",
      cell: (row) => (
        <button
          onClick={() => eliminarRegistro(row.id)}
          className="delete-button"
        >
          ❌
        </button>
      ),
    },
  ];

  return (
    <div className="gastos-container">
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.webp" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="gastos-header">Conciencia del gasto</h1>

      <button onClick={toggleArchivos} className="gastos-flotante-button">
        📂
      </button>
      {mostrarArchivos && (
        <div className="gastos-archivos-desplegados">
          <ul>
            {archivos.map((archivo, index) => (
              <li key={index}>
                <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                  {archivo.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isSubmitted ? (
        <div className="gastos-form-container">
          <h2 className="gastos-form-title">Formulario cuidado del gasto</h2>
          <h4 className="fraseMotivacional">
            "Cuando cuidamos, nos protegemos todos."
          </h4>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="gastos-form">
            <div className="gastos-form-field">
              <label className="gastos-label">
                Responsable de la gestión del cuidado gasto:
              </label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo || ""}
                onChange={handleChange}
                required
                disabled
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Área:</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="gastos-input"
              >
                <option value="" disabled>
                  Seleccione un área:
                </option>
                <option value="Gerencia">Gerencia</option>
                <option value="Gestión humana">
                  Dirección Gestión humana
                </option>
                <option value="Operaciones">Dirección Operaciones</option>
                <option value="Contabilidad">
                  Dirección Administrativa y Financiera
                </option>
                <option value="Comercial">Dirección Comercial</option>
              </select>
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Procesos:</label>
              <select
                name="procesos"
                value={formData.procesos}
                onChange={handleChange}
                required
                className="gastos-input"
              >
                <option value="" disabled>
                  Seleccione un Proceso:
                </option>
                <option value="Logística">Logística</option>
                <option value="Inventarios">Inventarios</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Procesos">Procesos</option>
                <option value="Fruver">Fruver</option>
                <option value="Cárnicos">Cárnicos</option>
                <option value="Proyectos">Proyectos</option>
                <option value="Operaciones-Comerciales">
                  Operaciones Comerciales
                </option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Sedes:</label>
              <Select
                name="sede"
                value={sedeOptions.filter((option) =>
                  formData.sede.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleSelectChange("sede", selectedOptions)
                }
                options={sedeOptions}
                isMulti
                className="gastos-input"
                placeholder="Seleccione las sedes"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Unidad de negocio:</label>
              <Select
                name="unidad"
                value={unidadOptions.filter((option) =>
                  formData.unidad.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleSelectChange("unidad", selectedOptions)
                }
                options={unidadOptions}
                isMulti
                className="gastos-input"
                placeholder="Seleccione las unidades"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Centro de costos:</label>
              <Select
                name="centro_costos"
                value={centroCostosOptions.filter((option) =>
                  formData.centro_costos.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleSelectChange("centro_costos", selectedOptions)
                }
                options={centroCostosOptions}
                isMulti
                className="gastos-input"
                placeholder="Seleccione los centros de costos"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">
                Describe tu necesidad y la razón:
              </label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Monto estimado:</label>
              <input
                type="text"
                name="monto_estimado"
                value={formData.monto_estimado}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Monto por sede:</label>
              <textarea
                name="monto_sede"
                value={formData.monto_sede}
                onChange={handleChange}
                placeholder="Ejemplo: Girardota: 300.000, Barbosa: 400.000"
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Anticipo:</label>
              <input
                type="text"
                name="anticipo"
                value={formData.anticipo}
                onChange={handleChange}
                placeholder="Ingrese el monto del anticipo"
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Fecha estimada de pago:</label>
              <input
                type="date"
                name="tiempo_fecha_pago"
                value={formData.tiempo_fecha_pago}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Cotización:</label>
              <input
                type="file"
                name="archivo_cotizacion"
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">
                Documentos nuevos proveedores:
              </label>
              <input
                type="file"
                name="archivos_proveedor"
                onChange={handleInputChange}
                multiple
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Correo del empleado:</label>
              <input
                type="email"
                name="correo_empleado"
                value={formData.correo_empleado}
                onChange={handleChange}
                required
                disabled
                className="gastos-input"
              />
            </div>
            <button
              type="submit"
              className="gastos-submit-button"
              disabled={isSubmitting || hasSubmittedOnce}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      ) : (
        <div className="gastos-submitted-message">
          <h2>¡Solicitud Enviada Exitosamente!</h2>
        </div>
      )}

      <button onClick={toggleHistorial} className="historial-flotante-button">
        📜
      </button>
      {isLoadingHistorial ? (
        <p>Cargando historial...</p>
      ) : (
        mostrarHistorial && (
          <div
            id="gastos-historial"
            className="gastos-historial desplegado"
            ref={historialRef}
          >
            <DataTable
              columns={columns}
              data={historialGastos}
              pagination
              responsive
              highlightOnHover
              striped
              customStyles={customStyles}
            />
            <button onClick={exportToExcel} className="excel-button">
              Exportar a Excel
            </button>
          </div>
        )
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              ×
            </span>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { Gastos };