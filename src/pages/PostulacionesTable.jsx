import React, { useEffect, useState } from 'react';
import './PostulacionesTable.css';

const PostulacionesTable = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // URL base para interactuar con el backend
    const backendBaseUrl = "https://backend-mk.vercel.app";

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await fetch(`${backendBaseUrl}/api/postulaciones`);
                if (!response.ok) {
                    throw new Error('Error al obtener las postulaciones');
                }
                const data = await response.json();
                setPostulaciones(data.data); // Asumiendo que los datos están en `data.data`
            } catch (error) {
                console.error("Error al obtener las postulaciones:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostulaciones();
    }, []);

    
    const handleDownload = async (filePath) => {
      try {
          const encodedPath = encodeURIComponent(filePath);
          const response = await fetch(`https://backend-mk.vercel.app/api/descargar/${encodedPath}`);
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

  
    if (loading) return <p>Cargando datos...</p>;

    return (
        <div className="postulaciones-container">
            <h2>Postulaciones</h2>
            <table className="postulaciones-table">
                <thead>
                    <tr>
                        {postulaciones.length > 0 &&
                            Object.keys(postulaciones[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {postulaciones.map((postulacion, index) => (
                        <tr key={index}>
                            {Object.values(postulacion).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                            <td>
                                {postulacion.hojaVida && (
                                    <button
                                        onClick={() =>
                                            handleDownload(
                                                postulacion.hojaVida.replace(
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { PostulacionesTable };
