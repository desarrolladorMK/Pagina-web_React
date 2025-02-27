import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const HistorialFormulario = () => {
  const [rows, setRows] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Se asume que tienes un endpoint que devuelve un array de registros.
  useEffect(() => {
    fetch('https://backend-formulario-ruby.vercel.app/api/form/list')
      .then((res) => res.json())
      .then((data) => {
        // Asegúrate de que cada registro tenga un campo "id"
        setRows(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Definimos las columnas a mostrar en la vista principal
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
      width: 130,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => handleViewDetails(params.row)}>
          Ver Detalles
        </Button>
      )
    }
  ];

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  // Puedes personalizar el detalle; en este ejemplo se utiliza JSON formateado,
  // pero podrías dividirlo en secciones y agrupar campos.
  const renderRecordDetails = (record) => {
    return (
      <div>
        <h3>Datos Personales</h3>
        <p><strong>Nombres y Apellidos:</strong> {record.nombresApellidos}</p>
        <p><strong>Documento:</strong> {record.numeroDocumento}</p>
        <p><strong>Celular:</strong> {record.celular}</p>
        <p><strong>Correo:</strong> {record.correo}</p>
        <p><strong>Fecha de Nacimiento:</strong> {record.fechaNacimiento}</p>
        <p><strong>Ciudad de Nacimiento:</strong> {record.ciudadNacimiento}</p>

        <h3>Vivienda y Ubicación</h3>
        <p><strong>Tipo de Vivienda:</strong> {record.tipoVivienda}</p>
        <p><strong>Características de la Vivienda:</strong> {record.caracteristicasVivienda}</p>
        <p><strong>Estrato:</strong> {record.estrato}</p>
        <p><strong>Zona:</strong> {record.zona}</p>
        <p><strong>País de Origen:</strong> {record.paisOrigen}</p>
        <p><strong>Municipio de Residencia:</strong> {record.municipioResidencia}</p>
        <p><strong>Barrio:</strong> {record.barrio}</p>
        <p><strong>Dirección:</strong> {record.direccion}</p>

        <h3>Datos Demográficos</h3>
        <p><strong>Género:</strong> {record.genero}</p>
        <p><strong>Grupo Étnico:</strong> {record.grupoEtnico}</p>
        <p><strong>Población en Movilidad:</strong> {record.poblacionMovilidad}</p>
        <p><strong>Grupo Religioso:</strong> {record.grupoReligioso}</p>

        <h3>Afiliación y Escolaridad</h3>
        <p><strong>EPS:</strong> {record.eps}</p>
        <p><strong>Fondo de Pensión:</strong> {record.fondoPension}</p>
        <p><strong>Grado de Escolaridad:</strong> {record.gradoEscolaridad}</p>
        <p><strong>Estado Civil:</strong> {record.estadoCivil}</p>
        <p><strong>Tipo de Contrato:</strong> {record.tipoContrato}</p>
        <p><strong>Fecha de Ingreso a la Empresa:</strong> {record.fechaIngresoEmpresa}</p>

        <h3>Información Laboral</h3>
        <p><strong>Sede:</strong> {record.sede}</p>
        <p><strong>Cargo Operativo:</strong> {record.cargoOperativo}</p>
        <p><strong>Departamento Operaciones:</strong> {record.departamentoOperaciones}</p>
        <p><strong>Departamento Financiero:</strong> {record.departamentoFinanciero}</p>
        <p><strong>Departamento Comercial:</strong> {record.departamentoComercial}</p>
        <p><strong>Departamento Gestión Humana:</strong> {record.departamentoGestionHumana}</p>
        <p><strong>Solo Gerencia:</strong> {record.soloGerencia}</p>

        <h3>Datos Adicionales</h3>
        <p><strong>Antigüedad:</strong> {record.antiguedad}</p>
        <p><strong>Grupo Sanguíneo:</strong> {record.grupoSanguineo}</p>
        <p><strong>Personas Dependientes:</strong> {record.dependientesEconomicos}</p>
        <p><strong>Embarazo:</strong> {record.embarazo}</p>
        <p><strong>Sufre Enfermedad:</strong> {record.sufreEnfermedad}</p>
        <p><strong>Descripción de Enfermedad:</strong> {record.descripcionEnfermedad}</p>

        <h3>Actualización de Datos - Hijos</h3>
        <p><strong>¿Tiene Hijos?:</strong> {record.tieneHijos}</p>
        <p><strong>Cantidad de Hijos:</strong> {record.cuantosHijos}</p>
        <p><strong>Nombres de Hijos:</strong> {record.nombresHijos}</p>
        <p><strong>Edades de Hijos:</strong> {record.edadesHijos}</p>
        <p><strong>Grado Escolar de Hijos:</strong> {record.gradoEscolaridadHijos}</p>

        <h3>Contacto en Caso de Emergencia</h3>
        <p><strong>Nombres y Apellidos:</strong> {record.contactoNombres}</p>
        <p><strong>Celular:</strong> {record.contactoCelular}</p>
        <p><strong>Parentesco:</strong> {record.parentescoContacto}</p>

        <h3>Fecha del Diligenciamiento</h3>
        <p>{record.fechaDiligenciamiento}</p>
      </div>
    );
  };

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
        <DialogTitle>Detalles del Registro #{selectedRecord ? selectedRecord.id : ""}</DialogTitle>
        <DialogContent dividers>
          {selectedRecord ? renderRecordDetails(selectedRecord) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export {HistorialFormulario};
