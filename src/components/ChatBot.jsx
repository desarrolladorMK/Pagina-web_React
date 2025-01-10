import React, { useState } from 'react';
import './ChatBot.css'; // Importa tu archivo de estilos CSS

function ChatBot() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false); // Para abrir y cerrar el chatbot

    // Función para manejar el cambio del mensaje
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // Función para enviar el mensaje al backend
    const sendMessage = async (messageToSend) => {
        if (!messageToSend.trim()) return;

        setLoading(true);  // Mostrar que se está procesando la solicitud

        try {
            const res = await fetch('http://127.0.0.1:8000/ask', {
                method: 'POST',  // Cambiar de GET a POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageToSend })  // Enviar el mensaje como JSON
            });
            const data = await res.json();
            const botResponse = data.response;

            // Verificar si la respuesta contiene una URL
            if (botResponse.includes('http://') || botResponse.includes('https://')) {
                // Si la respuesta contiene una URL, no redirigir automáticamente
                setResponse(` ${botResponse}`);
            } else {
                // Si no es una URL, mostrar la respuesta normalmente
                setResponse(botResponse);
            }
        } catch (error) {
            console.error("Error:", error);
            setResponse("Lo siento, ocurrió un error.");
        } finally {
            setLoading(false);  // Ocultar el indicador de carga
        }
    };

    // Función para abrir/cerrar el chatbot
    const toggleChatbot = () => {
        setChatbotOpen(!chatbotOpen);  // Cambiar estado para abrir o cerrar el chatbot
    };

    // Función para mostrar el menú con opciones predefinidas
    const showMenu = () => {
        return (
            <div className="chatbot-menu">
                <button onClick={() => sendMessage("¿Cuáles son los horarios?")}>Horarios</button>
                <button onClick={() => sendMessage("¿Cuántas sedes hay?")}>Sedes</button>
                <button onClick={() => sendMessage("¿Cómo puedo postularme?")}>Postulación</button>
                <button onClick={() => sendMessage("¿Cuáles son las promociones?")}>Promociones</button>
            </div>
        );
    };

    // Función para renderizar la respuesta y manejar los enlaces
    const renderResponse = () => {
        const responseText = response || 'Selecciona o escribe algo...';

        // Usamos expresiones regulares para convertir los enlaces en etiquetas <a>
        const regex = /(https?:\/\/[^\s]+)/g; // Buscar URLs en la respuesta
        const formattedResponse = responseText.split(regex).map((part, index) => {
            if (index % 2 === 1) {
                return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
        });

        return formattedResponse;
    };

    return (
        <div >
            {/* Botón flotante de chatbot */}
            <button className="merkahorro-chatbot-icon" onClick={toggleChatbot}>
                <img src="chatbot.png" alt="Chatbot Icon" />
            </button>

            {/* Contenedor del chatbot */}
            {chatbotOpen && (
                <div className="merkahorro-chatbot-container">
                    <div className="merkahorro-chatbot-header">
                        <span>Pregunta a Merkahorro</span>
                        <button className="merkahorro-close-chat-btn" onClick={toggleChatbot}>
                            &times;
                        </button>
                    </div>

                    <div className="merkahorro-chat-messages">
                        {/* Mensaje de ejemplo */}
                        <div className="merkahorro-bot-message merkahorro-message">
                            {renderResponse()}
                        </div>
                    </div>

                    {/* Mostrar el menú interactivo con opciones */}
                    <div className="chatbot-options">
                        {showMenu()}
                    </div>

                    <div className="merkahorro-chat-input-container">
                        <input
                            className="merkahorro-input"
                            type="text"
                            value={message}
                            onChange={handleMessageChange}
                            placeholder="Escribe tu pregunta..."
                        />
                        <button
                            className="merkahorro-button"
                            onClick={() => sendMessage(message)}
                            disabled={loading}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export { ChatBot };
