import React, { useState, useEffect } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState("");
  const [isPQR, setIsPQR] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(!localStorage.getItem("chatbotTourSeen"));
  const [showInviteMessage, setShowInviteMessage] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || "https://backendpythonbot.vercel.app";

  useEffect(() => {
    if (!apiUrl) {
      console.error("⚠️ La URL de la API no está definida.");
      setError("Error de configuración. Contacta al administrador.");
    }

    const timer = setTimeout(() => {
      setShowInviteMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const sendMessage = async (messageToSend) => {
    if (!messageToSend.trim()) {
      setError("⚠️ El mensaje no puede estar vacío.");
      return;
    }

    setLoading(true);
    setError("");
    setResponses((prev) => [...prev, { text: messageToSend, user: true }]);

    try {
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      const data = await res.json();
      const botResponse = data.response;

      setResponses((prev) => [
        ...prev,
        {
          text: botResponse.includes("<") && botResponse.includes(">")
            ? <span dangerouslySetInnerHTML={{ __html: botResponse }} />
            : processLinks(botResponse),
          user: false,
        },
      ]);
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Lo siento, ocurrió un error. Inténtalo de nuevo.");
      setResponses((prev) => [...prev, { text: "Lo siento, ocurrió un error. Inténtalo de nuevo.", user: false }]);
    } finally {
      setLoading(false);
    }
  };

  const processLinks = (text) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" aria-label={`Enlace externo a ${part}`}>
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
    if (!chatbotOpen && !hasStartedChat) {
      setResponses([
        {
          text: (
            <div className="merkahorro-chatbot-welcome-message">
              <span role="img" aria-label="Emoji de saludo">👋</span> ¡Bienvenido a Merkahorro!
              <p>Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?</p>
            </div>
          ),
          user: false,
        },
      ]);
      setHasStartedChat(true);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleOptionSelect = (messageToSend) => {
    if (messageToSend === "PQR") {
      setIsPQR(true);
      setResponses((prev) => [...prev, { text: "📝 Estás escribiendo una PQR. Por favor, ingresa tu mensaje.", user: false }]);
    } else {
      sendMessage(messageToSend);
    }
    setShowMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      if (isPQR) {
        const whatsappLink = `https://wa.me/573103926576?text=${encodeURIComponent(message)}`;
        setResponses((prev) => [
          ...prev,
          {
            text: (
              <span>
                Déjanos tu PQR en el siguiente enlace:{" "}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Enlace a WhatsApp para PQR">
                  WhatsApp
                </a>.
              </span>
            ),
            user: false,
          },
        ]);
        setMessage("");
        setIsPQR(false);
      } else {
        sendMessage(message);
      }
    }
  };

  const closeWelcomeTour = () => {
    setShowWelcomeTour(false);
    localStorage.setItem("chatbotTourSeen", "true");
  };

  return (
    <>
      <button
        className="merkahorro-chatbot-icon"
        onClick={toggleChatbot}
        aria-label="Abrir chatbot de asistencia"
        title="Habla con nuestro asistente virtual"
      >
        <img src="chatbot.png" alt="Ícono del chatbot" />
      </button>

      {showInviteMessage && (
        <div className="chatbot-invite-message" role="alert" aria-label="Mensaje de invitación al chatbot">
          <p>¡Chatea con nosotros! 😊</p>
        </div>
      )}

      {showWelcomeTour && (
        <div className="chatbot-welcome-tour" role="dialog" aria-label="Tour introductorio del chatbot">
          <p>¡Haz clic en el ícono para ayuda personalizada!</p>
          <button onClick={closeWelcomeTour} aria-label="Cerrar tour introductorio">Entendido</button>
        </div>
      )}

      {chatbotOpen && (
        <div
          className={`merkahorro-chatbot-container ${chatbotOpen ? "open" : "closed"}`}
          role="dialog"
          aria-label="Chatbot de Merkahorro"
        >
          <div className="merkahorro-chatbot-header">
            <span>🤖 Merkahorro AI</span>
            <button className="merkahorro-close-chat-btn" onClick={toggleChatbot} aria-label="Cerrar chatbot">
              ×
            </button>
          </div>

          <div className="merkahorro-chat-messages" aria-live="polite">
            {error && <div className="merkahorro-error-message" role="alert">{error}</div>}
            {responses.map((response, index) => (
              <div
                key={index}
                className={`merkahorro-message ${response.user ? "merkahorro-user-message" : "merkahorro-bot-message"}`}
                aria-label={response.user ? "Mensaje del usuario" : "Respuesta del chatbot"}
              >
                {response.text}
              </div>
            ))}
          </div>

          {showMenu && hasStartedChat && (
            <div className="chatbot-menu" role="menu" aria-label="Opciones del chatbot">
              <button onClick={() => handleOptionSelect("¿Cuáles son los horarios?")}>🕒 Horarios</button>
              <button onClick={() => handleOptionSelect("¿Cuántas sedes hay?")}>📍 Sedes</button>
              <button onClick={() => handleOptionSelect("¿Cómo puedo postularme?")}>💼 Postulación</button>
              <button onClick={() => handleOptionSelect("¿Cuáles son las promociones?")}>🎉 Promociones</button>
              <button onClick={() => handleOptionSelect("¿Cómo reservo un salón?")}>📅 Reservas</button>
              <button onClick={() => handleOptionSelect("PQR")}>📋 PQR</button>
            </div>
          )}

          <button
            className="merkahorro-show-menu-btn"
            onClick={toggleMenu}
            aria-label={showMenu ? "Ocultar opciones" : "Ver opciones"}
          >
            {showMenu ? "⬆️ Ocultar" : "⬇️ Opciones"}
          </button>

          {hasStartedChat && (
            <div className="merkahorro-chat-input-container">
              <input
                className="merkahorro-input"
                type="text"
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                placeholder={isPQR ? "Escribe tu PQR..." : "Escribe tu pregunta..."}
                aria-label="Entrada de mensaje para el chatbot"
              />
              <button
                className="merkahorro-button"
                onClick={() => (isPQR ? handleKeyDown({ key: "Enter" }) : sendMessage(message))}
                disabled={loading}
                aria-label="Enviar mensaje"
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export { ChatBot };