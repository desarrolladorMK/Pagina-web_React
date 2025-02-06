import React, { useState, useEffect } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState('');
  const [isPQR, setIsPQR] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false); // Control si el chat comenzó
  const apiUrl = import.meta.env.VITE_API_URL || 'https://backendpythonbot.vercel.app';

  useEffect(() => {
    if (!apiUrl) {
      console.error('⚠️ La URL de la API no está definida.');
      setError('Error de configuración. Contacta al administrador.');
    }
  }, [apiUrl]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

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
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      const botResponse = data.response;

      if (botResponse.includes('<') && botResponse.includes('>')) {
        setResponse(<span dangerouslySetInnerHTML={{ __html: botResponse }} />);
      } else {
        setResponse(processLinks(botResponse));
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Lo siento, ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const processLinks = (text) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      } else {
        return part;
      }
    });
  };

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
    if (!chatbotOpen) {
      // Mostrar el mensaje de bienvenida con estilo llamativo
      setResponse(
        <div className="merkahorro-chatbot-welcome-message">
          <span>👋 ¡Bienvenido!</span>
          <p>
            Soy el asistente de Merkahorro. Estoy aquí para brindarte información
            útil sobre nuestras sedes, horarios, promociones y mucho más. ¿En qué
            puedo ayudarte hoy?
          </p>
        </div>
      );
      setHasStartedChat(true);  // Iniciar el chat
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleOptionSelect = (messageToSend) => {
    if (messageToSend === "PQR") {
      setIsPQR(true);
      setResponse("📝 Estás escribiendo una PQR. Por favor, ingresa tu mensaje.");
    } else {
      sendMessage(messageToSend);
    }
    setShowMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      if (isPQR) {
        const whatsappLink = `https://wa.me/573103926576?text=${encodeURIComponent(message)}`;
        setResponse(
          <span>
            Dejanos tu PQR en el siguiente enlace:{' '}
           {/*  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>. */}
          </span>
        );
        setMessage('');
        setIsPQR(false);
      } else {
        sendMessage(message);
      }
    }
  };

  const handleResetChat = () => {
    setIsPQR(false);
    setMessage('');
    setResponse('');
  };

  return (
    <div className="floating-buttons">
      <button className="merkahorro-chatbot-icon" onClick={toggleChatbot}>
        <img src="chatbot.png" alt="Chatbot Icon" />
      </button>

      {chatbotOpen && (
        <div className="merkahorro-chatbot-container">
          <div className="merkahorro-chatbot-header">
            <span>🤖 Pregunta a Merkahorro AI</span>
            <button className="merkahorro-close-chat-btn" onClick={toggleChatbot}>
              &times;
            </button>
          </div>

          <div className="merkahorro-chat-messages">
            {error && <div className="merkahorro-error-message">{error}</div>}
            <div className="merkahorro-bot-message merkahorro-message">
              {loading ? '⏳ Escribiendo...' : response}
            </div>
          </div>

          {showMenu && hasStartedChat && (
            <div className="chatbot-menu">
              <button onClick={() => handleOptionSelect("¿Cuáles son los horarios?")}>🕒 Horarios</button>
              <button onClick={() => handleOptionSelect("¿Cuántas sedes hay?")}>📍 Sedes</button>
              <button onClick={() => handleOptionSelect("¿Cómo puedo postularme?")}>💼 Postulación</button>
              <button onClick={() => handleOptionSelect("¿Cuáles son las promociones?")}>🎉 Promociones</button>
              <button onClick={() => handleOptionSelect("¿Cómo reservo un salón?")}>📅 Reservas</button>
              <button onClick={() => handleOptionSelect("PQR")}>📋 PQR</button>
            </div>
          )}

          <button className="merkahorro-show-menu-btn" onClick={toggleMenu}>
            {showMenu ? '⬆️ Ocultar opciones' : '⬇️ Ver opciones'}
          </button>

          {/* Aquí mostramos el campo de entrada de texto y el botón de envío */}
          {hasStartedChat && (
            <div className="merkahorro-chat-input-container">
              <input
                className="merkahorro-input"
                type="text"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                placeholder={isPQR ? "Escribe tu PQR..." : "Escribe tu pregunta..."}
              />
              <button
                className="merkahorro-button"
                onClick={() => {
                  if (isPQR) {
                    const whatsappLink = `https://wa.me/573245597862?text=${encodeURIComponent(message)}`;
                    setResponse(
                      <span>
                        Dejanos tu PQR en el siguiente enlace:{' '}
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          WhatsApp
                        </a>.
                      </span>
                    );
                    setMessage('');
                    setIsPQR(false);
                  } else {
                    sendMessage(message);
                  }
                }}
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
