import { Home } from "../pages/Home";
import { Contribucion } from "../pages/Contribucion";
import { Promociones } from "../pages/Promociones";
import { Politicas } from "../pages/Politicas";
import { Condiciones } from "../pages/Condiciones";
import { Trabaja } from "../pages/Trabaja";
import { Login } from "../pages/admin/Login";
import { Vacantes } from "../pages/Vacantes";
import { Salones } from "../pages/Salones";
import { ReservaForm } from "../pages/Reserva";
import { PostulacionesTable } from "../pages/PostulacionesTable";
import { Gastos } from "../pages/flujo_gastos/Gastos";
import { HistorialGastos } from "../pages/flujo_gastos/HistorialGastos";
import { Automatizacion } from "../pages/flujo_fruver/Automatizacion";
import { AprobarRechazar } from "../pages/AprobarRechazar";
import { HistorialRegistros } from "../pages/flujo_fruver/HistorialRegistros";
import { Acceso } from "../pages/admin/Acceso";
import { SolicitudAprobacion } from "../pages/flujo_perfil/SolicitudAprobacion";
import { DGdecision } from "../pages/flujo_perfil/DGdecision";
import { Transporte } from "../pages/flujo_transporte/Transporte";
import { HistorialTransporte } from "../pages/flujo_transporte/HistorialTransporte";
import { PanoramaViewer } from "../pages/PanoramaViewer";
import { Contador } from "../pages/Contador";
import { FormularioPerfil } from "../pages/Sociodemografico/FormularioPerfil";
import { HistorialFormulario } from "../pages/Sociodemografico/HistorialFormulario";
import { HistorialCartera } from "../pages/flujo_gastos/HistorialCartera";
import RutaProtegida from "../components/RutaProtegida.jsx";

export let routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/contribucion",
    element: <Contribucion />,
  },
  {
    path: "/promociones",
    element: <Promociones />,
  },
  {
    path: "/politicas",
    element: <Politicas />,
  },
  {
    path: "/condiciones",
    element: <Condiciones />,
  },
  {
    path: "/trabaja-con-nosotros",
    element: <Vacantes />,
  },
  {
    path: "/aplicar",
    element: <Trabaja />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/acceso",
    element: <RutaProtegida proteger={<Acceso />} />,
  },
  {
    path: "/salones",
    element: <RutaProtegida proteger={<Salones />} />,
  },
  {
    path: "/gastos",
    element: <RutaProtegida proteger={<Gastos />} />,
  },
  {
    path: "/historialgastos",
    element: <RutaProtegida proteger={<HistorialGastos />} />,
  },
  {
    path: "/reserva",
    element: <RutaProtegida proteger={<ReservaForm />} />,
  },
  {
    path: "/postulacionesTable",
    element: <RutaProtegida proteger={<PostulacionesTable />} />,
  },
  {
    path: "/automatizacion",
    element: <RutaProtegida proteger={<Automatizacion />} />,
  },
  {
    path: "/aprobarrechazar",
    element: <RutaProtegida proteger={<AprobarRechazar />} />, 
  },
  {
    path: "/historial/:correo",
    element: <RutaProtegida proteger={<HistorialRegistros />} />,
  },
  {
    path: "/solicitudaprobacion",
    element: <RutaProtegida proteger={<SolicitudAprobacion />} />,
  },
  {
    path: "/dgdecision/:workflow_id/:role",
    element: <RutaProtegida proteger={<DGdecision />} />, 
  },
  {
    path: "/transporte",
    element: <RutaProtegida proteger={<Transporte />} />,
  },
  {
    path: "/historialtransporte",
    element: <RutaProtegida proteger={<HistorialTransporte />} />,
  },
  {
    path: "/panoramaViewer",
    element: <PanoramaViewer />, // Dejar sin protección si es público
  },
  {
    path: "/contador",
    element: <Contador />, // Dejar sin protección si es público
  },
  {
    path: "/formularioperfil",
    element: <RutaProtegida proteger={<FormularioPerfil />} />,
  },
  {
    path: "/historialformulario",
    element: <RutaProtegida proteger={<HistorialFormulario />} />,
  },
  {
    path: "/historialcartera",
    element: <RutaProtegida proteger={<HistorialCartera />} />,
  },
  {
    path: "/https://merkahorro.com/Aula/",
    element: <div>Redirigiendo...</div>, // Ajusta según necesites
  },
];