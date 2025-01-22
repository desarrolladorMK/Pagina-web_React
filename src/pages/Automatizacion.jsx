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

        // Validar que todos los campos estén completos
        if (!descripcion || !pdf || !sede || !fechaInicial || !fechaFinal || !correo) {
            alert('Por favor, complete todos los campos antes de enviar.');
            return;
        }

        // Validar el formato del archivo
        if (pdf.type !== 'application/pdf') {
            alert('El archivo debe ser un PDF.');
            return;
        }

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

            console.log(response.data); // Manejar los datos de respuesta

            // Mostrar alerta de éxito
            alert('Correo enviado exitosamente y datos guardados en la base de datos.');

            // Limpiar los campos del formulario
            setDescripcion('');
            setPdf(null);
            setSede('');
            setFechaInicial('');
            setFechaFinal('');
            setCorreo('');
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            if (error.response) {
                alert('Hubo un error al enviar el formulario: ' + error.response.data.error);
            } else if (error.request) {
                alert('No se recibió respuesta del servidor.');
            } else {
                alert('Ocurrió un error desconocido.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Descripción:</label>
                <input
                    type="text"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div>
                <label>Archivo PDF:</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files[0])}
                />
            </div>

            <div>
                <label>Sede:</label>
                <input
                    type="text"
                    placeholder="Sede"
                    value={sede}
                    onChange={(e) => setSede(e.target.value)}
                />
            </div>

            <div>
                <label>Fecha Inicial:</label>
                <input
                    type="date"
                    value={fechaInicial}
                    onChange={(e) => setFechaInicial(e.target.value)}
                />
            </div>

            <div>
                <label>Fecha Final:</label>
                <input
                    type="date"
                    value={fechaFinal}
                    onChange={(e) => setFechaFinal(e.target.value)}
                />
            </div>

            <div>
                <label>Correo Asignado:</label>
                <input
                    type="email"
                    placeholder="Correo Asignado"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
            </div>

            <button type="submit">Enviar</button>
        </form>
    );
}

export { Automatizacion };

