import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import './HistorialFormulario.css';

const HistorialFormulario = () => {
  const [rows, setRows] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    fetch('https://backend-formulario-ruby.vercel.app/api/form/list')
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');
    XLSX.writeFile(workbook, 'historial_registros.xlsx');
  };

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
      ),
    },
  ];

  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    reset(record);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const onSubmit = async (data) => {
    const changesMade = Object.keys(data).some(
      key => String(data[key] || "") !== String(selectedRecord[key] || "")
    );

    if (!changesMade) {
      alert("Estás a punto de ingresar al modo edición");
      return;
    }

    try {
      const response = await fetch(`https://backend-formulario-ruby.vercel.app/api/form/update/${selectedRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento).toISOString().slice(0, 10) : "",
          fechaIngresoEmpresa: data.fechaIngresoEmpresa ? new Date(data.fechaIngresoEmpresa).toISOString().slice(0, 10) : "",
        }),
      });
      const result = await response.json();

      if (response.ok) {
        if (result.message === "Datos actualizados correctamente") {
          alert("Registro actualizado correctamente");
          setRows(rows.map(r => (r.id === selectedRecord.id ? result.data[0] : r)));
          handleCloseDialog();
        } else {
          alert("Respuesta inesperada del servidor.");
        }
      } else {
        alert("Error al actualizar: " + result.error);
      }
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      alert("Error al actualizar el registro");
    }
  };

  const renderRecordDetails = (record) => (
    <div className="record-details">
      <Typography variant="h6">Datos Personales</Typography>
      <p><strong>Nombres y Apellidos:</strong> <span>{record.nombresApellidos}</span></p>
      <p><strong>Documento:</strong> <span>{record.numeroDocumento}</span></p>
      <p><strong>Celular:</strong> <span>{record.celular}</span></p>
      <p><strong>Correo:</strong> <span>{record.correo}</span></p>
      <p><strong>Fecha de Nacimiento:</strong> <span>{record.fechaNacimiento}</span></p>
      <p><strong>Ciudad de Nacimiento:</strong> <span>{record.ciudadNacimiento}</span></p>
      <Typography variant="h6">Vivienda y Ubicación</Typography>
      <p><strong>Tipo de Vivienda:</strong> <span>{record.tipoVivienda}</span></p>
      <p><strong>Características de la Vivienda:</strong> <span>{record.caracteristicasVivienda}</span></p>
      <p><strong>Estrato:</strong> <span>{record.estrato}</span></p>
      <p><strong>Zona:</strong> <span>{record.zona}</span></p>
      <p><strong>País de Origen:</strong> <span>{record.paisOrigen}</span></p>
      <p><strong>Municipio de Residencia:</strong> <span>{record.municipioResidencia}</span></p>
      <p><strong>Barrio:</strong> <span>{record.barrio}</span></p>
      <p><strong>Dirección:</strong> <span>{record.direccion}</span></p>
      <Typography variant="h6">Datos Demográficos</Typography>
      <p><strong>Género:</strong> <span>{record.genero}</span></p>
      <p><strong>Grupo Étnico:</strong> <span>{record.grupoEtnico}</span></p>
      <p><strong>Población en Movilidad:</strong> <span>{record.poblacionMovilidad}</span></p>
      <p><strong>Grupo Religioso:</strong> <span>{record.grupoReligioso}</span></p>
      <Typography variant="h6">Afiliación y Escolaridad</Typography>
      <p><strong>EPS:</strong> <span>{record.eps}</span></p>
      <p><strong>Fondo de Pensión:</strong> <span>{record.fondoPension}</span></p>
      <p><strong>Grado de Escolaridad:</strong> <span>{record.gradoEscolaridad}</span></p>
      <p><strong>Estado Civil:</strong> <span>{record.estadoCivil}</span></p>
      <p><strong>Tipo de Contrato:</strong> <span>{record.tipoContrato}</span></p>
      <p><strong>Fecha de Ingreso a la Empresa:</strong> <span>{record.fechaIngresoEmpresa}</span></p>
      <Typography variant="h6">Información Laboral</Typography>
      <p><strong>Sede:</strong> <span>{record.sede}</span></p>
      <p><strong>Cargo Operativo:</strong> <span>{record.cargoOperativo}</span></p>
      <p><strong>Departamento Operaciones:</strong> <span>{record.departamentoOperaciones}</span></p>
      <p><strong>Departamento Financiero:</strong> <span>{record.departamentoFinanciero}</span></p>
      <p><strong>Departamento Comercial:</strong> <span>{record.departamentoComercial}</span></p>
      <p><strong>Departamento Gestión Humana:</strong> <span>{record.departamentoGestionHumana}</span></p>
      <p><strong>Solo Gerencia:</strong> <span>{record.soloGerencia}</span></p>
      <Typography variant="h6">Datos Adicionales</Typography>
      <p><strong>Antigüedad:</strong> <span>{record.antiguedad}</span></p>
      <p><strong>Grupo Sanguíneo:</strong> <span>{record.grupoSanguineo}</span></p>
      <p><strong>Personas Dependientes:</strong> <span>{record.dependientesEconomicos}</span></p>
      <p><strong>Embarazo:</strong> <span>{record.embarazo}</span></p>
      <p><strong>Sufre Enfermedad:</strong> <span>{record.sufreEnfermedad}</span></p>
      <p><strong>Descripción de Enfermedad:</strong> <span>{record.descripcionEnfermedad}</span></p>
      <Typography variant="h6">Actualización de Datos - Hijos</Typography>
      <p><strong>¿Tiene Hijos?:</strong> <span>{record.tieneHijos}</span></p>
      <p><strong>Cantidad de Hijos:</strong> <span>{record.cuantosHijos}</span></p>
      <p><strong>Nombres de Hijos:</strong> <span>{record.nombresHijos}</span></p>
      <p><strong>Edades de Hijos:</strong> <span>{record.edadesHijos}</span></p>
      <p><strong>Grado Escolar de Hijos:</strong> <span>{record.gradoEscolaridadHijos}</span></p>
      <Typography variant="h6">Contacto en Caso de Emergencia</Typography>
      <p><strong>Nombres y Apellidos:</strong> <span>{record.contactoNombres}</span></p>
      <p><strong>Celular:</strong> <span>{record.contactoCelular}</span></p>
      <p><strong>Parentesco:</strong> <span>{record.parentescoContacto}</span></p>
      <Typography variant="h6">Fecha del Diligenciamiento</Typography>
      <p><strong>Fecha:</strong> <span>{record.fechaDiligenciamiento}</span></p>
    </div>
  );

  return (
    <div className="historial-container">
      <h2>Historial de Registros</h2>
      <Button
        className="export-button"
        variant="contained"
        onClick={exportToExcel}
      >
        Exportar a Excel
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        hideFooterSelectedRowCount // Oculta el mensaje de selección
      />
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Editar Registro" : `Detalles del Registro #${selectedRecord ? selectedRecord.id : ""}`}
        </DialogTitle>
        <DialogContent dividers>
          {editMode ? (
            <form id="edit-form" className="edit-form" onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="subtitle1">Datos Personales</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Nombres y Apellidos"
                {...register("nombresApellidos", { required: "Obligatorio", maxLength: { value: 50, message: "Máximo 50 caracteres" } })}
                error={!!errors.nombresApellidos}
                helperText={errors.nombresApellidos?.message}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Documento"
                {...register("numeroDocumento", { required: "Obligatorio" })}
                error={!!errors.numeroDocumento}
                helperText={errors.numeroDocumento?.message}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Celular"
                {...register("celular", { required: "Obligatorio" })}
                error={!!errors.celular}
                helperText={errors.celular?.message}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Correo"
                {...register("correo", { required: "Obligatorio" })}
                error={!!errors.correo}
                helperText={errors.correo?.message}
              />
              <Controller
                name="fechaNacimiento"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Fecha de Nacimiento"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={field.onChange}
                    dateFormat="yyyy-MM-dd"
                    customInput={<TextField fullWidth margin="normal" label="Fecha de Nacimiento" />}
                  />
                )}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Ciudad de Nacimiento"
                {...register("ciudadNacimiento")}
              />

              <Typography variant="subtitle1">Vivienda y Ubicación</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Tipo de Vivienda"
                {...register("tipoVivienda")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Características de la Vivienda"
                {...register("caracteristicasVivienda")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Estrato"
                {...register("estrato")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Zona"
                {...register("zona")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="País de Origen"
                {...register("paisOrigen")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Municipio de Residencia"
                {...register("municipioResidencia")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Barrio"
                {...register("barrio")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Dirección"
                {...register("direccion")}
              />

              <Typography variant="subtitle1">Datos Demográficos</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Género"
                {...register("genero")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Grupo Étnico"
                {...register("grupoEtnico")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Población en Movilidad"
                {...register("poblacionMovilidad")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Grupo Religioso"
                {...register("grupoReligioso")}
              />

              <Typography variant="subtitle1">Afiliación y Escolaridad</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="EPS"
                {...register("eps")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Fondo de Pensión"
                {...register("fondoPension")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Grado de Escolaridad"
                {...register("gradoEscolaridad")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Estado Civil"
                {...register("estadoCivil")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Tipo de Contrato"
                {...register("tipoContrato")}
              />
              <Controller
                name="fechaIngresoEmpresa"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Fecha de Ingreso a la Empresa"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={field.onChange}
                    dateFormat="yyyy-MM-dd"
                    customInput={<TextField fullWidth margin="normal" label="Fecha de Ingreso a la Empresa" />}
                  />
                )}
              />

              <Typography variant="subtitle1">Información Laboral</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Sede"
                {...register("sede")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Cargo Operativo"
                {...register("cargoOperativo")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Departamento Operaciones"
                {...register("departamentoOperaciones")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Departamento Financiero"
                {...register("departamentoFinanciero")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Departamento Comercial"
                {...register("departamentoComercial")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Departamento Gestión Humana"
                {...register("departamentoGestionHumana")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Solo Gerencia"
                {...register("soloGerencia")}
              />

              <Typography variant="subtitle1">Datos Adicionales</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Antigüedad"
                {...register("antiguedad")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Grupo Sanguíneo"
                {...register("grupoSanguineo")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Personas Dependientes"
                {...register("dependientesEconomicos")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Embarazo"
                {...register("embarazo")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Sufre Enfermedad"
                {...register("sufreEnfermedad")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Descripción de Enfermedad"
                {...register("descripcionEnfermedad")}
              />

              <Typography variant="subtitle1">Actualización de Datos - Hijos</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="¿Tiene Hijos?"
                {...register("tieneHijos")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Cantidad de Hijos"
                {...register("cuantosHijos")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Nombres de Hijos"
                {...register("nombresHijos")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Edades de Hijos"
                {...register("edadesHijos")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Grado Escolar de Hijos"
                {...register("gradoEscolaridadHijos")}
              />

              <Typography variant="subtitle1">Contacto en Caso de Emergencia</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Nombres y Apellidos"
                {...register("contactoNombres")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Celular"
                {...register("contactoCelular")}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Parentesco"
                {...register("parentescoContacto")}
              />

              <Typography variant="subtitle1">Fecha del Diligenciamiento</Typography>
              <Controller
                name="fechaDiligenciamiento"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Fecha del Diligenciamiento"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={field.onChange}
                    dateFormat="yyyy-MM-dd"
                    customInput={<TextField fullWidth margin="normal" label="Fecha del Diligenciamiento" />}
                  />
                )}
              />
            </form>
          ) : (
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

export { HistorialFormulario };