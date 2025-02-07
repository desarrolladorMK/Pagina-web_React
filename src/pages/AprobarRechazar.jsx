import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AprobarRechazar.css';

const AprobarRechazar = () => {
    const [estado, setEstado] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [decisionTomada, setDecisionTomada] = useState(false);
    const [observacion, setObservacion] = useState(''); // Nuevo estado para observación

    useEffect(() => {
        // Obtener el token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl);
    }, []);

    const handleSubmit = async (decision) => {
        setLoading(true);
        try {
            console.log("Enviando datos:", { token, decision, observacion }); // Verifica qué se está enviando
            const response = await axios.post('https://backend-gastos.vercel.app/api/requerimientos/decidirRequerimiento', {
                token,
                decision: decision,
                observacion: observacion
            });
            setMensaje(response.data.message);
            setDecisionTomada(true);
            alert(`Decisión de ${decision} enviada exitosamente.`);
        } catch (error) {
            console.error('Error al enviar la decisión:', error);
            setMensaje('Hubo un error al enviar tu decisión. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="aprobar-rechazar-container">
            <div className="logo-container-aprobar">
                <a href="/">
                    <img src="logoMK.png" alt="Logo Merkahorro" />
                </a>
            </div>
            <h1 className="header-gastos">Decidir Requerimiento de Gasto</h1>
            <div className="form">
                {!decisionTomada ? (
                    <>
                        {/* Campo para ingresar la observación */}
                        <div className="form-group">
                            <label htmlFor="observacion" className="form-label">Observación:</label>
                            <textarea
                                id="observacion"
                                name="observacion"
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                                className="observacion-input"
                                placeholder="Importante: decir quien esta realizando la observación."
                            />
                        </div>
                        <div className="form-group">
                            <div className="decision-buttons">
                                <button
                                    type="button"
                                    className="btn-approve"
                                    onClick={() => handleSubmit('Necesario')}
                                    disabled={loading}
                                >
                                    Necesario
                                </button>
                                <button
                                    type="button"
                                    className="btn-reject"
                                    onClick={() => handleSubmit('No necesario')}
                                    disabled={loading}
                                >
                                    No necesario
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="mensaje">{mensaje}</p>
                )}
                {loading && <div className="loading-spinner"></div>}
            </div>
        </div>
    );
};

export { AprobarRechazar };
