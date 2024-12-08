import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="container-navbar">
                    <a href="#" className="logo">
                        <img src="/logoMK.png" alt="Logo de Merkahorro" />
                    </a>
                    <button className="menu-toggle" onClick={toggleMenu}>☰</button>
                    <ul className={`nav-list ${isMenuOpen ? 'show' : ''}`}>
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

export { Header };