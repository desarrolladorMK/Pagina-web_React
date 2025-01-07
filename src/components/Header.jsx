import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState); // Alterna el estado del menú
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false); // Cierra el menú al hacer clic en un enlace
    };

    return (
        <header>
            <nav className="navbar-header">
                <div className="container-navbar-header">
                    <a href="#" className="logo-header">
                        <img src="/logoMK.png" alt="Logo de Merkahorro" />
                    </a>
                    {/* Botón de menú para dispositivos móviles */}
                    <button
                        className="menu-toggle"
                        onClick={toggleMenu}
                        aria-label="Abrir o cerrar menú"
                    >
                        ☰
                    </button>
                    {/* Menú principal */}
                    <ul className={`nav-list ${isMenuOpen ? 'show' : ''}`}>
                        <li>
                            <a 
                                href="#" 
                                className="nav-item" 
                                onClick={handleLinkClick}
                            >
                                Nosotros
                            </a>
                            <ul className="sub-nav-list">
                                <li>
                                    <a href="#compañia" onClick={handleLinkClick}>
                                        Nuestra Compañía
                                    </a>
                                </li>
                                <li>
                                    <a href="#mision" onClick={handleLinkClick}>
                                        Misión
                                    </a>
                                </li>
                                <li>
                                    <a href="#vision" onClick={handleLinkClick}>
                                        Visión
                                    </a>
                                </li>
                                <li>
                                    <a href="#principios" onClick={handleLinkClick}>
                                        Principios
                                    </a>
                                </li>
                                <li>
                                    <a href="#fundadores" onClick={handleLinkClick}>
                                        Fundadores
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/contribucion" onClick={handleLinkClick}>
                                Contribución
                            </Link>
                        </li>
                        <li>
                            <Link to="/promociones" onClick={handleLinkClick}>
                                Promociones
                            </Link>
                        </li>
                        <li>
                            <Link to="/trabaja-con-nosotros" onClick={handleLinkClick}>
                                Trabaja con nosotros
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" onClick={handleLinkClick}>
                                Reservas
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export { Header };
