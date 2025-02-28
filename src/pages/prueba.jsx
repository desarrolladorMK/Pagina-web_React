
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

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

  // Función para exportar a Excel
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
    reset(record); // Precargar los datos en el formulario
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    setEditMode(false);
  };

  const onSubmit = async (data) => {
    // Compara solo las claves que están en el formulario con los datos originales
    const changesMade = Object.keys(data).some(
      key => String(data[key] || "") !== String(selectedRecord[key] || "")
    );

    if (!changesMade) {
      // Si no se detectan cambios, simplemente cierra el diálogo sin notificar
      handleCloseDialog();
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
        alert("Registro actualizado correctamente");
        // Asumiendo que result.data es un arreglo con el registro actualizado
        setRows(rows.map(r => (r.id === selectedRecord.id ? result.data[0] : r)));
        handleCloseDialog(); // Cierra el diálogo tras la actualización exitosa
      } else {
        alert("Error al actualizar: " + result.error);
      }
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      alert("Error al actualizar el registro");
    }
  };

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
      <Button 
        variant="contained" 
        onClick={exportToExcel} 
        style={{ marginBottom: 10, marginRight: 10 }}
      >
        Exportar a Excel
      </Button>
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
              {/* Datos Personales */}
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
              
              {/* Vivienda y Ubicación */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Vivienda y Ubicación</Typography>
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
        
              {/* Datos Demográficos */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Datos Demográficos</Typography>
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
        
              {/* Afiliación y Escolaridad */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Afiliación y Escolaridad</Typography>
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
        
              {/* Información Laboral */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Información Laboral</Typography>
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
        
              {/* Datos Adicionales */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Datos Adicionales</Typography>
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
        
              {/* Actualización de Datos - Hijos */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Actualización de Datos - Hijos</Typography>
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
        
              {/* Contacto en Caso de Emergencia */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Contacto en Caso de Emergencia</Typography>
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
        
              {/* Fecha del Diligenciamiento */}
              <Typography variant="subtitle1" style={{ marginTop: 20 }}>Fecha del Diligenciamiento</Typography>
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
