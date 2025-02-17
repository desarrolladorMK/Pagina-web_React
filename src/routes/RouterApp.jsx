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
import { PostulacionesTable } from "../pages/PostulacionesTable"; // Importa Postulaciones
import {Gastos} from "../pages/flujo_gastos/Gastos";
import {HistorialGastos} from "../pages/flujo_gastos/HistorialGastos";
import { Automatizacion } from "../pages/flujo_fruver/Automatizacion";
import {AprobarRechazar} from "../pages/AprobarRechazar";
import {HistorialRegistros} from "../pages/flujo_fruver/HistorialRegistros";
import {Acceso} from "../pages/admin/Acceso";
import {SolicitudAprobacion} from "../pages/flujo_perfil/SolicitudAprobacion";
import {DGdecision} from "../pages/flujo_perfil/DGdecision";
import {Transporte} from "../pages/flujo_transporte/Transporte";
import {HistorialTransporte} from "../pages/flujo_transporte/HistorialTransporte";
import {PanoramaViewer} from "../pages/PanoramaViewer";

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
    path: '/transporte',
    element: <Transporte />,
  },
  {
    path: '/historialtransporte',
    element: <HistorialTransporte />,
  },
  {
    path: '/panoramaViewer',
    element: <PanoramaViewer />,
  },

  {
    path: '/https://merkahorro.com/Aula/', 
  }
];
