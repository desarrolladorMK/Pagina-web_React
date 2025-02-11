import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Gastos.css";
import Select from "react-select";

const correosAutorizados = import.meta.env.VITE_EMPLEADOS.split(",");
const nombresAutorizados = import.meta.env.VITE_EMPLEADOS_NOMBRES.split(",");

// Valores iniciales del formulario
const initialFormData = {
  nombre_completo: "",
  area: "",
  procesos: "",
  sede: [],
  unidad: [],
  centro_costos: [],
  descripcion: "",
  monto_estimado: "",
  monto_sede: "",
  archivo_cotizacion: null,
  archivos_proveedor: [],
  correo_empleado: sessionStorage.getItem("correo_empleado"),
};

const Gastos = () => {
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
  const [archivos, setArchivos] = useState([
    {
      nombre: "Documento interno",
      url: "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones/cotizaciones/1738273714697_comprobante%20de%20gastos%20(1).xlsx",
    },
    {
      nombre: "Documento proveedor",
      url: "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones/cotizaciones/FORMATO%20DE%20COTIZACION%20(1).xlsx",
    },
  ]);

  const SUPABASE_URL =
    "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones";
  const API_URL = "https://backend-gastos.vercel.app/api";

  const historialRef = useRef(null);

  // Función para obtener el nombre basado en el correo
  const obtenerNombrePorCorreo = (correo) => {
    const index = correosAutorizados.indexOf(correo);
    return index !== -1 ? nombresAutorizados[index] : "Empleado no autorizado";
  };

  // Actualizar el correo y nombre al montar el componente
  useEffect(() => {
    const correo = sessionStorage.getItem("correo_empleado");
    if (correo) {
      setFormData((prevData) => ({
        ...prevData,
        correo_empleado: correo,
        nombre_completo: obtenerNombrePorCorreo(correo),
      }));
    }
  }, []);

  // Verificar cada 1 segundo si el correo en sessionStorage cambió
  useEffect(() => {
    const interval = setInterval(() => {
      const correoStorage = sessionStorage.getItem("correo_empleado");
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

  // Actualizar el historial de forma periódica (cada 30 segundos)
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

  // Función para exportar el historial a Excel (CSV)
  const exportToExcel = () => {
    if (!historialGastos || historialGastos.length === 0) return;
    const headers = [
      "Nombre",
      "Área",
      "Procesos",
      "Sede",
      "Unidad de negocio",
      "Centro de costos",
      "Descripción",
      "Monto",
      "Monto por sede",
      "Cotización",
      "Proveedor",
      "Observación",
      "Estado",
    ];
    const rows = historialGastos.map((gasto) => {
      // Procesar el campo "sede" para asegurarnos de obtener un string
      let sedesArray = [];
      if (typeof gasto.sede === "string") {
        try {
          sedesArray = JSON.parse(gasto.sede);
          if (!Array.isArray(sedesArray)) throw new Error("No es un array");
        } catch (error) {
          sedesArray = gasto.sede.includes(",")
            ? gasto.sede.split(",").map((s) => s.trim())
            : [gasto.sede];
        }
      } else if (Array.isArray(gasto.sede)) {
        sedesArray = gasto.sede;
      }
      const sedeString = sedesArray.join(", ");
      const unidadString = Array.isArray(gasto.unidad) ? gasto.unidad.join(", ") : "";
      const centroCostosString = Array.isArray(gasto.centro_costos) ? gasto.centro_costos.join(", ") : "";
      return [
        gasto.nombre_completo || "",
        gasto.area || "",
        gasto.procesos || "",
        sedeString,
        unidadString,
        centroCostosString,
        gasto.descripcion || "",
        gasto.monto_estimado || "",
        gasto.monto_sede || "",
        gasto.archivo_cotizacion || "",
        Array.isArray(gasto.archivos_proveedor) ? gasto.archivos_proveedor.join(", ") : "",
        gasto.observacion || "",
        gasto.estado || "",
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\r\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historial_gastos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funciones para manejo del formulario, checkDecision, handleChange, etc.
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "monto_estimado") {
      const valorNumerico = value.replace(/\D/g, "");
      const valorFormateado = valorNumerico ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(valorNumerico) : "";
      setFormData({ ...formData, [name]: valorFormateado });
    } else if (name === "monto_sede") {
      setFormData({ ...formData, [name]: value });
    } else if (["unidad", "centro_costos", "sede"].includes(name)) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
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
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
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
    setIsSubmitting(true);

    const valorNumerico = formData.monto_estimado.replace(/\D/g, "");

    const formDataToSend = new FormData();
    formDataToSend.append("nombre_completo", formData.nombre_completo);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("procesos", formData.procesos);

    formData.sede.forEach((item) => {
      formDataToSend.append("sede[]", item);
    });
    formData.unidad.forEach((item) => {
      formDataToSend.append("unidad[]", item);
    });
    formData.centro_costos.forEach((item) => {
      formDataToSend.append("centro_costos[]", item);
    });
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("monto_estimado", valorNumerico);
    if (formData.monto_sede.trim() !== "") {
      formDataToSend.append("monto_sede", formData.monto_sede);
    }
    formDataToSend.append("archivo_cotizacion", formData.archivo_cotizacion);
    formData.archivos_proveedor.forEach((file) => {
      formDataToSend.append("archivos_proveedor", file);
    });
    formDataToSend.append("correo_empleado", formData.correo_empleado);

    try {
      const response = await axios.post(
        `${API_URL}/requerimientos/crear`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsSubmitted(true);
      setDecision(response.data.decision);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          ...initialFormData,
          correo_empleado: formData.correo_empleado,
          nombre_completo: formData.nombre_completo,
        });
      }, 3000);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setErrorMessage(
        "Error al enviar la solicitud. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHistorial = () => {
    setMostrarHistorial((prevMostrarHistorial) => {
      const nuevoEstado = !prevMostrarHistorial;
      if (nuevoEstado && historialRef.current) {
        setTimeout(() => {
          historialRef.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return nuevoEstado;
    });
  };

  const toggleArchivos = () => {
    setMostrarArchivos((prevMostrarArchivos) => !prevMostrarArchivos);
  };

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

  return (
    <div className="gastos-container">
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="gastos-header">Conciencia del gasto</h1>

      {/* Botón flotante para mostrar archivos PDF */}
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
          <form onSubmit={handleSubmit} className="gastos-form">
            {/* Campos del formulario */}
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
                <option value="Gestión humana">Dirección Gestión humana</option>
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
                <option value="Almacén">Almacén</option>
                <option value="Procesos">Procesos</option>
                <option value="Fruver">Fruver</option>
                <option value="Cárnicos">Cárnicos</option>
                <option value="Proyectos">Proyectos</option>
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
              <label className="gastos-label">Monto por sede (opcional):</label>
              <textarea
                name="monto_sede"
                value={formData.monto_sede}
                onChange={handleChange}
                placeholder="Ejemplo: Girardota: 300.000, Barbosa: 400.000"
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
              disabled={isSubmitting}
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
            {/* Botón para exportar historial a Excel */}
            <button onClick={exportToExcel} className="export-button">
              Exportar a Excel
            </button>
            <table className="historial-table">
              <thead>
                <tr>
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
                </tr>
              </thead>
              <tbody>
                {historialGastos.map((gasto) => {
                  let sedesArray = [];
                  if (typeof gasto.sede === "string") {
                    try {
                      sedesArray = JSON.parse(gasto.sede);
                      if (!Array.isArray(sedesArray)) throw new Error("No es un array");
                    } catch (error) {
                      sedesArray = gasto.sede.includes(",")
                        ? gasto.sede.split(",").map((s) => s.trim())
                        : [gasto.sede];
                    }
                  } else if (Array.isArray(gasto.sede)) {
                    sedesArray = gasto.sede;
                  }

                  let montoSede = gasto.monto_sede || "No especificado";
                  if (montoSede && typeof montoSede === "string") {
                    montoSede = montoSede
                      .split(",")
                      .map((entry) => {
                        const [sede, monto] = entry.split(":");
                        return monto
                          ? `${sede.trim()}: ${new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(parseFloat(monto.replace(/\D/g, "")))}`
                          : `${sede.trim()}: No especificado`;
                      })
                      .join(", ");
                  }

                  const nombreArchivo = gasto.archivo_cotizacion
                    ?.split("/")
                    .pop();
                  const archivoCotizacionUrl = `${SUPABASE_URL}/cotizaciones/${nombreArchivo}`;
                  const archivosProveedor =
                    typeof gasto.archivos_proveedor === "string"
                      ? JSON.parse(gasto.archivos_proveedor)
                      : gasto.archivos_proveedor;
                  return (
                    <tr key={gasto.id}>
                      <td>{gasto.nombre_completo}</td>
                      <td>{gasto.area}</td>
                      <td>{gasto.procesos}</td>
                      <td>
                        {sedesArray.length > 0
                          ? sedesArray.join(", ")
                          : "Sin sede"}
                      </td>
                      <td>{gasto.unidad?.join(", ")}</td>
                      <td>{gasto.centro_costos?.join(", ")}</td>
                      <td>{gasto.descripcion}</td>
                      <td>{new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          }).format(gasto.monto_estimado)}</td>
                      <td>{montoSede}</td>
                      <td>
                        <a
                          href={archivoCotizacionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-pdf-button"
                        >
                          Ver
                        </a>
                      </td>
                      <td>
                        {Array.isArray(archivosProveedor) &&
                        archivosProveedor.length > 0 ? (
                          archivosProveedor.map((url, index) => (
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
                      <td>{gasto.observacion || "Sin observación"}</td>
                      <td className={getEstadoClass(gasto.estado)}>
                        {gasto.estado}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
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

export { Gastos };
