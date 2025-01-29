import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './PostulacionesTable.css';
import { Link } from "react-router-dom";

const PostulacionesTable = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formatear las fechas
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0]; // Asegura el formato 'YYYY-MM-DD'
  };

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const response = await fetch("https://backend-mk.vercel.app/api/postulaciones");
        const data = await response.json();
        setPostulaciones(data.data); // Asumiendo que los datos están en `data.data`
      } catch (error) {
        console.error("Error al obtener las postulaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostulaciones();
  }, []);

  const handleDownload = async (filePath) => {
    try {
      const response = await fetch(`https://backend-mk.vercel.app/api/descargar/${filePath}`);
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error durante la descarga:', err.message);
    }
  };

  const exportToExcel = () => {
    if (postulaciones.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(postulaciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Postulaciones");

    // Descargar el archivo Excel
    XLSX.writeFile(workbook, "Postulaciones.xlsx");
  };

  if (loading) return <p>Cargando datos...</p>;

  if (!postulaciones || postulaciones.length === 0) {
    return <p>No hay postulaciones disponibles.</p>;
  }

  return (
    <div className="postulaciones-container">
      <Link to="/" className="back-logo">
        <img src="/mkicono.png" alt="Logo" className="logo-image" />
      </Link>
      <h2>Postulaciones</h2>

      <table className="postulaciones-table">
        <thead>
          <tr>
            {Object.keys(postulaciones[0])
              .filter((key) => key !== "created_at") // Excluir la columna "created_at"
              .map((key) => (
                key === "hojaVida" ? <th key={key}>Hojas de vida</th> : <th key={key}>{key}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {postulaciones.map((postulacion, index) => (
            <tr key={index}>
              {Object.entries(postulacion)
                .filter(([key]) => key !== "created_at") // Excluir la celda "created_at"
                .map(([key, value], idx) => (
                  key === "hojaVida" ? (
                    <td key={idx}>
                      {value && (
                        <button
                          onClick={() =>
                            handleDownload(
                              value.replace(
                                "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/",
                                ""
                              )
                            )
                          }
                          className="download-button"
                        >
                          Descargar PDF 
                        </button>
                      )}
                    </td>
                  ) : (
                    <td key={idx}>
                      {key.includes('fecha') && value ? formatFecha(value) : value}
                    </td>
                  )
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={exportToExcel} className="excel-button">Exportar a Excel</button>
    </div>
  );
};

export { PostulacionesTable };
