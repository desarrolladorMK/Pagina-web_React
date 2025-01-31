import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AprobarRechazar.css';

const AprobarRechazar = () => {
    const [estado, setEstado] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [decisionTomada, setDecisionTomada] = useState(false);

    useEffect(() => {
        // Obtener el token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl);
    }, []);

    const handleSubmit = async (decision) => {
        setLoading(true);
        try {
            const response = await axios.post('https://backend-gastos.vercel.app/api/requerimientos/decidirRequerimiento', {
                token,
                decision: decision,
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
                    <div className="form-group">
                        <div className="decision-buttons">
                            <button
                                type="button"
                                className="btn-approve"
                                onClick={() => handleSubmit('Necesario')}
                                disabled={loading}
                            >
                                Aprobar
                            </button>
                            <button
                                type="button"
                                className="btn-reject"
                                onClick={() => handleSubmit('No necesario')}
                                disabled={loading}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mensaje">{mensaje}</p>
                )}
                {loading && <div className="loading-spinner"></div>}
            </div>
        </div>
    );
};

export { AprobarRechazar };