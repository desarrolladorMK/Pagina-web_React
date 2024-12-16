import React from "react";
import "./Vacantes.css";
import { Link } from "react-router-dom";

const Vacantes = () => {
  const vacantes = [
    {
      id: 1,
      titulo: "Cajero",
      descripcion:
        "Responsable de realizar transacciones de caja, atención al cliente y manejo de efectivo.",
      requisitos:
        "Experiencia mínima de 6 meses en caja, habilidades numéricas y atención al cliente.",
      salario: "Salario: $1,200,000 - $1,500,000 COP",
      imagen:
        "https://img.freepik.com/foto-gratis/cajero-afroamericano-sonriente-sentado-caja_74855-3297.jpg?semt=ais_hybrid",
    },
    {
      id: 2,
      titulo: "Carnicero",
      descripcion:
        "Responsable del corte, desposte y empaque de productos cárnicos.",
      requisitos:
        "Experiencia mínima de 1 año en carnicería, conocimiento en cortes y manipulación de alimentos.",
      salario: "Salario: $1,400,000 - $1,700,000 COP",
      imagen:
        "https://media.istockphoto.com/id/515815838/es/foto/medio-de-carnicero-con-el-cliente.jpg?s=612x612&w=0&k=20&c=X_3JXkOa8HZ9-FcopX_cAVDbR5UEY-sd1Ps48VbSCuM=",
    },
    {
      id: 3,
      titulo: "Domiciliario",
      descripcion:
        "Encargado de realizar entregas a domicilio en un área asignada.",
      requisitos:
        "Moto propia, licencia de conducción vigente y conocimiento de la zona.",
      salario: "Salario: $1,100,000 COP + Bonificaciones",
      imagen:
        "https://www.valoraanalitik.com/wp-content/uploads/2023/12/rappi-domiciliarios-2-696x406.jpg",
    },
  ];

  return (
    
    <div className="vacantes-container">
      <div className="logo-container">
        <a href="/">
          <img src="/logoMK.png" alt="Logo" className="logo-vacantes" />
        </a>
      </div>

      <h2 className="titulo-vacantes">Vacantes Disponibles</h2>
      <div className="vacantes-grid">
        {vacantes.map((vacante) => (
          <div className="vacante-card" key={vacante.id}>
            <img
              src={vacante.imagen}
              alt={vacante.titulo}
              className="vacante-imagen"
            />
            <h3>{vacante.titulo}</h3>
            <p>
              <strong>Descripción:</strong> {vacante.descripcion}
            </p>
            <p>
              <strong>Requisitos:</strong> {vacante.requisitos}
            </p>
            <p>
              <strong>{vacante.salario}</strong>
            </p>
            <button className="btn-aplicar">
              <Link className="aplicar-color" to="/aplicar">
                Aplicar
              </Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Vacantes };
