// HistorialTransporte.js
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import * as XLSX from "xlsx";
import "./HistorialTransporte.css";

const API_URL = "https://backend-transporte.vercel.app/api/historial";

const HistorialTransporte = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ estado: "Pendiente", observacion_anny: "" });
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(API_URL);
        setRegistros(res.data);
      } catch (err) {
        setError("Error al obtener el historial");
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const handleEditClick = (registro) => {
    setEditingId(registro.id);
    setEditValues({
      estado: registro.estado || "Pendiente",
      observacion_anny: registro.observacion_anny || "",
    });
    setUpdateMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({ estado: "Pendiente", observacion_anny: "" });
    setUpdateMessage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`https://backend-transporte.vercel.app/api/registro/${id}`, editValues);
      if (res.status === 200) {
        setUpdateMessage({ type: "success", text: "Registro actualizado correctamente" });
        setRegistros((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...res.data.data } : r)) // Usar datos del backend
        );
        setEditingId(null);
      } else {
        setUpdateMessage({ type: "error", text: `Error: ${res.data.error}` });
      }
    } catch (err) {
      setUpdateMessage({ type: "error", text: "Error al actualizar el registro" });
    }
  };

  const handleExportExcel = () => {
    const headers = [
      "fecha",
      "tipo_formulario",
      "conductor",
      "placa_vehiculo",
      "cedula",
      "cuenta_bancaria",
      "fecha_viaje",
      "origen",
      "sedes",
      "valor_total",
      "observacion",
      "estado",
      "observacion_anny",
    ];
    const exportData = registros.map((reg) => ({
      fecha: reg.fecha ? reg.fecha.slice(0, 10) : "-",
      tipo_formulario: reg.tipo_formulario,
      conductor: reg.conductor,
      placa_vehiculo: reg.placa_vehiculo,
      cedula: reg.cedula,
      cuenta_bancaria: reg.cuenta_bancaria,
      fecha_viaje: reg.fecha_viaje ? reg.fecha_viaje.slice(0, 10) : "-",
      origen: Array.isArray(reg.origen) ? reg.origen.join(", ") : reg.origen,
      sedes: Array.isArray(reg.sedes) ? reg.sedes.join(", ") : reg.sedes,
      valor_total: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(reg.valor_total),
      observacion: reg.observacion,
      estado: reg.estado || "Pendiente",
      observacion_anny: reg.observacion_anny || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HistorialTransporte");
    XLSX.writeFile(workbook, "HistorialTransporte.xlsx");
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "pendiente-estado";
      case "Completado":
        return "completado-estado";
      case "No Completado":
        return "no-completado-estado";
      default:
        return "";
    }
  };

  const columns = [
    {
      name: "Fecha",
      selector: (row) => (row.fecha ? row.fecha.slice(0, 10) : "-"),
      sortable: true,
      wrap: true,
    },
    {
      name: "Tipo Formulario",
      selector: (row) => row.tipo_formulario,
      wrap: true,
    },
    {
      name: "Conductor",
      selector: (row) => row.conductor,
      wrap: true,
    },
    {
      name: "Placa Vehículo",
      selector: (row) => row.placa_vehiculo,
      wrap: true,
    },
    {
      name: "Documento de identidad",
      selector: (row) => row.cedula,
      wrap: true,
    },
    {
      name: "Cuenta Bancaria",
      selector: (row) => row.cuenta_bancaria,
      wrap: true,
    },
    {
      name: "Fecha Viaje",
      selector: (row) => (row.fecha_viaje ? row.fecha_viaje.slice(0, 10) : "-"),
      sortable: true,
      wrap: true,
    },
    {
      name: "Origen",
      selector: (row) =>
        Array.isArray(row.origen) ? row.origen.join(", ") : row.origen,
      wrap: true,
    },
    {
      name: "Sedes",
      selector: (row) =>
        Array.isArray(row.sedes) ? row.sedes.join(", ") : row.sedes,
      wrap: true,
    },
    {
      name: "Valor Total",
      cell: (row) =>
        new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(row.valor_total),
      wrap: true,
    },
    {
      name: "Observación",
      selector: (row) => row.observacion,
      wrap: true,
    },
    {
      name: "Estado",
      cell: (row) => {
        if (editingId === row.id) {
          return (
            <select
              name="estado"
              value={editValues.estado}
              onChange={handleEditChange}
              style={{ width: "100%", height: "100%" }}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
            </select>
          );
        }
        return (
          <div
            className={`estado-cell ${getEstadoClass(row.estado || "Pendiente")}`}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {row.estado || "Pendiente"}
          </div>
        );
      },
      wrap: true,
    },
    {
      name: "Obs... Anny",
      cell: (row) => {
        if (editingId === row.id) {
          return (
            <textarea
              name="observacion_anny"
              value={editValues.observacion_anny}
              onChange={handleEditChange}
              placeholder="Observación de admin"
              rows={4}
              className="observacionAnny-textarea"
            />
          );
        }
        return row.observacion_anny || "-";
      },
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => {
        if (editingId === row.id) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <button
                className="accion-button guardar"
                onClick={() => handleSaveEdit(row.id)}
              >
                Guardar
              </button>
              <button
                className="accion-button cancelar"
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
              {updateMessage && (
                <p className={`automatizacion-submitted-message ${updateMessage.type}`}>
                  {updateMessage.text}
                </p>
              )}
            </div>
          );
        }
        return (
          <button className="accion-button editar" onClick={() => handleEditClick(row)}>
            Editar
          </button>
        );
      },
      ignoreRowClick: true,
      wrap: true,
    },
  ];

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

  if (loading) {
    return (
      <div className="automatizacion-historial">
        <p>Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="automatizacion-historial">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="automatizacion-historial">
      <h2 className="historialTitle">Historial de Transporte</h2>
      <DataTable
        columns={columns}
        data={registros}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
        keyField="id" // Clave única para mantener el orden
      />
      <button onClick={handleExportExcel} className="excel-button">
        Exportar a Excel
      </button>
    </div>
  );
};

export { HistorialTransporte };