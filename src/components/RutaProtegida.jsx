import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { obtenerToken } from "../helpers/funciones";
import credenciales from "../helpers/credenciales"; // Importar las credenciales

const RutaProtegida = ({ proteger }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = () => {
      const token = obtenerToken(); // Obtiene el token de localStorage

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Decodificar el token
        const decoded = atob(token).split(":");
        const correo = decoded[0];
        const password = decoded[1];

        // Verificar si las credenciales son válidas
        const usuarioValido = credenciales.find(
          (cred) => cred.correo === correo && cred.password === password
        );

        if (usuarioValido) {
          setIsAuthenticated(true);

          // Verificar si la ruta actual está permitida para el usuario
          const rutasPermitidas = JSON.parse(localStorage.getItem("rutas_permitidas") || "[]");
          const currentPath = location.pathname;

          // Permitir acceso a la ruta de redirección (como /acceso o /gastos)
          if (currentPath === usuarioValido.redirect) {
            setIsAuthorized(true);
            return;
          }

          // Verificar si la ruta actual está en las rutas permitidas
          const isRouteAllowed = rutasPermitidas.some((route) => route.path === currentPath);
          setIsAuthorized(isRouteAllowed);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [location.pathname]);

  if (isAuthenticated === null || isAuthorized === null) {
    return <div>Cargando...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/acceso" />; 
  }

  return proteger;
};

export default RutaProtegida;