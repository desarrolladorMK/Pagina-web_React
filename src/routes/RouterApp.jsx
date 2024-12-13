import { Home } from "../pages/Home"
import { Contribucion } from "../pages/Contribucion"
import {Promociones} from "../pages/Promociones"
import { Politicas } from "../pages/Politicas"
import { Condiciones } from "../pages/Condiciones"
import { Trabaja} from "../pages/Trabaja"
import {Reservas} from"../pages/Reservas"
import { Vacantes } from "../pages/Vacantes"


export let routes = [
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/contribucion',
        element: <Contribucion/>,
    },
    {
        path: '/promociones',
        element: <Promociones/>,
    },
    {
        path: '/politicas',
        element: <Politicas/>
    },
    {
        path: '/condiciones',
        element: <Condiciones/>
    },
    {
        path: '/trabaja-con-nosotros',
        element: <Vacantes/>
    },
    {
        path: '/aplicar',
        element: <Trabaja/>
    },
    {
        path: '/reservas',
        element: <Reservas/>
    }
   
]