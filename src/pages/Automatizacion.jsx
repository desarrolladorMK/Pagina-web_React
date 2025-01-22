import React, { useState } from 'react';
import axios from 'axios';

function Automatizacion() {
    const [descripcion, setDescripcion] = useState('');
    const [pdf, setPdf] = useState(null);
    const [sede, setSede] = useState('');
    const [fechaInicial, setFechaInicial] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');
    const [correo, setCorreo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crea un FormData para manejar el archivo PDF
        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('pdf', pdf);
        formData.append('sede', sede);
        formData.append('fecha_inicial', fechaInicial);
        formData.append('fecha_final', fechaFinal);
        formData.append('correo_asignado', correo);

        try {
            // Imprimir los datos de FormData para depurar
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            // Enviar los datos al backend
            const response = await axios.post('https://backend-cristian.vercel.app/api/enviar-email', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data); // Aquí podrías manejar los datos que regresa el backend

            // Alerta de éxito
            alert('Correo enviado exitosamente');


        } catch (error) {
            console.error('Error al enviar el correo:', error);
            if (error.response) {
                alert('Hubo un error al enviar el correo: ' + error.response.data.error);
            } else if (error.request) {
                alert('No se recibió respuesta del servidor');
            } else {
                alert('Hubo un error desconocido');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <input
                type="file"
                onChange={(e) => setPdf(e.target.files[0])}
            />
            <input
                type="text"
                placeholder="Sede"  // Cambié 'Sedes' a 'Sede'
                value={sede}
                onChange={(e) => setSede(e.target.value)}  // Cambié 'setSedes' a 'setSede'
            />
            <input
                type="date"
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
            />
            <input
                type="date"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
            />
            <input
                type="email"
                placeholder="Correo Asignado"  // Cambié 'Correo' a 'Correo Asignado'
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}  // Cambié 'setCorreo' a 'setCorreo'
            />
            <button type="submit">Enviar</button>
        </form>
    );
}

export { Automatizacion };
