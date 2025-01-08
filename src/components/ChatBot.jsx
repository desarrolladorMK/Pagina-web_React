import React, { useState } from "react";
import axios from "axios";
import "./ChatBot.css"; // Importa el archivo CSS

const ChatBot = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
  
    // Función para manejar la entrada del usuario
    const handleChange = (event) => {
      setQuery(event.target.value);
    };
  
    // Función para enviar la consulta al backend
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
  
      try {
        const result = await axios.post("http://127.0.0.1:8000/chatbot/", {
          query: query,
        });
        
        // Si la respuesta es un array, actualízalo correctamente
        if (Array.isArray(result.data.answer)) {
          setResponse(result.data.answer);
        } else {
          setResponse([result.data.answer]); // Si no es un array, lo convertimos en uno
        }
  
      } catch (error) {
        console.error("Error al contactar el backend:", error);
        setResponse(["Lo siento, ocurrió un error."]);
      } finally {
        setLoading(false);
      }
    };
  
    // Función para abrir/cerrar el chat
    const toggleChat = () => {
      setChatOpen(!chatOpen);
    };
  
    return (
      <div className="chat-body">
        {/* Botón flotante del chatbot */}
        <button className="merkahorro-chatbot-icon" onClick={toggleChat}>
          <img src="/chatbot.png" alt="Chatbot Icon" />
        </button>
  
        {/* Ventana del Chat */}
        {chatOpen && (
          <div className="merkahorro-chatbot-container">
            <div className="merkahorro-chatbot-header">
              <span>¡Hola! ¿En qué te puedo ayudar hoy?</span>
              <button onClick={toggleChat} className="merkahorro-close-chat-btn">❌</button>
            </div>
            <div className="merkahorro-chat-messages">
              {/* Mensajes del chatbot */}
              {response.length === 0 && (
                <div className="merkahorro-message merkahorro-bot-message">¡Hola! ¿En qué puedo ayudarte?</div>
              )}
              {response.map((msg, index) => (
                <div key={index} className="merkahorro-message merkahorro-bot-message">
                  {msg}
                </div>
              ))}
              {loading && <div className="merkahorro-message merkahorro-bot-message">Cargando...</div>}
            </div>
            <form onSubmit={handleSubmit} className="merkahorro-chat-input-container">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Escribe tu pregunta..."
                required
                className="merkahorro-input"
              />
              <button type="submit" disabled={loading} className="merkahorro-button">
                {loading ? "Cargando..." : "Enviar"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };
  
  export { ChatBot };
