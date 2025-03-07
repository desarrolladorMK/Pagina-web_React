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

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Salones = () => {
  const [eventos, setEventos] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filtroSalon, setFiltroSalon] = useState("todos");

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      setTimeout(() => {
        document.getElementById("calendario")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const consultarReservas = async (fecha) => {
    try {
      const url = `https://reservas-backend-ten.vercel.app/consulta?fecha=${fecha}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener las reservas");
      const data = await response.json();

      const eventosFormateados = data.horarios.map((reserva) => ({
        title: `Salón: ${reserva.salon} | ${reserva.nombre || "Desconocido"}`,
        start: new Date(`${reserva.fecha}T${reserva.hora_inicio}:00`),
        end: new Date(`${reserva.fecha}T${reserva.hora_fin}:00`),
        salon: reserva.salon,
        reservadoPor: reserva.nombre || "Desconocido",
        motivo: reserva.motivo || "Sin descripción",
      }));
      setEventos(eventosFormateados);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las reservas.", "error");
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

  const handleSelectSlot = (slotInfo) => {
    const eventosDelDia = eventosFiltrados.filter((evento) =>
      moment(evento.start).isSame(slotInfo.start, "day")
    );
    if (eventosDelDia.length > 0) {
      const listaEventos = eventosDelDia
        .map(
          (e) => `
          <li>
            <b>${e.salon}</b> - ${moment(e.start).format("HH:mm")} a ${moment(e.end).format("HH:mm")}<br>
            Reservado por: ${e.reservadoPor} | Motivo: ${e.motivo}
          </li>`
        )
        .join("");
      Swal.fire({
        title: `Reservas del ${moment(slotInfo.start).format("DD/MM/YYYY")}`,
        html: `<ul style="text-align: left;">${listaEventos}</ul>`,
        icon: "info",
        confirmButtonText: "Cerrar",
      });
    }
  };

  // Filtrar eventos y asegurarse de que solo los filtrados se pasen al calendario
  const eventosFiltrados =
    filtroSalon === "todos"
      ? eventos
      : eventos.filter((e) => e.salon === filtroSalon);

  return (
    <div className="Salones">
      <Link to="/" className="back-logo">
        <img src="/mkicono.png" alt="Logo" className="logo-image" />
      </Link>
      <h1>Reserva tus espacios</h1>
      <div className="image-wrapper">
        <div className="image-container">
          <img src="/img2.jpeg" alt="Auditorio" className="Salones-image" loading="lazy" />
          <p className="image-title">Auditorio Principal</p>
        </div>
        <div className="image-container">
          <img src="/img1.jpeg" alt="Sala" className="Salones-image" loading="lazy" />
          <p className="image-title">Sala de Juntas</p>
        </div>
      </div>
      <Link to="/reserva" className="reserve-link">
        Reserva aquí
      </Link>
      <button className="floating-calendar" onClick={toggleCalendar}>
        🗓️
      </button>

      {showCalendar && (
        <div id="calendario">
          <div className="filtro-salon">
            <label>Filtrar por salón: </label>
            <select
              value={filtroSalon}
              onChange={(e) => setFiltroSalon(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="Sala de Juntas">Sala de Juntas</option>
              <option value="Auditorio Principal">Auditorio Principal</option>
            </select>
          </div>
          <Calendar
            localizer={localizer}
            events={eventosFiltrados} // Solo pasar eventos filtrados
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
            style={{ backgroundColor: "white", color: "black", height: 520, margin: "50px" }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.salon === "Sala de Juntas"
                    ? "blue"
                    : event.salon === "Auditorio Principal"
                    ? "#89dc00"
                    : "#210d65",
                color: "white",
                fontSize: "12px", // Tamaño legible
                padding: "2px 5px", // Espaciado interno
                margin: "1px 0", // Espacio entre eventos
              },
            })}
            dayPropGetter={(date) => {
              const eventosDelDia = eventosFiltrados.filter((e) =>
                moment(e.start).isSame(date, "day")
              );
              if (eventosDelDia.length > 2) {
                return {
                  className: "day-with-many-events",
                  style: { position: "relative" },
                };
              }
              return {};
            }}
          />
        </div>
      )}
    </div>
  );
};

export { Salones };