import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AprobarRechazar.css';

const AprobarRechazar = () => {
    const [estado, setEstado] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        // Obtener el token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://backend-gastos.vercel.app/api/requerimientos/decidir', {
                token,
                decision: estado,
            });
            setMensaje(response.data.message);
        } catch (error) {
            console.error('Error al enviar la decisión:', error);
            setMensaje('Hubo un error al enviar tu decisión. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="aprobar-rechazar-container">
            <div className="logo-container">
                <img src="https://www.merkahorro.com/logoMK.png" alt="Logo de la Empresa" className="logo" />
            </div>
            <h1 className="header">Decidir Requerimiento de Gasto</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="estado">Decisión:</label>
                    <select
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                        className="input"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="Aprobado">Aprobar</option>
                        <option value="Rechazado">Rechazar</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Enviar</button>
            </form>
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export { AprobarRechazar };