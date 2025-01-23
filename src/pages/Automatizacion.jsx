import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Automatizacion.css';

const Automatizacion = () => {
    const [formData, setFormData] = useState({
        descripcion: '',
        pdf: null,
        sede: '',
        fecha_inicial: '',
        fecha_final: '',
        correo_asignado: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingHistorial, setIsLoadingHistorial] = useState(false);

    const API_URL = 'https://backend-cristian.vercel.app/api';

    const obtenerHistorial = async () => {
        if (isLoadingHistorial) return;
        setIsLoadingHistorial(true);

        try {
            const response = await axios.get(`${API_URL}/historial`);
            setHistorial(response.data);
            setMostrarHistorial(!mostrarHistorial);

            if (!mostrarHistorial) {
                setTimeout(() => {
                    const historialElement = document.getElementById('automatizacion-historial');
                    if (historialElement) {
                        historialElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    }
                }, 0);
            }
        } catch (error) {
            console.error('Error al obtener el historial:', error);
            alert('Hubo un error al cargar el historial.');
        } finally {
            setIsLoadingHistorial(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'pdf') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await axios.post(`${API_URL}/enviar-email`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
            alert('Correo enviado exitosamente y datos guardados en la base de datos.');

            setFormData({
                descripcion: '',
                pdf: null,
                sede: '',
                fecha_inicial: '',
                fecha_final: '',
                correo_asignado: '',
            });
            setIsSubmitted(true);
            obtenerHistorial();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un error al enviar la solicitud.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="logo-container">
                <a href="/">
                    <img src="logoMK.png" alt="Logo Merkahorro" />
                </a>
            </div>
            <div className="automatizacion-container">
                <h1 className="automatizacion-header">Automatización de Cristian</h1>

                {!isSubmitted ? (
                    <div className="automatizacion-form-container">
                        <form onSubmit={handleSubmit} className="automatizacion-form">
                            <div className="automatizacion-form-field">
                                <label className="automatizacion-label">Descripción:</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                    className="automatizacion-input"
                                />
                            </div>

                            <div className="automatizacion-form-field">
                                <label className="automatizacion-label">Archivo PDF:</label>
                                <input
                                    type="file"
                                    name="pdf"
                                    accept="application/pdf"
                                    onChange={handleChange}
                                    required
                                    className="automatizacion-input"
                                />
                            </div>

                            <div className="automatizacion-form-field">
                                <label className="automatizacion-label">Sede:</label>
                                <select
                                    name="sede"
                                    value={formData.sede}
                                    onChange={handleChange}
                                    required
                                    className="automatizacion-input"
                                >
                                    <option value="">Selecciona una sede</option>
                                    <option value="Copacabana Plaza">Copacabana Plaza</option>
                                    <option value="Villa Hermosa">Villa Hermosa</option>
                                    <option value="Girardota parque">Girardota parque</option>
                                    <option value="Girardota llano">Girardota llano</option>
                                    <option value="Carnes barbosa">Carnes barbosa</option>
                                    <option value="Copacabana Vegas">Copacabana Vegas</option>
                                    <option value="Barbosa">Barbosa</option>
                                    <option value="Copacabana San Juan">Copacabana San Juan</option>
                                    <option value="Centro Administrativo">Centro Administrativo</option>
                                </select>
                            </div>

                            <div className="automatizacion-form-field">
                                <label className="automatizacion-label">Fecha Inicial:</label>
                                <input
                                    type="date"
                                    name="fecha_inicial"
                                    value={formData.fecha_inicial}
                                    onChange={handleChange}
                                    required
                                    className="automatizacion-input"
                                />
                            </div>

                            <div className="automatizacion-form-field">
                                <label className="automatizacion-label">Fecha Final:</label>
                                <input
                                    type="date"
                                    name="fecha_final"
                                    value={formData.fecha_final}
                                    onChange={handleChange}
                                    required
                                    className="automatizacion-input"
                                />
                            </div>

                            <div className="automatizacion-form-field">
                                <label className="automatizacion-label">Correo Asignado:</label>
                                <input
                                    type="email"
                                    name="correo_asignado"
                                    value={formData.correo_asignado}
                                    onChange={handleChange}
                                    required
                                    className="automatizacion-input"
                                />
                            </div>

                            <div className="automatizacion-form-field automatizacion-submit-container">
                                <button
                                    type="submit"
                                    className="automatizacion-submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="automatizacion-submitted-message">
                        <h2>¡Solicitud Enviada Exitosamente!</h2>
                    </div>
                )}

                {mostrarHistorial && (
                    <div id="automatizacion-historial" className="automatizacion-historial desplegado">
                        <h2>Historial de Automatización</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Sede</th>
                                    <th>Fecha Inicial</th>
                                    <th>Fecha Final</th>
                                    <th>Correo</th>
                                    <th>Estado</th>
                                    <th>Observación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.descripcion}</td>
                                        <td>{item.sede}</td>
                                        <td>{item.fecha_inicial}</td>
                                        <td>{item.fecha_final}</td>
                                        <td>{item.correo_asignado}</td>
                                        <td>{item.estado}</td>
                                        <td>{item.observacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <button className="floating-button" onClick={obtenerHistorial}>
                📜
            </button>
        </div>
    );
};

export { Automatizacion };