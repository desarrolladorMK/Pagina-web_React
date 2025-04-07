import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { FaUserTie, FaTimes } from "react-icons/fa"; // Cambié FaUserCircle por FaUserTie
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isSubMenuOpen) setIsSubMenuOpen(false);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsSubMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar-header">
        <div className="container-navbar-header">
          <Link to="/" className="logo-header" onClick={handleLinkClick}>
            <img
              src="/logoMK.webp"
              alt="Logo Merkahorro"
              className="header-logo"
            />
          </Link>

          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Abrir o cerrar menú"
          >
            {isMenuOpen ? <FaTimes /> : <GiHamburgerMenu />}
          </button>

          <ul className={`nav-list ${isMenuOpen ? "show" : ""}`}>
            <li className="nav-item-with-submenu">
              <button
                className="nav-item submenu-trigger"
                onClick={toggleSubMenu}
                onMouseEnter={() => !isMenuOpen && setIsSubMenuOpen(true)}
                onMouseLeave={() => !isMenuOpen && setIsSubMenuOpen(false)}
              >
                Nosotros
              </button>
              <ul className={`sub-nav-list ${isSubMenuOpen ? "show" : ""}`}>
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
              <a href="https://merkahorro.com/Aula/" onClick={handleLinkClick}>
                Aula
              </a>
            </li>
            <li className="login-icon">
              <Link to="/login" onClick={handleLinkClick}>
                <FaUserTie className="default-icon" /> {/* Ícono por defecto */}
                <FaUserTie className="hover-icon" />{" "}
                {/* Ícono al hacer hover */}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export { Header };
