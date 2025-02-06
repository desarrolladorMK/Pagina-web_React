import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistorialGastos.css';

const HistorialGastos = () => {
  const [historial, setHistorial] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(true);

  // URL de la API de historial de gastos
  const API_URL = "https://backend-gastos.vercel.app/api/requerimientos/obtenerRequerimientos"; // Usar la URL correcta según tu backend
  const SUPABASE_URL = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/cotizaciones"; // Agrega tu URL de Supabase aquí

  useEffect(() => {
    // Obtener los datos del historial de gastos al cargar el componente
    const obtenerHistorial = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          const data = response.data.data || []; // Verifica la estructura de la respuesta
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

  const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' });

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

  return (
    <div className="gastos-historial">
      <h2>Historial de Gastos</h2>

      {/* Mostrar mensaje de error si existe */}
      {errorMessage && (
        <div className="gastos-error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Mostrar tabla si hay datos en el historial */}
      {!isSubmitted && mostrarHistorial && (
        <div id="gastos-historial" className="gastos-historial desplegado">
       
          <table>
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
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((gasto) => {
                // Si 'gasto.archivo_cotizacion' contiene una URL completa, extraemos solo el nombre del archivo
                const nombreArchivo = gasto.archivo_cotizacion ? gasto.archivo_cotizacion.split("/").pop() : null; // Extraemos el nombre del archivo
                const archivoCotizacionUrl = nombreArchivo ? `${SUPABASE_URL}/cotizaciones/${nombreArchivo}` : '';

                // Verificamos si 'gasto.archivos_proveedor' es un array antes de usar 'map'
                const archivosProveedor =
                  typeof gasto.archivos_proveedor === "string"
                    ? JSON.parse(gasto.archivos_proveedor) // Convertimos el string en un array
                    : gasto.archivos_proveedor;

                const archivosProveedorUrls = Array.isArray(archivosProveedor)
                  ? archivosProveedor // Como ya es una URL completa, la usamos directamente
                  : [];

                return (
                  <tr key={gasto.id}>
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
                      {/* Botón para ver el archivo de cotización como PDF */}
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
                    <td className={getEstadoClass(gasto.estado)}>
                      {gasto.estado}
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