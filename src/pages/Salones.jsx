import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Link } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Salones.css";
import es from "date-fns/locale/es";
import { format, parse, startOfWeek, getDay } from "date-fns";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Salones = () => {
  const [eventos, setEventos] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false); // Controla la visibilidad del calendario

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);

    // Si se muestra el calendario, desplazarse a su posición
    if (!showCalendar) {
      setTimeout(() => {
        const calendarElement = document.getElementById("calendario");
        if (calendarElement) {
          calendarElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  const consultarReservas = async (fecha) => {
    try {
      // Cambié la URL para que apunte a Vercel
      let url = `https://reservas-backend-ten.vercel.app/consulta?fecha=${fecha}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al obtener las reservas");
      }

      const data = await response.json();

      if (data.horarios && data.horarios.length > 0) {
        const eventosFormateados = data.horarios.map((reserva) => {
          const inicio = new Date(`${reserva.fecha}T${reserva.hora_inicio}:00`);
          const fin = new Date(`${reserva.fecha}T${reserva.hora_fin}:00`);

          return {
            title: `Salón: ${reserva.salon} | Reservado por: ${reserva.nombre || "Desconocido"}`,
            start: inicio,
            end: fin,
            salon: reserva.salon,
            reservadoPor: reserva.nombre || "Desconocido",
            motivo: reserva.motivo || "Sin descripción",
          };
        });

        setEventos(eventosFormateados);
      } else {
        setEventos([]);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las reservas. Intente más tarde.", "error");
    }
  };

  useEffect(() => {
    const fechaSeleccionada = moment().format("YYYY-MM-DD");
    consultarReservas(fechaSeleccionada);
  }, []);

  const handleSelectEvent = (event) => {
    Swal.fire({
      title: "Información de la Reserva",
      html: `
        <p><b>Salón:</b> ${event.salon}</p>
        <p><b>Reservado por:</b> ${event.reservadoPor}</p>
        <p><b>Motivo:</b> ${event.motivo}</p>
        <p><b>Hora de Inicio:</b> ${moment(event.start).format("HH:mm")}</p>
        <p><b>Hora de Fin:</b> ${moment(event.end).format("HH:mm")}</p>
      `,
      icon: "info",
    });
  };

  return (
    <div className="Salones">
      {/* Logo en la esquina superior izquierda */}
      <Link to="/" className="back-logo">
        <img src="/mkicono.png" alt="Logo" className="logo-image" />
      </Link>
      <h1>Reserva tus espacios</h1>
      <div className="image-wrapper">
        <div className="image-container">
          <img
            src="/img2.jpeg"
            alt="Imagen 2"
            className="Salones-image"
            loading="lazy"
          />
          <p className="image-title">Auditorio Principal</p>
        </div>
        <div className="image-container">
          <img
            src="/img1.jpeg"
            alt="Imagen 1"
            className="Salones-image"
            loading="lazy"
          />
          <p className="image-title">Sala de Juntas</p>
        </div>
      </div>
      <Link to="/reserva" className="reserve-link">
        Reserva aquí
      </Link>

      {/* Botón flotante para mostrar/ocultar el calendario */}
      <button className="floating-calendar" onClick={toggleCalendar}>
        🗓️
      </button>

      {showCalendar && (
        <div id="calendario">
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            culture="es"
            className="calendar-container"
            messages={{
              next: "Siguiente",
              previous: "Anterior",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango.",
            }}
            style={{
              backgroundColor: "white",
              color: "black",
              height: 520,
              margin: "50px",
            }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.salon === "Sala juntas reservas"
                    ? "blue"
                    : event.salon === "Auditorio Principal"
                    ? "#89dc00"
                    : "#210d65",
                color: "white",
              },
            })}
          />
        </div>
      )}
    </div>
  );
};

export { Salones };
