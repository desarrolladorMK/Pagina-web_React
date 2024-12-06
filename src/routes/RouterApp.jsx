import { Home } from "../pages/Home"
import { Contribuciones } from "../pages/Contribuccion"
import {Promociones} from "../pages/Promociones"
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
   
]