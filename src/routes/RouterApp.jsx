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
    path: '/salones',
    element: <Salones />,
  },
  {
    path: '/gastos',
    element: <Gastos />,
  },
  {
    path: '/postulacionesTable', 
    element: <PostulacionesTable />,
  } , 
  {
    path: '/https://merkahorro.com/Aula/', 
  }
];
