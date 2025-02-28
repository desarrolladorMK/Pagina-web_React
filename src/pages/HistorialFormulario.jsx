import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HistorialFormulario = () => {
  const [rows, setRows] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Formulario para editar
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  // Cargar registros del backend
  useEffect(() => {
    fetch('https://backend-formulario-ruby.vercel.app/api/form/list')
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Columnas del DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombresApellidos', headerName: 'Nombre Completo', width: 200 },
    { field: 'numeroDocumento', headerName: 'Documento', width: 150 },
    { field: 'celular', headerName: 'Celular', width: 130 },
    { field: 'correo', headerName: 'Correo', width: 200 },
    { field: 'fechaNacimiento', headerName: 'F. Nacimiento', width: 130 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => handleOpenDialog(params.row)}>
          Ver Detalles
        </Button>
      )
    }
  ];

  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    // Precargamos el formulario de edición con el registro seleccionado
    reset(record);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  // Función para enviar la actualización al backend
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`https://backend-formulario-ruby.vercel.app/api/form/update/${selectedRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        alert("Registro actualizado correctamente");
        // Actualizamos la lista de registros
        setRows(rows.map(r => r.id === selectedRecord.id ? { ...r, ...data } : r));
        setEditMode(false);
      } else {
        alert("Error al actualizar: " + result.error);
      }
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      alert("Error al actualizar el registro");
    }
  };

  // Vista de detalles (solo lectura)
  const renderRecordDetails = (record) => (
    <div>
      <Typography variant="h6">Datos Personales</Typography>
      <p><strong>Nombres y Apellidos:</strong> {record.nombresApellidos}</p>
      <p><strong>Documento:</strong> {record.numeroDocumento}</p>
      <p><strong>Celular:</strong> {record.celular}</p>
      <p><strong>Correo:</strong> {record.correo}</p>
      <p><strong>Fecha de Nacimiento:</strong> {record.fechaNacimiento}</p>
      <p><strong>Ciudad de Nacimiento:</strong> {record.ciudadNacimiento}</p>
      <Typography variant="h6">Vivienda y Ubicación</Typography>
      <p><strong>Tipo de Vivienda:</strong> {record.tipoVivienda}</p>
      <p><strong>Características de la Vivienda:</strong> {record.caracteristicasVivienda}</p>
      <p><strong>Estrato:</strong> {record.estrato}</p>
      <p><strong>Zona:</strong> {record.zona}</p>
      <p><strong>País de Origen:</strong> {record.paisOrigen}</p>
      <p><strong>Municipio de Residencia:</strong> {record.municipioResidencia}</p>
      <p><strong>Barrio:</strong> {record.barrio}</p>
      <p><strong>Dirección:</strong> {record.direccion}</p>
      <Typography variant="h6">Datos Demográficos</Typography>
      <p><strong>Género:</strong> {record.genero}</p>
      <p><strong>Grupo Étnico:</strong> {record.grupoEtnico}</p>
      <p><strong>Población en Movilidad:</strong> {record.poblacionMovilidad}</p>
      <p><strong>Grupo Religioso:</strong> {record.grupoReligioso}</p>
      <Typography variant="h6">Afiliación y Escolaridad</Typography>
      <p><strong>EPS:</strong> {record.eps}</p>
      <p><strong>Fondo de Pensión:</strong> {record.fondoPension}</p>
      <p><strong>Grado de Escolaridad:</strong> {record.gradoEscolaridad}</p>
      <p><strong>Estado Civil:</strong> {record.estadoCivil}</p>
      <p><strong>Tipo de Contrato:</strong> {record.tipoContrato}</p>
      <p><strong>Fecha de Ingreso a la Empresa:</strong> {record.fechaIngresoEmpresa}</p>
      <Typography variant="h6">Información Laboral</Typography>
      <p><strong>Sede:</strong> {record.sede}</p>
      <p><strong>Cargo Operativo:</strong> {record.cargoOperativo}</p>
      <p><strong>Departamento Operaciones:</strong> {record.departamentoOperaciones}</p>
      <p><strong>Departamento Financiero:</strong> {record.departamentoFinanciero}</p>
      <p><strong>Departamento Comercial:</strong> {record.departamentoComercial}</p>
      <p><strong>Departamento Gestión Humana:</strong> {record.departamentoGestionHumana}</p>
      <p><strong>Solo Gerencia:</strong> {record.soloGerencia}</p>
      <Typography variant="h6">Datos Adicionales</Typography>
      <p><strong>Antigüedad:</strong> {record.antiguedad}</p>
      <p><strong>Grupo Sanguíneo:</strong> {record.grupoSanguineo}</p>
      <p><strong>Personas Dependientes:</strong> {record.dependientesEconomicos}</p>
      <p><strong>Embarazo:</strong> {record.embarazo}</p>
      <p><strong>Sufre Enfermedad:</strong> {record.sufreEnfermedad}</p>
      <p><strong>Descripción de Enfermedad:</strong> {record.descripcionEnfermedad}</p>
      <Typography variant="h6">Actualización de Datos - Hijos</Typography>
      <p><strong>¿Tiene Hijos?:</strong> {record.tieneHijos}</p>
      <p><strong>Cantidad de Hijos:</strong> {record.cuantosHijos}</p>
      <p><strong>Nombres de Hijos:</strong> {record.nombresHijos}</p>
      <p><strong>Edades de Hijos:</strong> {record.edadesHijos}</p>
      <p><strong>Grado Escolar de Hijos:</strong> {record.gradoEscolaridadHijos}</p>
      <Typography variant="h6">Contacto en Caso de Emergencia</Typography>
      <p><strong>Nombres y Apellidos:</strong> {record.contactoNombres}</p>
      <p><strong>Celular:</strong> {record.contactoCelular}</p>
      <p><strong>Parentesco:</strong> {record.parentescoContacto}</p>
      <Typography variant="h6">Fecha del Diligenciamiento</Typography>
      <p>{record.fechaDiligenciamiento}</p>
    </div>
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Historial de Registros</h2>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        pageSize={10} 
        rowsPerPageOptions={[10]} 
        disableSelectionOnClick 
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Editar Registro" : `Detalles del Registro #${selectedRecord ? selectedRecord.id : ""}`}
        </DialogTitle>
        <DialogContent dividers>
          {editMode ? (
            <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                margin="normal"
                label="Nombres y Apellidos"
                {...register("nombresApellidos", { required: "Obligatorio", maxLength: { value: 50, message: "Máximo 50 caracteres" }, pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: "Solo letras" } })}
                error={!!errors.nombresApellidos}
                helperText={errors.nombresApellidos?.message}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Documento"
                {...register("numeroDocumento", { required: "Obligatorio", pattern: { value: /^[0-9]+$/, message: "Solo números" } })}
                error={!!errors.numeroDocumento}
                helperText={errors.numeroDocumento?.message}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Celular"
                {...register("celular", { required: "Obligatorio", pattern: { value: /^3\d{9}$/, message: "Celular colombiano válido" } })}
                error={!!errors.celular}
                helperText={errors.celular?.message}
              />
              {/* Agrega aquí los demás campos editables que necesites */}
            </form>
          ) : (
            // Vista en modo solo lectura
            selectedRecord && renderRecordDetails(selectedRecord)
          )}
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)}>Cancelar Edición</Button>
              <Button form="edit-form" type="submit" variant="contained">Guardar</Button>
            </>
          ) : (
            <>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
              <Button onClick={() => setEditMode(true)} variant="contained">Editar</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export {HistorialFormulario};
