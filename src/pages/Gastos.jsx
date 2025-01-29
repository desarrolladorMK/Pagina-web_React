import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gastos.css";
import Select from "react-select";

const Gastos = () => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    area: "",
    procesos: "",
    sede: "",
    unidad: [],
    centro_costos: [],
    descripcion: "",
    monto_estimado: "",
    archivo_cotizacion: null,
    correo_empleado: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [decision, setDecision] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nueva protección contra clics múltiples
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false); // Indicador de carga para el historial

  const API_URL = "https://backend-gastos.vercel.app/api";
  const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones/";

  const checkDecision = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/requerimientos/estado/${token}`
      );
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

  const obtenerHistorial = async () => {
    if (isLoadingHistorial) return; // Evitar múltiples solicitudes mientras se carga el historial
    setIsLoadingHistorial(true);

    try {
      const response = await axios.get(
        `${API_URL}/requerimientos/obtenerRequerimientos`
      );
      if (response.status === 200) {
        const { data } = response.data;
        setHistorial(data);
        setMostrarHistorial(!mostrarHistorial);

        if (!mostrarHistorial) {
          setTimeout(() => {
            const historialElement =
              document.getElementById("gastos-historial");
            if (historialElement) {
              historialElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 0); // Cambiado a 0 para hacer el scroll inmediato
        }
      } else {
        alert("Error al obtener el historial de gastos.");
      }
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      alert("Hubo un error al cargar el historial.");
    } finally {
      setIsLoadingHistorial(false);
    }
  };

  const formatoCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "monto_estimado") {
      const valorNumerico = value.replace(/\D/g, "");
      const valorFormateado = valorNumerico
        ? formatoCOP.format(valorNumerico)
        : "";
  
      setFormData({ ...formData, [name]: valorFormateado });
    } else if (name === "unidad" || name === "centro_costos") {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setFormData({
        ...formData,
        [name]: selectedOptions,
      });
    } else if (name === "archivo_cotizacion") {
      setFormData({ ...formData, archivo_cotizacion: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSelectChange = (name, selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
  
    setFormData({
      ...formData,
      [name]: name === "centroCostos"
        ? selectedValues.join(" - ")
        : selectedValues,
    });
  };
  
  const unidadOptions = [
    { value: "Carnes", label: "Carnes" },
    { value: "Fruver", label: "Fruver" },
    { value: "Abarrotes", label: "Abarrotes" },
    { value: "Administrativo", label: "Administrativo" },
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
  
    // Convertir el valor a un formato numérico válido antes de enviarlo
    const valorNumerico = formData.monto_estimado.replace(/\D/g, "");
  
    const formDataToSend = new FormData();
    formDataToSend.append("nombre_completo", formData.nombre_completo);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("procesos", formData.procesos);
    formDataToSend.append("sede", formData.sede);
    formData.unidad.forEach((item) => {
      formDataToSend.append("unidad[]", item);
    });
    formData.centro_costos.forEach((item) => {
      formDataToSend.append("centro_costos[]", item);
    });
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("monto_estimado", valorNumerico);
    formDataToSend.append("archivo_cotizacion", formData.archivo_cotizacion);
    formDataToSend.append("correo_empleado", formData.correo_empleado);
  
    try {
      const response = await axios.post(`${API_URL}/requerimientos/crear`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsSubmitted(true);
      setDecision(response.data.decision);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setErrorMessage("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        checkDecision();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="gastos-container">
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="gastos-header">Automatización de Gasto</h1>

      {!isSubmitted ? (
        <div className="gastos-form-container">
          <h2 className="gastos-form-title">Formulario de Solicitud de Gasto</h2>
          <form onSubmit={handleSubmit} className="gastos-form">
            {/* Campos del formulario */}
            <div className="gastos-form-field">
              <label className="gastos-label">Nombre Completo:</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
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
                  Seleccione un área
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
                  Seleccione un Proceso
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
              <label className="gastos-label"> Sedes:</label>
              <select
                name="sede"
                value={formData.sede}
                onChange={handleChange}
                required
                className="gastos-input"
              >
                <option value="" disabled>
                  Seleccione la Sede
                </option>
                <option value="Copacabana Plaza">Copacabana Plaza</option>
                <option value="Copacabana Vegas">Copacabana Vegas</option>
                <option value="Copacabana San Juan">Copacabana San Juan</option>
                <option value="Girardota Parque">Girardota Parque</option>
                <option value="Girardota Llano">Girardota Llano</option>
                <option value="Barbosa">Barbosa</option>
                <option value="Carnes Barbosa">Carnes Barbosa</option>
                <option value="Villa Hermosa">Villa Hermosa</option>
              </select>
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Unidad de Negocio:</label>
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
              <label className="gastos-label">Centro de Costos:</label>
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
              <label className="gastos-label">Descripción:</label>
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
              <label className="gastos-label">Monto Estimado:</label>
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
              <label className="gastos-label">Correo del Empleado:</label>
              <input
                type="email"
                name="correo_empleado"
                value={formData.correo_empleado}
                onChange={handleChange}
                required
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

          <button
  onClick={obtenerHistorial}
  className="gastos-historial-button"
  disabled={isLoadingHistorial}
>
  {isLoadingHistorial ? "↻" : "📜"}
</button>
</div>
) : (
<div className="gastos-submitted-message">
  <h2>¡Solicitud Enviada Exitosamente!</h2>
</div>
)}

{!isSubmitted && mostrarHistorial && (
<div id="gastos-historial" className="gastos-historial desplegado">
  <h2>Historial de Gastos</h2>
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Área</th>
        <th>Procesos</th>
        <th>Sede</th>
        <th>Unidad de Negocio</th>
        <th>Centro de Costos</th>
        <th>Descripción</th>
        <th>Monto</th>
        <th>Cotización</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {historial.map((gasto) => (
        <tr key={gasto.id}>
          <td>{gasto.nombre_completo}</td>
          <td>{gasto.area}</td>
          <td>{gasto.procesos}</td>
          <td>{gasto.sede}</td>
          <td>{gasto.unidad.join(", ")}</td>
          <td>{gasto.centro_costos.join(", ")}</td>
          <td>{gasto.descripcion}</td>
          <td>${gasto.monto_estimado}</td>

          <td>
            <a
              href={`${SUPABASE_URL}${gasto.archivo_cotizacion}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver
            </a>
          </td>

          <td>{gasto.estado}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
)}
</div>
);
};

export { Gastos };
