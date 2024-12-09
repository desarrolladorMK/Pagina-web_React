import { Home } from "../pages/Home"
import { Contribuciones } from "../pages/Contribucion"
import {Promociones} from "../pages/Promociones"
import { Politicas } from "../pages/Politicas"
import { Condiciones } from "../pages/Condiciones"

export let routes = [
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/contribuciones',
        element: <Contribuciones/>,
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
   
]