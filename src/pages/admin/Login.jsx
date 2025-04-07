import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const correo = event.target.email.value.trim(); // Cambiado de "correo" a "email"
    const password = event.target.password.value.trim();

    if (!correo || !password) {
      setError("Por favor, complete todos los campos");
      setLoading(false);
      return;
    }

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
          { path: "/historialcartera", label: "Historial Cartera" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_2 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_2 || "",
        redirect: "/acceso", //analistadh@merkahorrosas.com
        routes: [
          { path: "/postulacionesTable", label: "Base de datos Postulaciones" },
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialformulario", label: "Historial formulario Perfil" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_3 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_3 || "",
        redirect: "/gastos",
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
          { path: "/historialcartera", label: "Historial Cartera" }, 
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
        redirect: "/acceso",
        routes: [{ path: "/historialgastos", label: "Historial de Gastos" }],
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
          { path: "/postulacionesTable", label: "Base de datos Postulaciones" },
          { path: "/historialformulario", label: "Historial formulario Perfil" },
          { path: "/automatizacion", label: "Reposiciones Fruver" },
          { path: "/historialtransporte", label: "Historial de Transporte" },
          { path: "/solicitudaprobacion", label: "Perfil gestión humana" },
          { path: "/historialgastos", label: "Historial de Gastos" },
          { path: "/formularioperfil", label: "Formulario Perfil" },
          { path: "/transporte", label: "Transporte" },
          { path: "/salones", label: "Reserva de salones" },
          { path: "gastos", label: "Gastos" },
          { path: "/historialcartera", label: "Historial Cartera" },
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
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_20 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_20 || "",
        redirect: "/acceso", //desarrollo@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/gastos", label: "Gastos" },
          { path: "/historialgastos", label: "Historial de Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_21 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_21 || "",
        redirect: "/acceso", //mantenimiento@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/gastos", label: "Gastos" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_22 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_22 || "",
        redirect: "/acceso", //sistemageneralsst@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialformulario", label: "Historial formulario Perfil" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_23 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_23 || "",
        redirect: "/acceso", //auxiliarsst@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialformulario", label: "Historial formulario Perfil" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_24 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_24 || "",
        redirect: "/acceso", //cartera@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialcartera", label: "Historial Cartera" },
        ],
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_25 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_25 || "",
        redirect: "/acceso", //analistatesoreria@merkahorrosas.com
        routes: [
          { path: "/salones", label: "Reserva de salones" },
          { path: "/historialcartera", label: "Historial Cartera" },
        ],
      },
    ];

    const usuarioValido = credenciales.find(
      (credencial) =>
        credencial.correo === correo && credencial.password === password
    );

    try {
      if (usuarioValido) {
        sessionStorage.setItem("correo_empleado", correo);
        navigate(usuarioValido.redirect, {
          state: {
            correoUsuario: correo,
            opciones: usuarioValido.routes,
          },
        });
      } else {
        setError("Correo o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="body-login">
      <div className="logo-containermk">
        <a href="/">
          <img src="/logoMK.webp" alt="Logo" className="logo-animated" />
        </a>
      </div>
      <div className="grad"></div>
      <div className="login-box">
        <form className="form-login" onSubmit={handleLogin}>
          <div className="user-box">
            <input
              type="email"
              name="email" // Cambiado de "correo" a "email"
              required
              autoComplete="email"
              autoFocus
              className={`input-animated ${emailFocus ? "focused" : ""}`}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <label>Correo Electrónico</label>
            <span className="input-border"></span>
          </div>
          <div className="user-box password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              className={`input-animated ${passwordFocus ? "focused" : ""}`}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <label>Contraseña</label>
            <span className="input-border"></span>
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <svg
                className={`eye-icon ${showPassword ? "active" : ""}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>
          <button type="submit" className="ingresar-login" disabled={loading}>
            <span className="button-text">
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </span>
            <span className="button-arrow">→</span>
          </button>
        </form>
        {error && (
          <p className="error-login animate-error">{error}</p>
        )}
      </div>
    </div>
  );
};

export { Login };