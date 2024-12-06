import React from 'react';
import './Header.css'
import { Link } from 'react-router-dom'; 


const Header = () => {
    return (
        <header>
            <nav className="navbar">
                <div className="container-navbar">
                    <a href="#" className="logo">
                        {/* Ruta para el logo en la carpeta public */}
                        <img src="/logoMK.png" alt="Logo de Merkahorro" />
                    </a>
                    <button className="menu-toggle">☰</button>
                    <ul className="nav-list">
                        <li>
                            <a href="#" className="nav-item" id="compania-toggle">Nosotros</a>
                            <ul className="sub-nav-list" id="compania-info">
                                <li><a href="#compañia">Nuestra Compañía</a></li>
                                <li><a href="#mision">Misión</a></li>
                                <li><a href="#vision">Visión</a></li>
                                <li><a href="#principios">Principios</a></li>
                                <li><a href="#fundadores">Fundadores</a></li>
                            </ul>
                        </li>
                        <li><Link to="/contribuciones">Contribución</Link></li>
                        <li><Link to="/promociones">Promociones</Link></li>
                        <li><Link to="/trabaja-con-nosotros">Trabaja con nosotros</Link></li>
                        <li><Link to="/reservas">Reservas</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export{Header};
