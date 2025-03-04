import React, { useState, useRef } from "react";
import "./Trabaja.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Footer } from "../components/Footer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ChatBot } from "../components/ChatBot";

const MySwal = withReactContent(Swal);

const Trabaja = () => {
  const [formData, setFormData] = useState({
    fechaPostulacion: new Date().toISOString().split("T")[0],
    nombreApellido: "",
    nivelEducativo: "",
    cargo: "",
    telefono: "",
    genero: "",
    Departamento: "Antioquia",
    Ciudad: "",
    zonaResidencia: "",
    barrio: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    numeroDocumento: "",
    recomendado: "",
    hojaVida: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const inputHojaVida = useRef(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValido(!!value);
    validateField("captcha", value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      
      const maxSize = 600 * 1024;
      if (file.size > maxSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          hojaVida: "El archivo no debe exceder los 600 KB.",
        }));
        inputHojaVida.current.value = "";
      } else if (file.type !== "application/pdf") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          hojaVida: "Solo se permiten archivos PDF.",
        }));
        inputHojaVida.current.value = "";
      } else {
        setFormData({ ...formData, hojaVida: file });
        setErrors((prevErrors) => {
          const { hojaVida, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const validateField = (name, value) => {
    const nuevosErrores = { ...errors };

    switch (name) {
      case "nombreApellido":
        if (!/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]{1,50}$/.test(value)) {
          nuevosErrores.nombreApellido =
            "Por favor, ingrese solo letras y espacios (máximo 50 caracteres).";
        } else {
          delete nuevosErrores.nombreApellido;
        }
        break;
      case "telefono":
        if (!/^(3\d{9}|[1-9]\d{6}|\d{10})$/.test(value.replace(/\D/g, ""))) {
          nuevosErrores.telefono =
            "Por favor, ingrese un número de teléfono válido.";
        } else {
          delete nuevosErrores.telefono;
        }
        break;
      case "numeroDocumento":
        if (!/^\d{5,10}$/.test(value)) {
          nuevosErrores.numeroDocumento =
            "Por favor, ingrese un número de documento válido.";
        } else {
          delete nuevosErrores.numeroDocumento;
        }
        break;
      case "captcha":
        if (!value) {
          nuevosErrores.captcha = "Por favor, complete el reCAPTCHA.";
        } else {
          delete nuevosErrores.captcha;
        }
        break;
      default:
        break;
    }

    setErrors(nuevosErrores);
  };

  const verificarDocumentoExistente = async (numeroDocumento) => {
    try {
      const response = await fetch(
        `https://backend-mk.vercel.app/api/postulaciones?numeroDocumento=${numeroDocumento}`
      );
      const result = await response.json();
      return result.data && result.data.length > 0;
    } catch (error) {
      console.error("Error al verificar el documento:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValido) {
      MySwal.fire({
        title: "Error",
        text: "Por favor, complete el reCAPTCHA.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const existe = await verificarDocumentoExistente(formData.numeroDocumento);
    if (existe) {
      MySwal.fire({
        title: "Documento Duplicado",
        text: "El número de documento ya está registrado.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "hojaVida") {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (formData.hojaVida) {
      formDataToSend.append("hojaVida", formData.hojaVida);
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://backend-mk.vercel.app/enviar", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        MySwal.fire({
          title: "¡Éxito!",
          text: result.message || "Formulario enviado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        recaptchaRef.current?.reset();
        setCaptchaValido(false);
        setFormData({
          fechaPostulacion: new Date().toISOString().split("T")[0],
          nombreApellido: "",
          nivelEducativo: "",
          cargo: "",
          telefono: "",
          genero: "",
          Departamento: "Antioquia",
          Ciudad: "",
          zonaResidencia: "",
          barrio: "",
          fechaNacimiento: "",
          tipoDocumento: "",
          numeroDocumento: "",
          recomendado: "",
          hojaVida: null,
        });
      } else {
        throw new Error(result.message || "Error al enviar el formulario.");
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text: error.message || "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trabaja-body">
      <header className="header-trabaja">
        <h1>Bienvenido a Nuestra Compañía</h1>
      </header>

      <div className="container-trabaja">
        <img src="/img_fondo.jpg" alt="Logo de la Compañía" className="logo" />

        <div className="intro">
          <h2>¿Quieres ser parte de nuestra compañía?</h2>
          <p>
            En nuestra empresa, te ofrecemos una oportunidad única de
            crecimiento profesional y personal. Disfruta de un ambiente laboral
            colaborativo, formación continua, y beneficios exclusivos para
            nuestros empleados.
          </p>
        </div>

        <div className="benefits">
          <h3>Beneficios de Trabajar con Nosotros</h3>
          <ul>
            <li>Trabaja en una cultura de crecimiento personal y laboral.</li>
            <li>Trabaja sobre principios.</li>
            <li>Oportunidades de desarrollo profesional y capacitación.</li>
            <li>Ambiente de trabajo inclusivo y colaborativo.</li>
            <li>Seguro médico y beneficios adicionales.</li>
            <li>Salario competitivo y bonificaciones.</li>
          </ul>
        </div>
        <div className="intro">
          <h2>Postúlate y forma parte de nuestra compañía</h2>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Fecha de Postulación */}
            <div className="form-group">
              <label className="label-trabaja">Fecha de Postulación:</label>
              <input
                type="date"
                name="fechaPostulacion"
                onChange={handleChange}
                value={formData.fechaPostulacion}
                required
              />
            </div>

            {/* Nombre y Apellido */}
            <div className="form-group">
              <label className="label-trabaja">Nombre y Apellido:</label>
              <input
                type="text"
                name="nombreApellido"
                value={formData.nombreApellido}
                onChange={handleChange}
                required
              />
              {errors.nombreApellido && (
                <div className="alert">{errors.nombreApellido}</div>
              )}
            </div>

            {/* Nivel Educativo */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="nivelEducativo">
                Nivel Educativo:
              </label>
              <select
                id="nivelEducativo"
                name="nivelEducativo"
                onChange={handleChange}
                value={formData.nivelEducativo}
                required
              >
                <option value="" disabled>
                  Seleccione su nivel educativo
                </option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="tecnico">Técnico</option>
                <option value="tecnologo">Tecnólogo</option>
                <option value="universitario">Universitario</option>
                <option value="postgrado">Postgrado</option>
              </select>
              {errors.nivelEducativo && (
                <p className="error-message">{errors.nivelEducativo}</p>
              )}
            </div>

            {/* Cargo al que desea aplicar */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="cargo">
                Cargo al que desea aplicar:
              </label>
              <select
                type="text"
                id="cargo"
                name="cargo"
                onChange={handleChange}
                value={formData.cargo}
                required
              >
                <option value="" disabled>
                  Seleccione un cargo
                </option>
                <option value="auxiliar-bodega">Auxiliar de Bodega</option>
                <option value="Auxiliar-inventario">
                  Auxiliar de Inventario
                </option>
                <option value="auxiliar-recibo">Auxiliar de Recibo</option>
                <option value="auxiliar-fruve">Auxiliar de Fruver</option>
                <option value="auxiliar-carnicos">Auxiliar de Cárnicos</option>
                <option value="auxiliar-contable">Auxiliar Contable</option>
                <option value="cajera">Cajera (o)</option>
                <option value="surtidor">Surtidor</option>
                <option value="empacador">Empacador</option>
                <option value="monitor-servicio">Monitor de Servicio</option>
                <option value="domiciliario-surtidor">
                  Domiciliario Surtidor
                </option>
                <option value="Servicios-Generales">Servicios Generales</option>
                <option value="cajera-pac">Cajera Pac</option>
                <option value="formador">Formador</option>
                <option value="administrador-punto">
                  Administrador de Punto
                </option>
                <option value="otro">Otro</option>
              </select>
              {errors.cargo && <p className="error-message">{errors.cargo}</p>}
            </div>

            {/* Número de Contacto */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="telefono">
                Número de Contacto:
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                onChange={handleChange}
                value={formData.telefono}
                required
              />
              {errors.telefono && (
                <p className="error-message">{errors.telefono}</p>
              )}
            </div>

            {/* Género */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="genero">
                Género:
              </label>
              <select
                id="genero"
                name="genero"
                onChange={handleChange}
                value={formData.genero}
                required
              >
                <option value="" disabled>
                  Seleccione su género
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
              </select>
              {errors.genero && (
                <p className="error-message">{errors.genero}</p>
              )}
            </div>

            {/* Departamento de Domicilio */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="Departamento">
                Departamento de Domicilio:
              </label>
              <select
                id="Departamento"
                name="Departamento"
                onChange={handleChange}
                value={formData.Departamento}
                required
              >
                <option value="" disabled>
                  Seleccione su departamento
                </option>
                <option value="Antioquia">Antioquia</option>
              </select>
              {errors.Departamento && (
                <p className="error-message">{errors.Departamento}</p>
              )}
            </div>

            {/* Ciudad de Domicilio */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="Ciudad">
                Ciudad:
              </label>
              <select
                type="text"
                id="Ciudad"
                name="Ciudad"
                onChange={handleChange}
                value={formData.Ciudad}
                required
              >
                <option value="">Seleccione una ciudad</option>
                <option value="Medellín">Medellín</option>
                <option value="Bello">Bello</option>
                <option value="Envigado">Envigado</option>
                <option value="Itagüí">Itagüí</option>
                <option value="Sabaneta">Sabaneta</option>
                <option value="La Estrella">La Estrella</option>
                <option value="Copacabana">Copacabana</option>
                <option value="Girardota">Girardota</option>
                <option value="Barbosa">Barbosa</option>
                <option value="Rionegro">Rionegro</option>
                <option value="Retiro">Retiro</option>
              </select>
              {errors.Ciudad && (
                <p className="error-message">{errors.Ciudad}</p>
              )}
            </div>

            {/* Zona de Residencia */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="zonaResidencia">
                Zona de Residencia:
              </label>
              <select
                id="zonaResidencia"
                name="zonaResidencia"
                onChange={handleChange}
                value={formData.zonaResidencia}
                required
              >
                <option value="" disabled>
                  Seleccione su zona de residencia
                </option>
                <option value="urbana">Urbana</option>
                <option value="rural">Rural</option>
              </select>
              {errors.zonaResidencia && (
                <p className="error-message">{errors.zonaResidencia}</p>
              )}
            </div>

            {/* Barrio */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="barrio">
                Barrio:
              </label>
              <input
                type="text"
                id="barrio"
                name="barrio"
                onChange={handleChange}
                value={formData.barrio}
                required
              />
              {errors.barrio && (
                <p className="error-message">{errors.barrio}</p>
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="fechaNacimiento">
                Fecha de Nacimiento:
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                onChange={handleChange}
                value={formData.fechaNacimiento}
                required
              />
              {errors.fechaNacimiento && (
                <p className="error-message">{errors.fechaNacimiento}</p>
              )}
            </div>
            {/* Tipo de Documento */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="tipoDocumento">
                Tipo de Documento de Identidad:
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                onChange={handleChange}
                value={formData.tipoDocumento}
                required
              >
                <option value="" disabled>
                  Seleccione su tipo de documento
                </option>
                <option value="cedula">Cédula de Ciudadanía</option>
                <option value="cedula_extranjeria">
                  Cédula de Extranjería
                </option>
                <option value="pasaporte">Pasaporte</option>
                <option value="permiso">Permiso Especial de Permanencia</option>
              </select>
              {errors.tipoDocumento && (
                <p className="error-message">{errors.tipoDocumento}</p>
              )}
            </div>
            <div className="form-group">
              <label className="label-trabaja" htmlFor="numeroDocumento">
                Número de Documento:
              </label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                required
              />
              {errors.numeroDocumento && (
                <p className="error-message">{errors.numeroDocumento}</p>
              )}
            </div>
            {/* ¿Quién lo recomienda? */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="recomendado">
                ¿Quién lo recomienda?
              </label>
              <input
                type="text"
                id="recomendado"
                name="recomendado"
                onChange={handleChange}
                value={formData.recomendado}
                required
              />
              {errors.recomendado && (
                <p className="error-message">{errors.recomendado}</p>
              )}
            </div>

            {/* Adjuntar Hoja de Vida */}
            <div className="form-group">
              <label className="label-trabaja" htmlFor="hojaVida">
                Hoja de Vida (máximo 600 KB):
              </label>
              <input
                type="file"
                id="hojaVida"
                name="hojaVida"
                ref={inputHojaVida}
                onChange={handleFileChange} // Vincular el evento onChange
                accept=".pdf" // Opcional: limitar tipos de archivo aceptados
                required
              />
              {errors.hojaVida && (
                <p className="error-message">{errors.hojaVida}</p>
              )}
            </div>

            {/* Acepto Términos y Condiciones */}
            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="aceptoTerminos"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aceptoTerminos: e.target.checked,
                    })
                  }
                  required
                />
                Acepto los{" "}
                <a
                  href="/condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  términos y condiciones
                </a>
                .
              </label>
              {errors.aceptoTerminos && (
                <p className="error-message">{errors.aceptoTerminos}</p>
              )}
            </div>

            {/* Captcha */}
            <div className="form-group recaptcha-container">
              <ReCAPTCHA
                sitekey="6LejBUEqAAAAAMY0KFh7KCN9TTH2kJYNV3i8VJbm"
                onChange={handleCaptchaChange}
              />
              {errors.captcha && (
                <p className="error-message">{errors.captcha}</p>
              )}
            </div>

            {/* Barra de carga */}
            {isLoading && (
              <div className="loading-bar">
                <div className="progress"></div>
              </div>
            )}

            <button type="submit" className="submit-button-trabaja">
              Enviar Solicitud
            </button>
          </form>
        </div>
      </div>
              {/* Contenedor flotante con el ChatBot, sin mensaje de invitación */}
              <div className="floating-buttons">
          <ChatBot showInviteMessage={false} />
        </div>

      <Footer />
    </div>
  );
};

export { Trabaja };
