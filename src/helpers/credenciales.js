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
        { path: "/gastos", label: "Gastos" },
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
  
  export default credenciales;