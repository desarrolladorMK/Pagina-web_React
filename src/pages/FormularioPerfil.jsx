import React, { useState, useRef, useEffect } from "react"; // Añadimos useEffect
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaHome, FaUsers, FaBriefcase, FaHeartbeat, FaChild, FaPhone } from "react-icons/fa";
import "./FormularioPerfil.css";

const letterPattern = {
  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
  message: "Solo se permiten letras y espacios",
};

const FormularioPerfil = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombresApellidos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      celular: "",
      correo: "",
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
      tieneHijos: "",
      cuantosHijos: "",
      nombresHijos: "",
      edadesHijos: "",
      gradoEscolaridadHijos: "",
      contactoNombres: "",
      contactoCelular: "",
      parentescoContacto: "",
      fechaDiligenciamiento: new Date().toISOString().slice(0, 10),
    },
  });

  const [step, setStep] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const totalSteps = 7;
  const sufreEnfermedad = watch("sufreEnfermedad");
  const tieneHijos = watch("tieneHijos");
  const formRef = useRef(null);

  // Crear un contenedor para el portal del DatePicker
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Crear un div para el portal y añadirlo al body
    const div = document.createElement("div");
    div.id = "datepicker-portal";
    document.body.appendChild(div);
    setPortalContainer(div);

    // Limpiar al desmontar el componente
    return () => {
      document.body.removeChild(div);
    };
  }, []);

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) {
      const errorFields = Object.keys(errors).map((field) => ({
        name: field,
        message: errors[field].message || "Campo obligatorio",
      }));
      const firstErrorField = errorFields[0].name;
      const stepWithError = getStepForField(firstErrorField);
      setStep(stepWithError);

      setTimeout(() => {
        const errorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }, 100);

      const errorMessage = "Por favor completa los siguientes campos:\n" + errorFields.map((f) => `- ${f.name}: ${f.message}`).join("\n");
      alert(errorMessage);
      return;
    }

    const formattedData = {
      ...data,
      fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.toISOString().slice(0, 10) : "",
      fechaIngresoEmpresa: data.fechaIngresoEmpresa ? data.fechaIngresoEmpresa.toISOString().slice(0, 10) : "",
    };
    console.log("Datos del formulario:", formattedData);
    try {
      const response = await fetch("https://backend-formulario-ruby.vercel.app/api/form/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("¡Formulario enviado con éxito! Gracias por tu tiempo.");
        reset();
        setStep(1);
      } else {
        alert("Error al enviar formulario: " + result.error);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error al enviar el formulario.");
    }
  };

  const nextStep = async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    const fieldsInStep = getFieldsForStep(step);
    const isValid = await trigger(fieldsInStep);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      setTimeout(() => {
        const errorElement = formRef.current?.querySelector(`[name="${Object.keys(errors)[0]}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }, 100);
    }

    setTimeout(() => setIsNavigating(false), 300);
  };

  const prevStep = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setStep((prev) => Math.max(prev - 1, 1));
    setTimeout(() => setIsNavigating(false), 300);
  };

  const getStepForField = (fieldName) => {
    const steps = {
      1: ["nombresApellidos", "tipoDocumento", "numeroDocumento", "celular", "correo", "fechaNacimiento", "ciudadNacimiento", "edad", "peso", "estatura"],
      2: ["tipoVivienda", "caracteristicasVivienda", "estrato", "zona", "paisOrigen", "municipioResidencia", "barrio", "direccion"],
      3: ["genero", "grupoEtnico", "poblacionMovilidad", "grupoReligioso"],
      4: ["eps", "fondoPension", "gradoEscolaridad", "estadoCivil", "tipoContrato", "fechaIngresoEmpresa"],
      5: ["sede", "cargoOperativo", "departamentoOperaciones", "departamentoFinanciero", "departamentoComercial", "departamentoGestionHumana", "soloGerencia", "antiguedad", "grupoSanguineo", "dependientesEconomicos", "embarazo", "sufreEnfermedad", "descripcionEnfermedad"],
      6: ["tieneHijos", "cuantosHijos", "nombresHijos", "edadesHijos", "gradoEscolaridadHijos"],
      7: ["contactoNombres", "contactoCelular", "parentescoContacto", "fechaDiligenciamiento"],
    };
    for (let s = 1; s <= totalSteps; s++) {
      if (steps[s].includes(fieldName)) return s;
    }
    return 1;
  };

  const getFieldsForStep = (stepNumber) => {
    const steps = {
      1: ["nombresApellidos", "tipoDocumento", "numeroDocumento", "celular", "correo", "fechaNacimiento", "ciudadNacimiento", "edad", "peso", "estatura"],
      2: ["tipoVivienda", "caracteristicasVivienda", "estrato", "zona", "paisOrigen", "municipioResidencia", "barrio", "direccion"],
      3: ["genero", "grupoEtnico", "poblacionMovilidad", "grupoReligioso"],
      4: ["eps", "fondoPension", "gradoEscolaridad", "estadoCivil", "tipoContrato", "fechaIngresoEmpresa"],
      5: ["sede", "cargoOperativo", "departamentoOperaciones", "departamentoFinanciero", "departamentoComercial", "departamentoGestionHumana", "soloGerencia", "antiguedad", "grupoSanguineo", "dependientesEconomicos", "embarazo", "sufreEnfermedad", "descripcionEnfermedad"],
      6: ["tieneHijos", "cuantosHijos", "nombresHijos", "edadesHijos", "gradoEscolaridadHijos"],
      7: ["contactoNombres", "contactoCelular", "parentescoContacto", "fechaDiligenciamiento"],
    };
    return steps[stepNumber] || [];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaUser /> Datos Personales
            </h2>
            <p className="perfil-step-desc">¡Empecemos con lo básico! Cuéntanos quién eres.</p>
            <div className="perfil-field">
              <label>1. Nombres y Apellidos</label>
              <input
                {...register("nombresApellidos", {
                  required: "Campo obligatorio",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                className="perfil-input"
              />
              {errors.nombresApellidos && <p className="error-text">{errors.nombresApellidos.message}</p>}
            </div>
            <div className="perfil-field">
              <label>2. Tipo de Documento</label>
              <select
                {...register("tipoDocumento", { required: "Seleccione un tipo" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="CÉDULA DE CIUDADANÍA">CÉDULA DE CIUDADANÍA</option>
                <option value="PPT">PPT</option>
                <option value="CÉDULA DE EXTRANJERÍA">CÉDULA DE EXTRANJERÍA</option>
                <option value="TARJETA DE IDENTIDAD">TARJETA DE IDENTIDAD</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.tipoDocumento && <p className="error-text">{errors.tipoDocumento.message}</p>}
            </div>
            <div className="perfil-field">
              <label>3. Número de Documento</label>
              <input
                {...register("numeroDocumento", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                  maxLength: { value: 20, message: "Máximo 20 caracteres" },
                })}
                className="perfil-input"
              />
              {errors.numeroDocumento && <p className="error-text">{errors.numeroDocumento.message}</p>}
            </div>
            <div className="perfil-field">
              <label>4. Número de Celular</label>
              <input
                {...register("celular", {
                  required: "Campo obligatorio",
                  pattern: { value: /^3\d{9}$/, message: "Celular colombiano válido" },
                })}
                className="perfil-input"
              />
              {errors.celular && <p className="error-text">{errors.celular.message}</p>}
            </div>
            <div className="perfil-field">
              <label>5. Correo Electrónico</label>
              <input
                {...register("correo", { required: "Campo obligatorio" })}
                type="email"
                className="perfil-input"
              />
              {errors.correo && <p className="error-text">{errors.correo.message}</p>}
            </div>
            <div className="perfil-field">
              <label>6. Fecha de Nacimiento</label>
              <Controller
                control={control}
                name="fechaNacimiento"
                rules={{ required: "Campo obligatorio" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="perfil-input"
                    placeholderText="Selecciona una fecha"
                    portalId="datepicker-portal" // Usar portal
                    popperContainer={({ children }) => portalContainer && children}
                  />
                )}
              />
              {errors.fechaNacimiento && <p className="error-text">{errors.fechaNacimiento.message}</p>}
            </div>
            <div className="perfil-field">
              <label>7. Ciudad de Nacimiento</label>
              <input
                {...register("ciudadNacimiento", {
                  required: "Campo obligatorio",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                className="perfil-input"
              />
              {errors.ciudadNacimiento && <p className="error-text">{errors.ciudadNacimiento.message}</p>}
            </div>
            <div className="perfil-field">
              <label>8. Edad</label>
              <input
                {...register("edad", {
                  required: "Campo obligatorio",
                  min: { value: 1, message: "Edad mínima 1" },
                  max: { value: 120, message: "Edad máxima 120" },
                })}
                type="number"
                className="perfil-input"
              />
              {errors.edad && <p className="error-text">{errors.edad.message}</p>}
            </div>
            <div className="perfil-field">
              <label>9. Peso (kg)</label>
              <input
                {...register("peso", {
                  pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Hasta 2 decimales" },
                  min: { value: 30, message: "Peso mínimo 30kg" },
                  max: { value: 200, message: "Peso máximo 200kg" },
                })}
                type="number"
                step="any"
                className="perfil-input"
              />
              {errors.peso && <p className="error-text">{errors.peso.message}</p>}
            </div>
            <div className="perfil-field">
              <label>10. Estatura (cm)</label>
              <input
                {...register("estatura", {
                  pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Hasta 2 decimales" },
                  min: { value: 100, message: "Estatura mínima 100cm" },
                  max: { value: 250, message: "Estatura máxima 250cm" },
                })}
                type="number"
                step="any"
                className="perfil-input"
              />
              {errors.estatura && <p className="error-text">{errors.estatura.message}</p>}
            </div>
          </section>
        );
      case 2:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaHome /> Vivienda y Ubicación
            </h2>
            <p className="perfil-step-desc">¡Cuéntanos dónde vives! Esto nos ayuda a conocerte mejor.</p>
            <div className="perfil-field">
              <label>11. Tipo de Vivienda</label>
              <select
                {...register("tipoVivienda", { required: "Seleccione una opción" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="PROPIA">PROPIA</option>
                <option value="ARRENDADA">ARRENDADA</option>
                <option value="FAMILIAR">FAMILIAR</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.tipoVivienda && <p className="error-text">{errors.tipoVivienda.message}</p>}
            </div>
            <div className="perfil-field">
              <label>12. Características de la Vivienda</label>
              <select
                {...register("caracteristicasVivienda", { required: "Seleccione una opción" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="FINCA">FINCA</option>
                <option value="CASA LOTE">CASA LOTE</option>
                <option value="CASA CONJUNTO CERRADO">CASA CONJUNTO CERRADO</option>
                <option value="CASA BARRIO">CASA BARRIO</option>
                <option value="APARTAMENTO">APARTAMENTO</option>
                <option value="HABITACIÓN">HABITACIÓN</option>
              </select>
              {errors.caracteristicasVivienda && <p className="error-text">{errors.caracteristicasVivienda.message}</p>}
            </div>
            <div className="perfil-field">
              <label>13. Estrato Socioeconómico</label>
              <select
                {...register("estrato", { required: "Seleccione un estrato" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              {errors.estrato && <p className="error-text">{errors.estrato.message}</p>}
            </div>
            <div className="perfil-field">
              <label>14. Zona</label>
              <select
                {...register("zona", { required: "Seleccione una zona" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="URBANA">URBANA</option>
                <option value="RURAL">RURAL</option>
              </select>
              {errors.zona && <p className="error-text">{errors.zona.message}</p>}
            </div>
            <div className="perfil-field">
              <label>15. País de Origen</label>
              <input
                {...register("paisOrigen", {
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                className="perfil-input"
              />
              {errors.paisOrigen && <p className="error-text">{errors.paisOrigen.message}</p>}
            </div>
            <div className="perfil-field">
              <label>16. Municipio de Residencia</label>
              <input
                {...register("municipioResidencia", {
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                })}
                className="perfil-input"
              />
              {errors.municipioResidencia && <p className="error-text">{errors.municipioResidencia.message}</p>}
            </div>
            <div className="perfil-field">
              <label>17. Barrio</label>
              <input
                {...register("barrio", {
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                })}
                className="perfil-input"
              />
              {errors.barrio && <p className="error-text">{errors.barrio.message}</p>}
            </div>
            <div className="perfil-field">
              <label>18. Dirección Completa</label>
              <input
                {...register("direccion", {
                  maxLength: { value: 255, message: "Máximo 255 caracteres" },
                })}
                className="perfil-input"
              />
              {errors.direccion && <p className="error-text">{errors.direccion.message}</p>}
            </div>
          </section>
        );
      case 3:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaUsers /> Datos Demográficos
            </h2>
            <p className="perfil-step-desc">¡Tu identidad importa! Comparte un poco más sobre ti.</p>
            <div className="perfil-field">
              <label>19. Género</label>
              <select
                {...register("genero", { required: "Seleccione un género" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="MASCULINO">MASCULINO</option>
                <option value="FEMENINO">FEMENINO</option>
                <option value="NO BINARIO">NO BINARIO</option>
                <option value="LGTBIQ+">LGTBIQ+</option>
                <option value="PREFIERO NO DECIRLO">PREFIERO NO DECIRLO</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.genero && <p className="error-text">{errors.genero.message}</p>}
            </div>
            <div className="perfil-field">
              <label>20. Grupo Étnico</label>
              <select
                {...register("grupoEtnico", { required: "Seleccione un grupo étnico" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="INDÍGENA">INDÍGENA</option>
                <option value="GITANO O RROM">GITANO O RROM</option>
                <option value="RAIZAL">RAIZAL</option>
                <option value="AFRO">AFRO</option>
                <option value="NO ME IDENTIFICO">NO ME IDENTIFICO</option>
              </select>
              {errors.grupoEtnico && <p className="error-text">{errors.grupoEtnico.message}</p>}
            </div>
            <div className="perfil-field">
              <label>21. Población en Movilidad</label>
              <select
                {...register("poblacionMovilidad", { required: "Seleccione una opción" })}
                className="perfil-select"
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
              {errors.poblacionMovilidad && <p className="error-text">{errors.poblacionMovilidad.message}</p>}
            </div>
            <div className="perfil-field">
              <label>22. Grupo Religioso</label>
              <select
                {...register("grupoReligioso", { required: "Seleccione un grupo religioso" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="CATOLICISMO">CATOLICISMO</option>
                <option value="PROTESTANTISMO">PROTESTANTISMO</option>
                <option value="RELIGIONES AFRODESCENDIENTES">RELIGIONES AFRODESCENDIENTES</option>
                <option value="RELIGIONES INDÍGENAS">RELIGIONES INDÍGENAS</option>
                <option value="ISLAM">ISLAM</option>
                <option value="JUDAÍSMO">JUDAÍSMO</option>
                <option value="HINDUISMO, BUDISMO Ó BAHISMO">HINDUISMO, BUDISMO Ó BAHISMO</option>
                <option value="NINGUNO">NINGUNO</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.grupoReligioso && <p className="error-text">{errors.grupoReligioso.message}</p>}
            </div>
          </section>
        );
      case 4:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaBriefcase /> Afiliación y Escolaridad
            </h2>
            <p className="perfil-step-desc">Hablemos de tu formación y afiliaciones.</p>
            <div className="perfil-field">
              <label>23. EPS</label>
              <select
                {...register("eps", { required: "Seleccione una EPS" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="SURA">SURA</option>
                <option value="SALUD TOTAL">SALUD TOTAL</option>
                <option value="SANITAS">SANITAS</option>
                <option value="NUEVA EPS">NUEVA EPS</option>
                <option value="SAVIA SALUD">SAVIA SALUD</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.eps && <p className="error-text">{errors.eps.message}</p>}
            </div>
            <div className="perfil-field">
              <label>24. Fondo de Pensión</label>
              <select
                {...register("fondoPension", { required: "Seleccione un fondo" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="COLPENSIONES">COLPENSIONES</option>
                <option value="PROTECCIÓN">PROTECCIÓN</option>
                <option value="COLFONDOS">COLFONDOS</option>
                <option value="PORVENIR">PORVENIR</option>
                <option value="NO APLICA (APRENDIZ)">NO APLICA (APRENDIZ)</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.fondoPension && <p className="error-text">{errors.fondoPension.message}</p>}
            </div>
            <div className="perfil-field">
              <label>25. Grado de Escolaridad</label>
              <select
                {...register("gradoEscolaridad", { required: "Seleccione un grado" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="PRIMARIA INCOMPLETA">PRIMARIA INCOMPLETA</option>
                <option value="PRIMARIA COMPLETA">PRIMARIA COMPLETA</option>
                <option value="BACHILLER INCOMPLETO">BACHILLER INCOMPLETO</option>
                <option value="BACHILLER COMPLETO">BACHILLER COMPLETO</option>
                <option value="TECNICO/TECNOLOGO INCOMPLETO">TECNICO/TECNOLOGO INCOMPLETO</option>
                <option value="TECNICO/TECNOLOGO COMPLETO">TECNICO/TECNOLOGO COMPLETO</option>
                <option value="PROFESIONAL INCOMPLETO">PROFESIONAL INCOMPLETO</option>
                <option value="PROFESIONAL COMPLETO">PROFESIONAL COMPLETO</option>
                <option value="POSTGRADO">POSTGRADO</option>
                <option value="NINGUNO">NINGUNO</option>
              </select>
              {errors.gradoEscolaridad && <p className="error-text">{errors.gradoEscolaridad.message}</p>}
            </div>
            <div className="perfil-field">
              <label>26. Estado Civil</label>
              <select
                {...register("estadoCivil", { required: "Seleccione un estado" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="SOLTERO/RA">SOLTERO/RA</option>
                <option value="CASADO/DA">CASADO/DA</option>
                <option value="UNIÓN LIBRE">UNIÓN LIBRE</option>
                <option value="DIVORCIADO/DA">DIVORCIADO/DA</option>
                <option value="VIUDO/DA">VIUDO/DA</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.estadoCivil && <p className="error-text">{errors.estadoCivil.message}</p>}
            </div>
            <div className="perfil-field">
              <label>27. Tipo de Contrato</label>
              <select
                {...register("tipoContrato", { required: "Seleccione un tipo" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="TERMINO INDEFINIDO">TERMINO INDEFINIDO</option>
                <option value="TERMINO FIJO">TERMINO FIJO</option>
              </select>
              {errors.tipoContrato && <p className="error-text">{errors.tipoContrato.message}</p>}
            </div>
            <div className="perfil-field">
              <label>28. Fecha de Ingreso a la Empresa</label>
              <Controller
                control={control}
                name="fechaIngresoEmpresa"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="perfil-input"
                    placeholderText="Selecciona una fecha"
                    portalId="datepicker-portal" // Usar portal
                    popperContainer={({ children }) => portalContainer && children}
                  />
                )}
              />
            </div>
          </section>
        );
      case 5:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaHeartbeat /> Información Laboral y Adicional
            </h2>
            <p className="perfil-step-desc">¡Tu rol en Merkahorro y más datos importantes!</p>
            <div className="perfil-field">
              <label>29. Sede</label>
              <select
                {...register("sede", { required: "Seleccione una sede" })}
                className="perfil-select"
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
              {errors.sede && <p className="error-text">{errors.sede.message}</p>}
            </div>
            <div className="perfil-field">
              <label>30. Cargo Operativo</label>
              <select
                {...register("cargoOperativo", { required: "Seleccione un cargo" })}
                className="perfil-select"
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
              {errors.cargoOperativo && <p className="error-text">{errors.cargoOperativo.message}</p>}
            </div>
            <div className="perfil-field">
              <label>31. Departamento Operaciones</label>
              <select
                {...register("departamentoOperaciones", { required: "Seleccione un departamento" })}
                className="perfil-select"
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
              {errors.departamentoOperaciones && <p className="error-text">{errors.departamentoOperaciones.message}</p>}
            </div>
            <div className="perfil-field">
              <label>32. Departamento Financiero</label>
              <select
                {...register("departamentoFinanciero", { required: "Seleccione un departamento" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="DIRECTORA ADMINISTRATIVA Y FINANCIERA">DIRECTORA ADMINISTRATIVA Y FINANCIERA</option>
                <option value="AUXILIAR TESORERIA">AUXILIAR TESORERIA</option>
                <option value="AUXILIAR CARTERA">AUXILIAR CARTERA</option>
                <option value="AUXILIAR NÓMINA">AUXILIAR NÓMINA</option>
                <option value="ANALISTA CONTABLE">ANALISTA CONTABLE</option>
                <option value="AUXILIAR CONTABLE">AUXILIAR CONTABLE</option>
                <option value="AUXILIAR CAUSACIONES">AUXILIAR CAUSACIONES</option>
                <option value="LÍDER CONTABILIDAD">LÍDER CONTABILIDAD</option>
              </select>
              {errors.departamentoFinanciero && <p className="error-text">{errors.departamentoFinanciero.message}</p>}
            </div>
            <div className="perfil-field">
              <label>33. Departamento Comercial</label>
              <select
                {...register("departamentoComercial", { required: "Seleccione un departamento" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="ASISTENTE COMERCIAL">ASISTENTE COMERCIAL</option>
                <option value="AUXILIAR COMERCIAL">AUXILIAR COMERCIAL</option>
                <option value="LÍDER COMPRAS">LÍDER COMPRAS</option>
                <option value="AUXILIAR COMPRAS">AUXILIAR COMPRAS</option>
              </select>
              {errors.departamentoComercial && <p className="error-text">{errors.departamentoComercial.message}</p>}
            </div>
            <div className="perfil-field">
              <label>34. Departamento Gestión Humana</label>
              <select
                {...register("departamentoGestionHumana", { required: "Seleccione un departamento" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="DIRECTOR GESTIÓN HUMANA">DIRECTOR GESTIÓN HUMANA</option>
                <option value="ASISTENTE GESTIÓN HUMANA">ASISTENTE GESTIÓN HUMANA</option>
                <option value="LÍDER DE DESARROLLO Y TALENTO HUMANO">LÍDER DE DESARROLLO Y TALENTO HUMANO</option>
                <option value="AUXILIAR GESTIÓN HUMANA">AUXILIAR GESTIÓN HUMANA</option>
                <option value="AUXILIAR SISTEMAS INTEGRADOS">AUXILIAR SISTEMAS INTEGRADOS</option>
                <option value="PRACTICANTE SST">PRACTICANTE SST</option>
                <option value="PRACTICANTE">PRACTICANTE</option>
              </select>
              {errors.departamentoGestionHumana && <p className="error-text">{errors.departamentoGestionHumana.message}</p>}
            </div>
            <div className="perfil-field">
              <label>35. Solo Gerencia</label>
              <select
                {...register("soloGerencia", { })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="GERENTE">GERENTE</option>
              </select>
              {errors.soloGerencia && <p className="error-text">{errors.soloGerencia.message}</p>}
            </div>
            <div className="perfil-field">
              <label>36. Antigüedad en la Empresa</label>
              <select
                {...register("antiguedad", { required: "Seleccione la antigüedad" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="MENOS DE 6 MESES">MENOS DE 6 MESES</option>
                <option value="6 MESES a 1 AÑO">6 MESES a 1 AÑO</option>
                <option value="1 a 3 AÑOS">1 a 3 AÑOS</option>
                <option value="4 a 6 AÑOS">4 a 6 AÑOS</option>
                <option value="7 a 8 AÑOS">7 a 8 AÑOS</option>
              </select>
              {errors.antiguedad && <p className="error-text">{errors.antiguedad.message}</p>}
            </div>
            <div className="perfil-field">
              <label>37. Grupo Sanguíneo</label>
              <select
                {...register("grupoSanguineo", { required: "Seleccione un grupo sanguíneo" })}
                className="perfil-select"
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
              {errors.grupoSanguineo && <p className="error-text">{errors.grupoSanguineo.message}</p>}
            </div>
            <div className="perfil-field">
              <label>38. Número de Personas que Dependen Económicamente</label>
              <select
                {...register("dependientesEconomicos", { required: "Seleccione una opción" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="Otras">Otras</option>
              </select>
              {errors.dependientesEconomicos && <p className="error-text">{errors.dependientesEconomicos.message}</p>}
            </div>
            <div className="perfil-field">
              <label>39. ¿Actualmente Tú o Tu Pareja Están en Estado de Embarazo?</label>
              <select
                {...register("embarazo", { required: "Seleccione una opción" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
              {errors.embarazo && <p className="error-text">{errors.embarazo.message}</p>}
            </div>
            <div className="perfil-field">
              <label>40. ¿Sufres de Alguna Enfermedad?</label>
              <select
                {...register("sufreEnfermedad", { required: "Seleccione una opción" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
              {errors.sufreEnfermedad && <p className="error-text">{errors.sufreEnfermedad.message}</p>}
            </div>
            <div className="perfil-field">
              <label>41. Si la respuesta anterior fue SÍ, describe la enfermedad</label>
              <input
                {...register("descripcionEnfermedad", {
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                className="perfil-input"
                disabled={sufreEnfermedad !== "SI"}
              />
              {errors.descripcionEnfermedad && <p className="error-text">{errors.descripcionEnfermedad.message}</p>}
            </div>
          </section>
        );
      case 6:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaChild /> Información Familiar
            </h2>
            <p className="perfil-step-desc">¿Tienes hijos? Cuéntanos sobre ellos.</p>
            <div className="perfil-field">
              <label>42. ¿Tiene Hijos?</label>
              <select
                {...register("tieneHijos", { required: "Seleccione una opción" })}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
              {errors.tieneHijos && <p className="error-text">{errors.tieneHijos.message}</p>}
            </div>
            <div className="perfil-field">
              <label>43. Si la respuesta fue SÍ, ¿cuántos Hijos?</label>
              <select
                {...register("cuantosHijos", {
                  required: tieneHijos === "SI" ? "Seleccione la cantidad" : false,
                })}
                disabled={tieneHijos !== "SI"}
                className="perfil-select"
              >
                <option value="">Seleccione...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="OTRAS">Otras</option>
              </select>
              {errors.cuantosHijos && <p className="error-text">{errors.cuantosHijos.message}</p>}
            </div>
            <div className="perfil-field">
              <label>44. Nombres de Hijos (separados por ;)</label>
              <input
                {...register("nombresHijos", {
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
              
                })}
                disabled={tieneHijos !== "SI"}
                className="perfil-input"
              />
              {errors.nombresHijos && <p className="error-text">{errors.nombresHijos.message}</p>}
            </div>
            <div className="perfil-field">
              <label>45. Edades de Hijos (separadas por ;)</label>
              <input
                {...register("edadesHijos", {
                  pattern: { value: /^(\d+;?)+$/, message: "Solo números separados por ;" },
                })}
                disabled={tieneHijos !== "SI"}
                className="perfil-input"
              />
              {errors.edadesHijos && <p className="error-text">{errors.edadesHijos.message}</p>}
            </div>
            <div className="perfil-field">
              <label>46. Grado de Escolaridad de Hijos</label>
              <input
                {...register("gradoEscolaridadHijos", {
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                disabled={tieneHijos !== "SI"}
                className="perfil-input"
              />
              {errors.gradoEscolaridadHijos && <p className="error-text">{errors.gradoEscolaridadHijos.message}</p>}
            </div>
          </section>
        );
      case 7:
        return (
          <section className="perfil-section animate-in">
            <h2 className="perfil-section-title">
              <FaPhone /> Contacto y Finalización
            </h2>
            <p className="perfil-step-desc">Último paso: datos de emergencia y fecha.</p>
            <div className="perfil-field">
              <label>47. Nombres y Apellidos del Contacto</label>
              <input
                {...register("contactoNombres", {
                  required: "Campo obligatorio",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                className="perfil-input"
              />
              {errors.contactoNombres && <p className="error-text">{errors.contactoNombres.message}</p>}
            </div>
            <div className="perfil-field">
              <label>48. Número de Celular del Contacto</label>
              <input
                {...register("contactoCelular", {
                  required: "Campo obligatorio",
                  pattern: { value: /^3\d{9}$/, message: "Celular colombiano válido" },
                })}
                className="perfil-input"
              />
              {errors.contactoCelular && <p className="error-text">{errors.contactoCelular.message}</p>}
            </div>
            <div className="perfil-field">
              <label>49. Parentesco</label>
              <input
                {...register("parentescoContacto", {
                  required: "Campo obligatorio",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: letterPattern,
                })}
                className="perfil-input"
              />
              {errors.parentescoContacto && <p className="error-text">{errors.parentescoContacto.message}</p>}
            </div>
            <div className="perfil-field">
              <label>50. Fecha del Diligenciamiento</label>
              <input
                {...register("fechaDiligenciamiento", { required: "Campo obligatorio" })}
                type="date"
                className="perfil-input"
                disabled
              />
              {errors.fechaDiligenciamiento && <p className="error-text">{errors.fechaDiligenciamiento.message}</p>}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="formulario-perfil">
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>

      <h1 className="perfil-title">PERFIL SOCIODEMOGRÁFICO</h1>
      <h4 className="fraseMotivacional">
        "Somos lo que hacemos repetidamente; la excelencia, entonces, no es un acto, sino un hábito."
      </h4>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        <p>
          Paso {step} de {totalSteps} - {Math.round((step / totalSteps) * 100)}% completado
        </p>
      </div>

      {renderStep()}

      <div className="navigation-buttons">
        {step > 1 && (
          <button type="button" className="perfil-nav-btn prev" onClick={prevStep}>
            Anterior
          </button>
        )}
        {step < totalSteps ? (
          <button type="button" className="perfil-nav-btn next" onClick={nextStep}>
            Siguiente
          </button>
        ) : (
          <button type="submit" className="perfil-submit-btn">
            Enviar Formulario
          </button>
        )}
      </div>
    </form>
  );
};

export { FormularioPerfil };