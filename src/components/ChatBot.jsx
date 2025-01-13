import React, { useState, useEffect } from 'react';
import './ChatBot.css'; // Importa tu archivo de estilos CSS

function ChatBot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false); // Para abrir y cerrar el chatbot
  const [showMenu, setShowMenu] = useState(false); // Para alternar la visibilidad del menú de opciones
  const [error, setError] = useState('');

  // Validar si la URL de la API está configurada correctamente
  const apiUrl = import.meta.env.VITE_API_URL || 'https://backendpythonbot.vercel.app';

  useEffect(() => {
    if (!apiUrl) {
      console.error('⚠️ La URL de la API no está definida.');
      setError('Error de configuración. Contacta al administrador.');
    }
  }, [apiUrl]);

  // Función para manejar el cambio del mensaje
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Función para enviar el mensaje al backend
  const sendMessage = async (messageToSend) => {
    if (!messageToSend.trim()) {
      setError('⚠️ El mensaje no puede estar vacío.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      const botResponse = data.response;

      // Validar la respuesta del bot
      if (botResponse.includes('http://') || botResponse.includes('https://')) {
        setResponse(`🔗 ${botResponse}`);
      } else {
        setResponse(botResponse);
      }

    } catch (error) {
      console.error("❌ Error:", error);
      setError("Lo siento, ocurrió un error. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir/cerrar el chatbot
  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  // Función para alternar la visibilidad del menú de opciones
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para manejar la selección de una opción
  const handleOptionSelect = (messageToSend) => {
    sendMessage(messageToSend);
    setShowMenu(false);
  };

  // Función para renderizar la respuesta y manejar enlaces
  const renderResponse = () => {
    const responseText = response || 'Selecciona o escribe algo...';
    const regex = /(https?:\/\/[^\s]+)/g;

    return responseText.split(regex).map((part, index) =>
      regex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  // Enviar el mensaje cuando se presiona "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage(message);
    }
  };

  return (
    <div className='floating-buttons'>
      {/* Botón flotante del chatbot */}
      <button className="merkahorro-chatbot-icon" onClick={toggleChatbot}>
        <img src="chatbot.png" alt="Chatbot Icon" />
      </button>

      {/* Contenedor del chatbot */}
      {chatbotOpen && (
        <div className="merkahorro-chatbot-container">
          <div className="merkahorro-chatbot-header">
            <span>🤖 Pregunta a Merkahorro</span>
            <button className="merkahorro-close-chat-btn" onClick={toggleChatbot}>
              &times;
            </button>
          </div>

          <div className="merkahorro-chat-messages">
            {error && <div className="merkahorro-error-message">{error}</div>}
            <div className="merkahorro-bot-message merkahorro-message">
              {loading ? '⏳ Procesando tu solicitud...' : renderResponse()}
            </div>
          </div>

          {/* Mostrar menú interactivo */}
          {showMenu && (
            <div className="chatbot-menu">
              <button onClick={() => handleOptionSelect("¿Cuáles son los horarios?")}>🕒 Horarios</button>
              <button onClick={() => handleOptionSelect("¿Cuántas sedes hay?")}>📍 Sedes</button>
              <button onClick={() => handleOptionSelect("¿Cómo puedo postularme?")}>💼 Postulación</button>
              <button onClick={() => handleOptionSelect("¿Cuáles son las promociones?")}>🎉 Promociones</button>
              <button onClick={() => handleOptionSelect("¿Cómo reservo un salón?")}>📅 Reservas</button>
            </div>
          )}

          {/* Botón para alternar el menú */}
          <button className="merkahorro-show-menu-btn" onClick={toggleMenu}>
            {showMenu ? '⬆️ Ocultar opciones' : '⬇️ Ver opciones'}
          </button>

          {/* Campo de entrada */}
          {!showMenu && (
            <div className="merkahorro-chat-input-container">
              <input
                className="merkahorro-input"
                type="text"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
              />
              <button
                className="merkahorro-button"
                onClick={() => sendMessage(message)}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { ChatBot };
