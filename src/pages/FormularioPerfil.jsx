import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FormularioPerfil.css";
const FormularioPerfil = () => {
  const [formData, setFormData] = useState({
    // PERFIL SOCIODEMOGRÁFICO
    nombresApellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    celular: "",
    correo: "",
    // Usamos Date para almacenar las fechas como objeto
    fechaNacimiento: null,
    ciudadNacimiento: "",
    edad: "",
    peso: "",
    estatura: "",
    tipoVivienda: "",
    caracteristicasVivienda: "",
    estrato: "",
    zona: "",
    paisOrigen: "",
    municipioResidencia: "",
    barrio: "",
    direccion: "",
    genero: "",
    grupoEtnico: "",
    poblacionMovilidad: "",
    grupoReligioso: "",
    eps: "",
    fondoPension: "",
    gradoEscolaridad: "",
    estadoCivil: "",
    tipoContrato: "",
    fechaIngresoEmpresa: null,
    sede: "",
    cargoOperativo: "",
    departamentoOperaciones: "",
    departamentoFinanciero: "",
    departamentoComercial: "",
    departamentoGestionHumana: "",
    soloGerencia: "",
    antiguedad: "",
    grupoSanguineo: "",
    dependientesEconomicos: "",
    embarazo: "",
    sufreEnfermedad: "",
    descripcionEnfermedad: "",
    // ACTUALIZACIÓN DE DATOS - HIJOS
    tieneHijos: "",
    cuantosHijos: "",
    nombresHijos: "",
    edadesHijos: "",
    gradoEscolaridadHijos: "",
    // CONTACTO EN CASO DE EMERGENCIA
    contactoNombres: "",
    contactoCelular: "",
    parentescoContacto: "",
    // FECHA DEL DILIGENCIAMIENTO (automática)
    fechaDiligenciamiento: new Date().toISOString().slice(0, 10)
  });

  // Manejador genérico para actualizar cualquier campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Formateamos las fechas a yyyy-MM-dd antes de enviar
    const formattedData = {
      ...formData,
      fechaNacimiento: formData.fechaNacimiento
        ? formData.fechaNacimiento.toISOString().slice(0, 10)
        : "",
      fechaIngresoEmpresa: formData.fechaIngresoEmpresa
        ? formData.fechaIngresoEmpresa.toISOString().slice(0, 10)
        : "",
    };
    console.log("Datos del formulario:", formattedData);
    alert("Formulario enviado. Revisa la consola para ver los datos.");
  };

  return (
    <form onSubmit={handleSubmit} className="socio-form">
       <div className="logo-container">
          <a href="/">
            <img src="logoMK.png" alt="Logo Merkahorro" />
          </a>
        </div>
      <h1 className="socio-title">PERFIL SOCIODEMOGRÁFICO</h1>
      <p className="socio-description">
        Es una descripción de las características sociales y demográficas de los empleados del supermercado Merkahorro S.A.S
      </p>
      <hr className="socio-hr" />

      {/* 1. NOMBRES Y APELLIDOS COMPLETOS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>1. NOMBRES Y APELLIDOS COMPLETOS</strong>
        </label>
        <input
          type="text"
          name="nombresApellidos"
          value={formData.nombresApellidos}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 2. TIPO DE DOCUMENTO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>2. TIPO DE DOCUMENTO</strong>
        </label>
        <select
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={handleChange}
          required
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="CÉDULA DE CIUDADANÍA">CÉDULA DE CIUDADANÍA</option>
          <option value="PPT">PPT</option>
          <option value="CÉDULA DE EXTRANJERÍA">CÉDULA DE EXTRANJERÍA</option>
          <option value="TARJETA DE IDENTIDAD">TARJETA DE IDENTIDAD</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 3. NÚMERO DE DOCUMENTO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>3. NÚMERO DE DOCUMENTO</strong>
        </label>
        <input
          type="text"
          name="numeroDocumento"
          value={formData.numeroDocumento}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 4. NÚMERO DE CELULAR */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>4. NÚMERO DE CELULAR</strong>
        </label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 5. CORREO ELECTRÓNICO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>5. CORREO ELECTRÓNICO</strong>
        </label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 6. FECHA DE NACIMIENTO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>6. FECHA DE NACIMIENTO (d/M/yyyy)</strong>
        </label>
        <DatePicker
          selected={formData.fechaNacimiento}
          onChange={(date) => handleDateChange("fechaNacimiento", date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Selecciona una fecha"
          className="socio-input"
          required
        />
      </div>

      {/* 7. CIUDAD DE NACIMIENTO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>7. CIUDAD DE NACIMIENTO</strong>
        </label>
        <input
          type="text"
          name="ciudadNacimiento"
          value={formData.ciudadNacimiento}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 8. EDAD */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>8. EDAD</strong>
        </label>
        <input
          type="number"
          name="edad"
          value={formData.edad}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 9. PESO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>9. PESO</strong>
        </label>
        <input
          type="number"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          className="socio-input"
        />
      </div>

      {/* 10. ESTATURA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>10. ESTATURA</strong>
        </label>
        <input
          type="number"
          name="estatura"
          value={formData.estatura}
          onChange={handleChange}
          className="socio-input"
        />
      </div>

      {/* 11. TIPO DE VIVIENDA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>11. TIPO DE VIVIENDA</strong>
        </label>
        <select
          name="tipoVivienda"
          value={formData.tipoVivienda}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="PROPIA">PROPIA</option>
          <option value="ARRENDADA">ARRENDADA</option>
          <option value="FAMILIAR">FAMILIAR</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 12. CARACTERÍSTICAS DE LA VIVIENDA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>12. CARACTERÍSTICAS DE LA VIVIENDA</strong>
        </label>
        <select
          name="caracteristicasVivienda"
          value={formData.caracteristicasVivienda}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="FINCA">FINCA</option>
          <option value="CASA LOTE">CASA LOTE</option>
          <option value="CASA CONJUNTO CERRADO">CASA CONJUNTO CERRADO</option>
          <option value="CASA BARRIO">CASA BARRIO</option>
          <option value="APARTAMENTO">APARTAMENTO</option>
          <option value="HABITACIÓN">HABITACIÓN</option>
        </select>
      </div>

      {/* 13. ESTRATO SOCIOECONÓMICO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>13. ESTRATO SOCIOECONÓMICO</strong>
        </label>
        <select
          name="estrato"
          value={formData.estrato}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>

      {/* 14. ZONA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>14. ZONA</strong>
        </label>
        <select
          name="zona"
          value={formData.zona}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="URBANA">URBANA</option>
          <option value="RURAL">RURAL</option>
        </select>
      </div>

      {/* 15. PAÍS DE ORIGEN */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>15. PAÍS DE ORIGEN</strong>
        </label>
        <input
          type="text"
          name="paisOrigen"
          value={formData.paisOrigen}
          onChange={handleChange}
          className="socio-input"
        />
      </div>

      {/* 16. MUNICIPIO DE RESIDENCIA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>16. MUNICIPIO DE RESIDENCIA</strong>
        </label>
        <input
          type="text"
          name="municipioResidencia"
          value={formData.municipioResidencia}
          onChange={handleChange}
          className="socio-input"
        />
      </div>

      {/* 17. BARRIO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>17. BARRIO</strong>
        </label>
        <input
          type="text"
          name="barrio"
          value={formData.barrio}
          onChange={handleChange}
          className="socio-input"
        />
      </div>

      {/* 18. DIRECCIÓN DE RESIDENCIA COMPLETA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>18. DIRECCIÓN DE RESIDENCIA COMPLETA</strong>
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="socio-input"
        />
      </div>

      {/* 19. GÉNERO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>19. GÉNERO</strong>
        </label>
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="MASCULINO">MASCULINO</option>
          <option value="FEMENINO">FEMENINO</option>
          <option value="NO BINARIO">NO BINARIO</option>
          <option value="LGTBIQ+">LGTBIQ+</option>
          <option value="PREFIERO NO DECIRLO">PREFIERO NO DECIRLO</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 20. GRUPO ÉTNICO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>20. GRUPO ÉTNICO</strong>
        </label>
        <select
          name="grupoEtnico"
          value={formData.grupoEtnico}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="INDÍGENA">INDÍGENA</option>
          <option value="GITANO O RROM">GITANO O RROM</option>
          <option value="RAIZAL">RAIZAL</option>
          <option value="AFRO">NEGRO, MULATO, AFRODESCENDIENTE, AFROCOLOMBIANO</option>
          <option value="NO ME IDENTIFICO">NO ME IDENTIFICO</option>
        </select>
      </div>

      {/* 21. POBLACIÓN EN MOVILIDAD */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>21. POBLACIÓN EN MOVILIDAD</strong>
        </label>
        <select
          name="poblacionMovilidad"
          value={formData.poblacionMovilidad}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="POBLACIÓN MIGRANTE">POBLACIÓN MIGRANTE</option>
          <option value="DESPLAZADO">DESPLAZADO</option>
          <option value="APÁTRIDA">APÁTRIDA</option>
          <option value="REASENTADO">REASENTADO</option>
          <option value="RETORNADO">RETORNADO</option>
          <option value="EXILIADO">EXILIADO</option>
          <option value="TRÁNSITO MIGRATORIO">TRÁNSITO MIGRATORIO</option>
          <option value="NINGUNA">NINGUNA</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 22. GRUPO RELIGIOSO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>22. GRUPO RELIGIOSO</strong>
        </label>
        <select
          name="grupoReligioso"
          value={formData.grupoReligioso}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="CATOLICISMO">CATOLICISMO</option>
          <option value="PROTESTANTISMO">PROTESTANTISMO</option>
          <option value="RELIGIONES AFRODESCENDIENTES">
            RELIGIONES AFRODESCENDIENTES
          </option>
          <option value="RELIGIONES INDÍGENAS">RELIGIONES INDÍGENAS</option>
          <option value="ISLAM">ISLAM</option>
          <option value="JUDAÍSMO">JUDAÍSMO</option>
          <option value="HINDUISMO, BUDISMO Ó BAHISMO">
            HINDUISMO, BUDISMO Ó BAHISMO
          </option>
          <option value="NINGUNO">NINGUNO</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 23. EPS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>23. EPS A LA QUE ESTÁ AFILIADO</strong>
        </label>
        <select
          name="eps"
          value={formData.eps}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="SURA">SURA</option>
          <option value="SALUD TOTAL">SALUD TOTAL</option>
          <option value="SANITAS">SANITAS</option>
          <option value="NUEVA EPS">NUEVA EPS</option>
          <option value="SAVIA SALUD">SAVIA SALUD</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 24. FONDO DE PENSIÓN */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>24. FONDO DE PENSIÓN A LA QUE ESTÁ AFILIADO</strong>
        </label>
        <select
          name="fondoPension"
          value={formData.fondoPension}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="COLPENSIONES">COLPENSIONES</option>
          <option value="PROTECCIÓN">PROTECCIÓN</option>
          <option value="COLFONDOS">COLFONDOS</option>
          <option value="PORVENIR">PORVENIR</option>
          <option value="NO APLICA (APRENDIZ)">
            NO APLICA (APRENDIZ)
          </option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 25. GRADO DE ESCOLARIDAD */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>25. GRADO DE ESCOLARIDAD</strong>
        </label>
        <select
          name="gradoEscolaridad"
          value={formData.gradoEscolaridad}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="PRIMARIA INCOMPLETA">PRIMARIA INCOMPLETA</option>
          <option value="PRIMARIA COMPLETA">PRIMARIA COMPLETA</option>
          <option value="BACHILLER INCOMPLETO">BACHILLER INCOMPLETO</option>
          <option value="BACHILLER COMPLETO">BACHILLER COMPLETO</option>
          <option value="TECNICO/TECNOLOGO INCOMPLETO">
            TECNICO/TECNOLOGO INCOMPLETO
          </option>
          <option value="TECNICO/TECNOLOGO COMPLETO">
            TECNICO/TECNOLOGO COMPLETO
          </option>
          <option value="PROFESIONAL INCOMPLETO">
            PROFESIONAL INCOMPLETO
          </option>
          <option value="PROFESIONAL COMPLETO">PROFESIONAL COMPLETO</option>
          <option value="POSTGRADO">POSTGRADO</option>
          <option value="NINGUNO">NINGUNO</option>
        </select>
      </div>

      {/* 26. ESTADO CIVIL */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>26. ESTADO CIVIL</strong>
        </label>
        <select
          name="estadoCivil"
          value={formData.estadoCivil}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="SOLTERO/RA">SOLTERO/RA</option>
          <option value="CASADO/DA">CASADO/DA</option>
          <option value="UNIÓN LIBRE">UNIÓN LIBRE</option>
          <option value="DIVORCIADO/DA">DIVORCIADO/DA</option>
          <option value="VIUDO/DA">VIUDO/DA</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 27. TIPO DE CONTRATO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>27. TIPO DE CONTRATO</strong>
        </label>
        <select
          name="tipoContrato"
          value={formData.tipoContrato}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="TERMINO INDEFINIDO">TERMINO INDEFINIDO</option>
          <option value="TERMINO FIJO">TERMINO FIJO</option>
        </select>
      </div>

      {/* 28. FECHA DE INGRESO A LA EMPRESA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>28. FECHA DE INGRESO A LA EMPRESA (d/M/yyyy)</strong>
        </label>
        <DatePicker
          selected={formData.fechaIngresoEmpresa}
          onChange={(date) => handleDateChange("fechaIngresoEmpresa", date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Selecciona una fecha"
          className="socio-input"
        />
      </div>

      {/* 29. SEDE */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>29. SEDE</strong>
        </label>
        <select
          name="sede"
          value={formData.sede}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="BARBOSA">BARBOSA</option>
          <option value="GIRARDOTA PARQUE">GIRARDOTA PARQUE</option>
          <option value="GIRARDOTA LLANO">GIRARDOTA LLANO</option>
          <option value="COPACABANA SAN JUAN">COPACABANA SAN JUAN</option>
          <option value="COPACABANA VEGAS">COPACABANA VEGAS</option>
          <option value="COPACABANA PLAZA">COPACABANA PLAZA</option>
          <option value="VILLA HERMOSA">VILLA HERMOSA</option>
          <option value="CEDI FRUVER MAYORISTA">CEDI FRUVER MAYORISTA</option>
        </select>
      </div>

      {/* 30. CARGO OPERATIVO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>30. CARGO OPERATIVO (SOLO COLABORADORES DEL PUNTO)</strong>
        </label>
        <select
          name="cargoOperativo"
          value={formData.cargoOperativo}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="CAJERO">CAJERO</option>
          <option value="SURTIDOR">SURTIDOR</option>
          <option value="EMPACADOR">EMPACADOR</option>
          <option value="MONITOR DE SERVICIOS">MONITOR DE SERVICIOS</option>
          <option value="SERVICIOS GENERALES">SERVICIOS GENERALES</option>
          <option value="DOMICILIARIO">DOMICILIARIO</option>
          <option value="CONDUCTOR">CONDUCTOR</option>
          <option value="AUXILIAR BODEGA">AUXILIAR BODEGA</option>
          <option value="AUXILIAR FRUVER">AUXILIAR FRUVER</option>
          <option value="AUXILIAR CARNICO">AUXILIAR CARNICO</option>
          <option value="MANTENIMIENTO">MANTENIMIENTO</option>
          <option value="LÍDER DEL PUNTO">LÍDER DEL PUNTO</option>
        </select>
      </div>

      {/* 31. DEPARTAMENTO OPERACIONES (ADM) */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>31. DEPARTAMENTO OPERACIONES AREA ADMINISTRATIVA</strong>
        </label>
        <select
          name="departamentoOperaciones"
          value={formData.departamentoOperaciones}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="ANALISTA OPERACIONES">ANALISTA OPERACIONES</option>
          <option value="DIRECTOR OPERACIONES">DIRECTOR OPERACIONES</option>
          <option value="AUXILIAR INVENTARIO">AUXILIAR INVENTARIO</option>
          <option value="AUXILIAR RECIBO">AUXILIAR RECIBO</option>
          <option value="AUXILIAR SISTEMAS">AUXILIAR SISTEMAS</option>
          <option value="ALMACEN Y SUMINISTROS">ALMACEN Y SUMINISTROS</option>
          <option value="LÍDER SISTEMAS">LÍDER SISTEMAS</option>
          <option value="COORDINADOR LOGÍSTICO">COORDINADOR LOGÍSTICO</option>
          <option value="PRACTICANTE">PRACTICANTE</option>
        </select>
      </div>

      {/* 32. DEPARTAMENTO FINANCIERO (ADM) */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>32. DEPARTAMENTO FINANCIERO AREA ADMINISTRATIVA</strong>
        </label>
        <select
          name="departamentoFinanciero"
          value={formData.departamentoFinanciero}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="DIRECTORA ADMINISTRATIVA Y FINANCIERA">
            DIRECTORA ADMINISTRATIVA Y FINANCIERA
          </option>
          <option value="AUXILIAR TESORERIA">AUXILIAR TESORERIA</option>
          <option value="AUXILIAR CARTERA">AUXILIAR CARTERA</option>
          <option value="AUXILIAR NÓMINA">AUXILIAR NÓMINA</option>
          <option value="ANALISTA CONTABLE">ANALISTA CONTABLE</option>
          <option value="AUXILIAR CONTABLE">AUXILIAR CONTABLE</option>
          <option value="AUXILIAR CAUSACIONES">AUXILIAR CAUSACIONES</option>
          <option value="LÍDER CONTABILIDAD">LÍDER CONTABILIDAD</option>
        </select>
      </div>

      {/* 33. DEPARTAMENTO COMERCIAL (ADM) */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>33. DEPARTAMENTO COMERCIAL (ADM)</strong>
        </label>
        <select
          name="departamentoComercial"
          value={formData.departamentoComercial}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="ASISTENTE COMERCIAL">ASISTENTE COMERCIAL</option>
          <option value="AUXILIAR COMERCIAL">AUXILIAR COMERCIAL</option>
          <option value="LÍDER COMPRAS">LÍDER COMPRAS</option>
          <option value="AUXILIAR COMPRAS">AUXILIAR COMPRAS</option>
        </select>
      </div>

      {/* 34. DEPARTAMENTO GESTIÓN HUMANA (ADM) */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>34. DEPARTAMENTO GESTIÓN HUMANA (ADM)</strong>
        </label>
        <select
          name="departamentoGestionHumana"
          value={formData.departamentoGestionHumana}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="DIRECTOR GESTIÓN HUMANA">DIRECTOR GESTIÓN HUMANA</option>
          <option value="ASISTENTE GESTIÓN HUMANA">ASISTENTE GESTIÓN HUMANA</option>
          <option value="LÍDER DE DESARROLLO Y TALENTO HUMANO">
            LÍDER DE DESARROLLO Y TALENTO HUMANO
          </option>
          <option value="AUXILIAR GESTIÓN HUMANA">AUXILIAR GESTIÓN HUMANA</option>
          <option value="AUXILIAR SISTEMAS INTEGRADOS">
            AUXILIAR SISTEMAS INTEGRADOS
          </option>
          <option value="PRACTICANTE SST">PRACTICANTE SST</option>
          <option value="PRACTICANTE">PRACTICANTE</option>
        </select>
      </div>

      {/* 35. SOLO GERENCIA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>35. ESTE ESPACIO SOLO ES PARA DON DIEGO Y DON WILLIAM</strong>
        </label>
        <select
          name="soloGerencia"
          value={formData.soloGerencia}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="GERENTE">GERENTE</option>
        </select>
      </div>

      {/* 36. ANTIGÜEDAD EN LA EMPRESA */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>36. ANTIGÜEDAD EN LA EMPRESA</strong>
        </label>
        <select
          name="antiguedad"
          value={formData.antiguedad}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="MENOS DE 6 MESES">MENOS DE 6 MESES</option>
          <option value="6 MESES a 1 AÑO">6 MESES a 1 AÑO</option>
          <option value="1 a 3 AÑOS">1 a 3 AÑOS</option>
          <option value="4 a 6 AÑOS">4 a 6 AÑOS</option>
          <option value="7 a 8 AÑOS">7 a 8 AÑOS</option>
        </select>
      </div>

      {/* 37. GRUPO SANGUÍNEO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>37. GRUPO SANGUÍNEO (TIPO DE SANGRE)</strong>
        </label>
        <select
          name="grupoSanguineo"
          value={formData.grupoSanguineo}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      {/* 38. NÚMERO DE PERSONAS QUE DEPENDEN ECONÓMICAMENTE */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>38. NÚMERO DE PERSONAS QUE DEPENDEN ECONÓMICAMENTE</strong>
        </label>
        <select
          name="dependientesEconomicos"
          value={formData.dependientesEconomicos}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 39. EMBARAZO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>39. ¿ACTUALMENTE TÚ O TU PAREJA ESTÁN EN ESTADO DE EMBARAZO?</strong>
        </label>
        <select
          name="embarazo"
          value={formData.embarazo}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="SI">SI</option>
          <option value="NO">NO</option>
        </select>
      </div>

      {/* 40. SUFRES DE ALGUNA ENFERMEDAD */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>40. ¿SUFRES DE ALGUNA ENFERMEDAD?</strong>
        </label>
        <select
          name="sufreEnfermedad"
          value={formData.sufreEnfermedad}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="SI">SI</option>
          <option value="NO">NO</option>
        </select>
      </div>

      {/* 41. DESCRIPCIÓN DE ENFERMEDAD */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>41. SI SU RESPUESTA ANTERIOR FUE SI, DESCRIBA CUÁL</strong>
        </label>
        <input
          type="text"
          name="descripcionEnfermedad"
          value={formData.descripcionEnfermedad}
          onChange={handleChange}
          disabled={formData.sufreEnfermedad !== "SI"}
          className="socio-input"
        />
      </div>

      <hr className="socio-hr" />
      <h2 className="socio-subtitle">ACTUALIZACIÓN DE DATOS - HIJOS</h2>

      {/* 42. TIENE HIJOS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>42. TIENE HIJOS</strong>
        </label>
        <select
          name="tieneHijos"
          value={formData.tieneHijos}
          onChange={handleChange}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="SI">SI</option>
          <option value="NO">NO</option>
        </select>
      </div>

      {/* 43. CUÁNTOS HIJOS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>43. SI SU RESPUESTA FUE SI, ¿CUÁNTOS HIJOS TIENES?</strong>
        </label>
        <select
          name="cuantosHijos"
          value={formData.cuantosHijos}
          onChange={handleChange}
          disabled={formData.tieneHijos !== "SI"}
          className="socio-select"
        >
          <option value="">Seleccione...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="OTRAS">Otras</option>
        </select>
      </div>

      {/* 44. NOMBRES DE LOS HIJOS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>44. NOMBRES COMPLETOS DE SUS HIJOS (separados por ;)</strong>
        </label>
        <input
          type="text"
          name="nombresHijos"
          value={formData.nombresHijos}
          onChange={handleChange}
          disabled={formData.tieneHijos !== "SI"}
          className="socio-input"
        />
      </div>

      {/* 45. EDAD DE LOS HIJOS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>45. EDAD DE SUS HIJOS (separadas por ;)</strong>
        </label>
        <input
          type="text"
          name="edadesHijos"
          value={formData.edadesHijos}
          onChange={handleChange}
          disabled={formData.tieneHijos !== "SI"}
          className="socio-input"
        />
      </div>

      {/* 46. GRADO DE ESCOLARIDAD DE LOS HIJOS */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>46. GRADO DE ESCOLARIDAD DE SUS HIJOS</strong>
        </label>
        <input
          type="text"
          name="gradoEscolaridadHijos"
          value={formData.gradoEscolaridadHijos}
          onChange={handleChange}
          disabled={formData.tieneHijos !== "SI"}
          className="socio-input"
        />
      </div>

      <hr className="socio-hr" />
      <h2 className="socio-subtitle">CONTACTO EN CASO DE EMERGENCIA</h2>

      {/* 47. NOMBRES Y APELLIDOS DEL CONTACTO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>47. NOMBRES Y APELLIDOS</strong>
        </label>
        <input
          type="text"
          name="contactoNombres"
          value={formData.contactoNombres}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 48. NÚMERO DE CELULAR DEL CONTACTO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>48. NÚMERO DE CELULAR</strong>
        </label>
        <input
          type="text"
          name="contactoCelular"
          value={formData.contactoCelular}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      {/* 49. PARENTESCO */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>49. PARENTESCO</strong>
        </label>
        <input
          type="text"
          name="parentescoContacto"
          value={formData.parentescoContacto}
          onChange={handleChange}
          required
          className="socio-input"
        />
      </div>

      <hr className="socio-hr" />

      {/* 50. FECHA DEL DILIGENCIAMIENTO (automática y no editable) */}
      <div className="socio-field">
        <label className="socio-label">
          <strong>50. FECHA DEL DILIGENCIAMIENTO (d/M/yyyy)</strong>
        </label>
        <input
          type="date"
          name="fechaDiligenciamiento"
          value={formData.fechaDiligenciamiento}
          onChange={handleChange}
          required
          disabled
          className="socio-input"
        />
      </div>

      <div className="socio-button-container">
        <button type="submit" className="socio-submit-btn">
          Enviar Formulario
        </button>
      </div>
    </form>
  );
};

export {FormularioPerfil};
