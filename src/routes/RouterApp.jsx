import { Home } from "../pages/Home";
import { Contribucion } from "../pages/Contribucion";
import { Promociones } from "../pages/Promociones";
import { Politicas } from "../pages/Politicas";
import { Condiciones } from "../pages/Condiciones";
import { Trabaja } from "../pages/Trabaja";
import { Login } from "../pages/Login";
import { Vacantes } from "../pages/Vacantes";
import { Salones } from "../pages/Salones";
import { ReservaForm } from "../pages/Reserva";
import { PostulacionesTable } from "../pages/PostulacionesTable"; // Importa Postulaciones
import {Gastos} from "../pages/Gastos";
import {HistorialGastos} from "../pages/HistorialGastos";
import { Automatizacion } from "../pages/Automatizacion";
import {AprobarRechazar} from "../pages/AprobarRechazar";
import {HistorialRegistros} from "../pages/HistorialRegistros";
import {Acceso} from "../pages/Acceso";
import {SolicitudAprobacion} from "../pages/SolicitudAprobacion";
import {DGdecision} from "../pages/DGdecision";

export let routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/contribucion',
    element: <Contribucion />,
  },
  {
    path: '/promociones',
    element: <Promociones />,
  },
  {
    path: '/politicas',
    element: <Politicas />,
  },
  {
    path: '/condiciones',
    element: <Condiciones />,
  },
  {
    path: '/trabaja-con-nosotros',
    element: <Vacantes />,
  },
  {
    path: '/aplicar',
    element: <Trabaja />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/acceso',
    element: <Acceso />,
  },
  {
    path: '/salones',
    element: <Salones />,
  },
  {
    path: '/gastos',
    element: <Gastos />,
  },
  {
    path: '/historialgastos',
    element: <HistorialGastos />,
  },
  {
    path: '/reserva',
    element: <ReservaForm />,
  },
  {
    path: '/postulacionesTable', 
    element: <PostulacionesTable />,
  } , 
  {
    path: '/automatizacion',
    element: <Automatizacion />,
  },
  {
    path: '/aprobarrechazar',
    element: <AprobarRechazar />,
  },
  {
    path: '/historial/:correo',
    element: <HistorialRegistros />,
  },
  {
    path: '/solicitudaprobacion',
    element: <SolicitudAprobacion />,
  },
  {
    path: '/dgdecision/:workflow_id/:role',
    element: <DGdecision />,
  },

  {
    path: '/https://merkahorro.com/Aula/', 
  }
];
