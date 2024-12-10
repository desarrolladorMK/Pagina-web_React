import React, { useState } from "react";
import "./Trabaja.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Footer } from "../components/Footer";

const Trabaja = () => {
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        console.log("Captcha Token:", token);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!captchaToken) {
            alert("Por favor, verifica que no eres un robot.");
            return;
        }

        alert("Formulario enviado exitosamente!");
    };

    return (
        <>
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
                        <div className="form-group">
                            <label htmlFor="fecha-postulacion">Fecha de Postulación:</label>
                            <input type="date" id="fecha-postulacion" name="fecha-postulacion" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nombre-apellido">Nombre y Apellido:</label>
                            <input type="text" id="nombre-apellido" name="nombre-apellido" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivel-educativo">Nivel Educativo:</label>
                            <select id="nivel-educativo" name="nivel-educativo" required>
                                <option value="" disabled selected>
                                    Seleccione su nivel educativo
                                </option>
                                <option value="primaria">Primaria culminada</option>
                                <option value="bachiller">Bachiller culminado</option>
                                <option value="Estudiante">Estudiante</option>
                                <option value="tecnico">Técnico</option>
                                <option value="tecnologo">Tecnólogo</option>
                                <option value="Profesional">Profesional</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cargo">Seleccione el Cargo al cual se quiere presentar:</label>
                            <select id="cargo" name="cargo" required>
                                <option value="" disabled selected>Seleccione un cargo</option>
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Número de contacto:</label>
                            <input type="text" id="telefono" name="telefono" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="genero">Género:</label>
                            <select id="genero" name="genero" required>
                                <option value="" disabled selected>Seleccione su género</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pais-domicilio">Departamento:</label>
                            <select id="pais-domicilio" name="pais-domicilio" required>
                                <option value="Antioquia">Antioquia</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="Municipio-domicilio">Ciudad:</label>
                            <select id="Municipio-domicilio" name="Municipio-domicilio" required>
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="zona-residencia">Zona de Residencia:</label>
                            <select id="zona-residencia" name="zona-residencia" required>
                                <option value="" disabled selected>Seleccione su zona de residencia</option>
                                <option value="urbana">Urbana</option>
                                <option value="rural">Rural</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="barrio">Barrio:</label>
                            <input type="text" id="barrio" name="barrio" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fecha-nacimiento">Fecha de Nacimiento:</label>
                            <input type="date" id="fecha-nacimiento" name="fecha-nacimiento" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipo-documento">Tipo de Documento de Identidad:</label>
                            <select id="tipo-documento" name="tipo-documento" required>
                                <option value="" disabled selected>Seleccione su tipo de documento</option>
                                <option value="cedula">Cédula de Ciudadanía</option>
                                <option value="cedula_extranjeria">Cédula de Extranjería</option>
                                <option value="pasaporte">Pasaporte</option>
                                <option value="permiso">Permiso Especial de Permanencia</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="numero-documento">Número de Documento:</label>
                            <input type="text" id="numero-documento" name="numero-documento" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="recomendado">¿Quién lo recomienda?</label>
                            <input type="text" id="recomendado" name="recomendado" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hoja_vida">Adjuntar Hoja de Vida:</label>
                            <input type="file" id="hoja_vida" name="hoja_vida" accept=".pdf" required />
                            <small>Solo se permiten archivos PDF. Tamaño máximo: 600 KB.</small>
                        </div>

                        <div className="form-group">
                            <input
                                type="checkbox"
                                id="terminos"
                                name="terminos"
                                required
                            />
                            <label htmlFor="terminos">Acepto los términos y condiciones</label>
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
                <Footer/>
            </div>
        </>
    );
};

export { Trabaja };
