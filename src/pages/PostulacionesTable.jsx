import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import "./PostulacionesTable.css";
import { Link } from "react-router-dom";

const PostulacionesTable = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Objeto de estilos personalizados para DataTable
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#210d65", // Fondo azul para el encabezado
      },
    },
    headCells: {
      style: {
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
  };

  // Función para formatear fechas al formato 'YYYY-MM-DD'
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const response = await fetch(
          "https://backend-mk.vercel.app/api/postulaciones"
        );
        const data = await response.json();
        setPostulaciones(data.data); // Asumiendo que los datos están en data.data
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
      const response = await fetch(
        `https://backend-mk.vercel.app/api/descargar/${filePath}`
      );
      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error durante la descarga:", err.message);
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
    XLSX.writeFile(workbook, "Postulaciones.xlsx");
  };

  if (loading) return <p>Cargando datos...</p>;
  if (!postulaciones || postulaciones.length === 0) {
    return <p>No hay postulaciones disponibles.</p>;
  }

  // Filtrar datos según el texto de búsqueda
  const filteredItems = postulaciones.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // Función para formatear el nombre de la columna (capitaliza y reemplaza guiones bajos)
  const formatHeader = (header) => {
    let formatted = header.replace(/_/g, " ");
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return formatted;
  };

  // Generar columnas dinámicamente, excluyendo "created_at" y personalizando "hojaVida"
  const columns = Object.keys(postulaciones[0])
    .filter((key) => key !== "created_at")
    .map((key) => {
      if (key === "hojaVida") {
        return {
          name: "Hojas de vida",
          cell: (row) =>
            row.hojaVida && (
              <button
                onClick={() =>
                  handleDownload(
                    row.hojaVida.replace(
                      "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/",
                      ""
                    )
                  )
                }
                className="download-button"
              >
                Descargar PDF
              </button>
            ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          wrap: true,
          grow: 1,
        };
      } else {
        return {
          name: formatHeader(key),
          selector: (row) =>
            key.includes("fecha") && row[key]
              ? formatFecha(row[key])
              : row[key],
          sortable: true,
          wrap: true,
          grow: 1,
        };
      }
    });

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="postulaciones-container">
      <Link to="/" className="back-logo">
        <img src="/mkicono.png" alt="Logo" className="logo-image" />
      </Link>
      <h2>Postulaciones</h2>

      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        pointerOnHover
        striped
        responsive
        subHeader
        customStyles={customStyles}
        subHeaderComponent={
          <div className="search-container">
            <span className="search-icon" onClick={toggleSearch}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={`search-input ${showSearch ? "active" : ""}`}
            />
          </div>
        }
      />

      <button onClick={exportToExcel} className="excel-button">
        Exportar a Excel
      </button>
    </div>
  );
};

export { PostulacionesTable };
