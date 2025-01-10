import React, { useState } from 'react';
import './ChatBot.css'; // Importa tu archivo de estilos CSS

function ChatBot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false); // Para abrir y cerrar el chatbot
  const [showMenu, setShowMenu] = useState(false); // Para alternar la visibilidad del menú de opciones

  // Función para manejar el cambio del mensaje
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Función para enviar el mensaje al backend
  const sendMessage = async (messageToSend) => {
    if (!messageToSend.trim()) return;

    setLoading(true);  // Mostrar que se está procesando la solicitud

    // Obtener la URL de la API desde la variable de entorno
    const apiUrl = process.env.REACT_APP_API_URL || 'https://backendpythonbot.vercel.app'; // Usa localhost si no está configurada la variable de entorno

    try {
      const res = await fetch(`${apiUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend })  // Enviar el mensaje como JSON
      });
      const data = await res.json();
      const botResponse = data.response;

      // Verificar si la respuesta contiene una URL
      if (botResponse.includes('http://') || botResponse.includes('https://')) {
        setResponse(` ${botResponse}`);
      } else {
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

  // Función para alternar la visibilidad del menú de opciones
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para manejar la selección de una opción y cerrar el menú
  const handleOptionSelect = (messageToSend) => {
    sendMessage(messageToSend);  // Enviar el mensaje
    setShowMenu(false);  // Cerrar el menú automáticamente después de la selección
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

  // Función para manejar el evento de presionar "Enter" en el input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(message);  // Enviar el mensaje cuando se presiona "Enter"
    }
  };

  return (
    <div className='floating-buttons'>
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
            {/* Mostrar la respuesta */}
            <div className="merkahorro-bot-message merkahorro-message">
              {renderResponse()}
            </div>
          </div>

          {/* Mostrar el menú interactivo con opciones */}
          {showMenu && (
            <div className="chatbot-menu">
              <button onClick={() => handleOptionSelect("¿Cuáles son los horarios?")}>Horarios</button>
              <button onClick={() => handleOptionSelect("¿Cuántas sedes hay?")}>Sedes</button>
              <button onClick={() => handleOptionSelect("¿Cómo puedo postularme?")}>Postulación</button>
              <button onClick={() => handleOptionSelect("¿Cuáles son las promociones?")}>Promociones</button>
              <button onClick={() => handleOptionSelect("¿Cómo reservo un salón?")}>Reservas</button>
            </div>
          )}

          {/* Botón para alternar el menú */}
          {showMenu ? (
            <button className="merkahorro-show-menu-btn" onClick={toggleMenu}>
              Ocultar opciones
            </button>
          ) : (
            <button className="merkahorro-show-menu-btn" onClick={toggleMenu}>
              Ver opciones
            </button>
          )}

          {/* Campo de entrada para escribir el mensaje */}
          {!showMenu && (
            <div className="merkahorro-chat-input-container">
              <input
                className="merkahorro-input"
                type="text"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}  // Agregar evento de teclado para "Enter"
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
          )}
        </div>
      )}
    </div>
  );
}

export { ChatBot };
