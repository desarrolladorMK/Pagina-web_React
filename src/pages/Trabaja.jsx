import  React, { useState } from "react";
import "./Trabaja.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Footer } from "../components/Footer";

const Trabaja = () => {
    const [captchaToken, setCaptchaToken] = useState(null);
    const [formData, setFormData] = useState({
        fechaPostulacion: "",
        nombreApellido: "",
        nivelEducativo: "",
        cargo: "",
        telefono: "",
        genero: "",
        paisDomicilio: "",
        municipioDomicilio: "",
        zonaResidencia: "",
        barrio: "",
        fechaNacimiento: "",
        tipoDocumento: "",
        numeroDocumento: "",
        recomendado: "",
        hojaVida: null,
        terminos: false
    });
    const [errors, setErrors] = useState({});

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : 
                    type === 'file' ? files[0] : value
        }));
        
        // Clear the specific error when user starts typing/selecting
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate each field
        Object.keys(formData).forEach(key => {
            if (key === 'terminos') {
                // Special handling for terms checkbox
                if (!formData[key]) {
                    newErrors[key] = "Debe aceptar los términos y condiciones";
                }
            } else if (key === 'hojaVida') {
                // Validate file upload
                if (!formData[key]) {
                    newErrors[key] = "Debe adjuntar su hoja de vida";
                } else {
                    // Additional file validation
                    const allowedTypes = ['application/pdf'];
                    const maxSize = 600 * 1024; // 600 KB
                    
                    if (!allowedTypes.includes(formData[key].type)) {
                        newErrors[key] = "Solo se permiten archivos PDF";
                    }
                    
                    if (formData[key].size > maxSize) {
                        newErrors[key] = "El archivo debe ser menor a 600 KB";
                    }
                }
            } else {
                // General validation for other fields
                if (!formData[key] || (typeof formData[key] === 'string' && formData[key].trim() === '')) {
                    // Map form field names to more readable error messages
                    const errorMessages = {
                        fechaPostulacion: "Fecha de postulación es requerida",
                        nombreApellido: "Nombre y Apellido son requeridos",
                        nivelEducativo: "Nivel educativo es requerido",
                        cargo: "Cargo es requerido",
                        telefono: "Número de contacto es requerido",
                        genero: "Género es requerido",
                        paisDomicilio: "Departamento es requerido",
                        municipioDomicilio: "Ciudad es requerida",
                        zonaResidencia: "Zona de residencia es requerida",
                        barrio: "Barrio es requerido",
                        fechaNacimiento: "Fecha de nacimiento es requerida",
                        tipoDocumento: "Tipo de documento es requerido",
                        numeroDocumento: "Número de documento es requerido",
                        recomendado: "Campo de recomendación es requerido"
                    };

                    newErrors[key] = errorMessages[key] || "Este campo es requerido";
                }
            }
        });

        // Validate phone number format
        if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) {
            newErrors.telefono = "Número de teléfono debe ser de 10 dígitos";
        }

        // Validate document number format
        if (formData.numeroDocumento && !/^\d+$/.test(formData.numeroDocumento)) {
            newErrors.numeroDocumento = "Número de documento solo debe contener números";
        }

        // Validate age (must be at least 18)
        if (formData.fechaNacimiento) {
            const birthDate = new Date(formData.fechaNacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                newErrors.fechaNacimiento = "Debe ser mayor de 18 años para postularse";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // First, validate the form
        const isValid = validateForm();

        // Check reCAPTCHA
        if (!captchaToken) {
            alert("Por favor, verifica que no eres un robot.");
            return;
        }

        // If form is valid and captcha is verified, proceed
        if (isValid) {
            // Here you would typically send the form data to a backend service
            alert("Formulario enviado exitosamente!");
            // Reset form or do something with the data
        } else {
            // Optionally scroll to the first error
            const firstErrorField = Object.keys(errors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.focus();
            }
        }
    };

    return (
        <div className="trabaja-body">
            <header className="header">
                <h1>Bienvenido a Nuestra Compañía</h1>
            </header>

            <div className="container">
                <img
                    src="/img_fondo.jpg"
                    alt="Logo de la Compañía"
                    className="logo"
                />

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
                    <form id="miformacion" onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Fecha de Postulación */}
                        <div className="form-group">
                            <label className="label-trabaja">Fecha de Postulación:</label>
                            <input 
                                type="date" 
                                id="fechaPostulacion" 
                                name="fechaPostulacion" 
                                onChange={handleChange}
                                value={formData.fechaPostulacion}
                                required
                            />
                            
                        </div>

                        {/* Nombre y Apellido */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="nombreApellido">Nombre y Apellido:</label>
                            <input 
                                type="text" 
                                id="nombreApellido" 
                                name="nombreApellido" 
                                onChange={handleChange}
                                value={formData.nombreApellido}
                                required
                            />
                            
                        </div>

                        {/* Nivel Educativo */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="nivelEducativo">Nivel Educativo:</label>
                            <select 
                                id="nivelEducativo" 
                                name="nivelEducativo" 
                                onChange={handleChange}
                                value={formData.nivelEducativo}
                                required
                            >
                                <option value="" disabled>Seleccione su nivel educativo</option>
                                <option value="primaria">Primaria culminada</option>
                                <option value="bachiller">Bachiller culminado</option>
                                <option value="Estudiante">Estudiante</option>
                                <option value="tecnico">Técnico</option>
                                <option value="tecnologo">Tecnólogo</option>
                                <option value="Profesional">Profesional</option>
                            </select>
                           
                        </div>

                        {/* Cargo */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="cargo">Seleccione el Cargo al cual se quiere presentar:</label>
                            <select 
                                id="cargo" 
                                name="cargo" 
                                onChange={handleChange}
                                value={formData.cargo}
                                required
                            >
                                <option value="" disabled>Seleccione un cargo</option>
                                <option value="auxiliar-bodega">Auxiliar de Bodega</option>
                                <option value="Auxiliar-inventario">Auxiliar de Inventario</option>
                                <option value="auxiliar-recibo">Auxiliar de Recibo</option>
                                <option value="auxiliar-fruve">Auxiliar de Fruver</option>
                                <option value="auxiliar-carnicos">Auxiliar de Cárnicos</option>
                                <option value="auxiliar-contable">Auxiliar Contable</option>
                                <option value="cajera">Cajera (o)</option>
                                <option value="surtidor">Surtidor</option>
                                <option value="empacador">Empacador</option>
                                <option value="monitor-servicio">Monitor de Servicio</option>
                                <option value="domiciliario-surtidor">Domiciliario Surtidor</option>
                                <option value="Servicios-Generales">Servicios Generales</option>
                                <option value="cajera-pac">Cajera Pac</option>
                                <option value="formador">Formador</option>
                                <option value="administrador-punto">Administrador de Punto</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.cargo && <p className="error-message">{errors.cargo}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="telefono">Número de contacto:</label>
                            <input 
                                type="text" 
                                id="telefono" 
                                name="telefono" 
                                onChange={handleChange}
                                value={formData.telefono}
                                placeholder="Ej: 3001234567"
                            />
                            {errors.telefono && <p className="error-message">{errors.telefono}</p>}
                        </div>

                        {/* Género */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="genero">Género:</label>
                            <select 
                                id="genero" 
                                name="genero" 
                                onChange={handleChange}
                                value={formData.genero}
                            >
                                <option value="" disabled>Seleccione su género</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.genero && <p className="error-message">{errors.genero}</p>}
                        </div>

                        {/* Departamento */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="paisDomicilio">Departamento:</label>
                            <select 
                                id="paisDomicilio" 
                                name="paisDomicilio" 
                                onChange={handleChange}
                                value={formData.paisDomicilio}
                            >
                                <option value="Antioquia">Antioquia</option>
                            </select>
                            
                        </div>

                        {/* Ciudad */}
                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="municipioDomicilio">Ciudad:</label>
                            <select 
                                id="municipioDomicilio" 
                                name="municipioDomicilio" 
                                onChange={handleChange}
                                value={formData.municipioDomicilio}
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
                            {errors.municipioDomicilio && <p className="error-message">{errors.municipioDomicilio}</p>}
                        </div>

                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="zona-residencia">Zona de Residencia:</label>
                            <select id="zona-residencia" name="zona-residencia" required>
                                <option value="" disabled>
                                    Seleccione su zona de residencia
                                </option>
                                <option value="urbana">Urbana</option>
                                <option value="rural">Rural</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="barrio">Barrio:</label>
                            <input type="text" id="barrio" name="barrio" required />
                        </div>


                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="fecha-nacimiento">Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                id="fecha-nacimiento"
                                name="fecha-nacimiento"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="tipo-documento">Tipo de Documento de Identidad:</label>
                            <select id="tipo-documento" name="tipo-documento" required>
                                <option value="" disabled>
                                    Seleccione su tipo de documento
                                </option>
                                <option value="cedula">Cédula de Ciudadanía</option>
                                <option value="cedula_extranjeria">Cédula de Extranjería</option>
                                <option value="pasaporte">Pasaporte</option>
                                <option value="permiso">Permiso Especial de Permanencia</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="numero-documento">Número de Documento:</label>
                            <input type="text" id="numero-documento" name="numero-documento" required />
                        </div>

                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="recomendado">¿Quién lo recomienda?</label>
                            <input type="text" id="recomendado" name="recomendado" required />
                        </div>

                        <div className="form-group">
                            <label className="label-trabaja" htmlFor="hoja_vida">Adjuntar Hoja de Vida:</label>
                            <input type="file" id="hoja_vida" name="hoja_vida" accept=".pdf" required />
                            <small>Solo se permiten archivos PDF. Tamaño máximo: 600 KB.</small>
                        </div>
                        <br /><br />

                        <div className="form-group">
                            <input
                                type="checkbox"
                                id="terminos"
                                name="terminos"
                                required
                            />

                            <label className="terminos-" htmlFor="terminos">Acepto los <a href="condiciones">términos y condiciones</a></label>

                        </div>

                        <div className="form-group recaptcha-container">
                            <ReCAPTCHA
                                sitekey="6LejBUEqAAAAAMY0KFh7KCN9TTH2kJYNV3i8VJbm"
                                onChange={handleCaptchaChange}
                            />
                        </div>

                        <button type="submit" className="submit-button">
                            Enviar Solicitud
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export { Trabaja };