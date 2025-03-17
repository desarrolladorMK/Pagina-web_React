import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const correo = event.target.correo.value;
    const password = event.target.password.value;

    const credenciales = [
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_1 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_1 || "",
        redirect: "/acceso", //developersmk@merkahorrosas.com
        routes: [
          { path: "/postulacionesTable", label: "Base de datos Postulaciones" },
          { path: "/historialformulario", label: "Historial formulario Perfil" },
          { path: "/automatizacion", label: "Reposiciones Fruver" },
          { path: "/historialtransporte", label: "Historial de Transporte" },
          { path: "/solicitudaprobacion", label: "Perfil gestión humana" },
          { path: "/historialgastos", label: "Historial de Gastos" },
          { path: "/formularioperfil", label: "Formulario Perfil" },
          { path: "/transporte", label: "Transporte" },
          { path: "/salones", label: "Reserva de salones" },
          { path: "/gastos", label: "Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_2 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_2 || "",
        redirect: "/acceso", //basededatos@gmail.com
        routes: [
          { path: "/postulacionesTable", label: "Base de datos Postulaciones" },
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialformulario", label: "Historial formulario Perfil" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_3 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_3 || "",
        redirect: "/gastos", //gastosmerkahorro@gmail.com
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_4 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_4 || "",
        redirect: "/acceso", //Auditoriafruver@merkahorrosas.com
        routes: [
          { path: "/automatizacion", label: "Reposiciones Fruver" },
          { path: "/salones", label: "Reserva de salones" },
          { path: "/gastos", label: "Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_5 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_5 || "",
        redirect: "/acceso", //operaciones@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/historialgastos", label: "Historial de Gastos" },
          { path: "/historialtransporte", label: "Historial de Transporte" },
          { path: "/automatizacion", label: "Reposiciones Fruver" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_6 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_6 || "",
        redirect: "/acceso", //sistemas@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_7 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_7 || "",
        redirect: "/acceso", //juanmerkahorro@gmail.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/gastos", label: "Gastos" },
          { path: "/historialgastos", label: "Historial de Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_8 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_8 || "",
        redirect: "/acceso", //almacen@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_9 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_9 || "",
        redirect: "/acceso", //analista@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/transporte", label: "Transporte" },
          { path: "/historialtransporte", label: "Historial de Transporte" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_10 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_10 || "",
        redirect: "/acceso", //contabilidad@merkahorrosas.com
        routes: [
          { path: "/historialgastos", label: "Historial de Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_11 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_11 || "",
        redirect: "/acceso", //auxoperaciones@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_12 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_12 || "",
        redirect: "/acceso", //operacionescomerciales@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_13 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_13 || "",
        redirect: "/acceso", //johanmerkahorro777@gmail.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialgastos", label: "Historial de Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_14 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_14 || "",
        redirect: "/acceso", //gestionhumana@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/solicitudaprobacion", label: "Perfil gestión humana" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_15 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_15 || "",
        redirect: "/acceso", //analistajuniordh@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/postulacionesTable", label: "Base de datos Postulaciones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_16 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_16 || "",
        redirect: "/acceso", //inventarios@merkahorrosas.com
        routes: [
          { path: "/gastos", label: "Gastos" },
          { path: "/salones", label: "Reserva de salones" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_17 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_17 || "",
        redirect: "/acceso", //gerencia1@merkahorrosas.com
        routes: [
          { path: "/postulacionesTable", label: "Base de datos Postulaciones" },
          { path: "/automatizacion", label: "Reposiciones Fruver" },
          { path: "/historialtransporte", label: "Historial de Transporte" },
          { path: "/solicitudaprobacion", label: "Perfil gestión humana" },
          { path: "/historialgastos", label: "Historial de Gastos" },
          { path: "/transporte", label: "Transporte" },
          { path: "/reserva", label: "Reservas" },
          { path: "/gastos", label: "Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_18 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_18 || "",
        redirect: "/acceso", //fruver@merkahorrosas.com
        routes: [
          { path: "/transporte", label: "Transporte" },
          { path: "/gastos", label: "Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_19 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_19 || "",
        redirect: "/acceso", //analistadebienestar@merkahorrosas.com
        routes: [
          { path: "/historialformulario", label: "Historial formulario Perfil" },
        ],
      },
    ];

    const usuarioValido = credenciales.find(
      (credencial) => credencial.correo === correo && credencial.password === password
    );

    if (usuarioValido) {
      console.log("Inicio de sesión exitoso");
      setError("");
      sessionStorage.setItem("correo_empleado", correo);
      navigate(usuarioValido.redirect, { state: { correoUsuario: correo, opciones: usuarioValido.routes } });
    } else {
      console.log("Inicio de sesión fallido");
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="body-login">
      <div className="logo-containermk">
        <a href="/">
          <img src="/logoMK.png" alt="Logo" />
        </a>
      </div>
      <div className="grad"></div>
      <div className="login-box">
        <h2>Inicio De Sesión</h2>
        <form className="form-login" onSubmit={handleLogin}>
          <div className="user-box">
            <input type="text" name="correo" required />
            <label>Correo</label>
          </div>
          <div className="user-box">
            <input type="password" name="password" required />
            <label>Contraseña</label>
          </div>
          <button type="submit" className="ingresar-login">Ingresar</button>
        </form>
        {error && <p className="error-login">{error}</p>}
      </div>
    </div>
  );
};

export { Login };