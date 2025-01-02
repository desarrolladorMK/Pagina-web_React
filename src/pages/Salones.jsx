import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Link } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import "moment/locale/es"; // Importar idioma español
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Salones.css"; // Actualización del nombre del archivo CSS
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

  const consultarReservas = async (fecha) => {
    try {
      let url = `https://reservas-zer3.onrender.com/consulta?fecha=${fecha}`;
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
            title: `Salón: ${reserva.salon} | Reservado por: ${
              reserva.nombre || "Desconocido"
            }`,
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
      Swal.fire(
        "Error",
        "No se pudieron cargar las reservas. Intente más tarde.",
        "error"
      );
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
      <h1>Reserva tus espacios</h1>

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

      <Link to="/reservas" className="reserve-link">
        Reserva aquí
      </Link>

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
                ? "red"
                : "gray",
            color: "white",
          },
        })}
      />
    </div>
  );
};

export { Salones };
