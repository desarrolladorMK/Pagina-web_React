import React from "react";
import "./Footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Contacto */}
                <div className="contact-info">
                    <h3>Contacto</h3>
                    <p>Dirección: Calle 52 #52-27, Copacabana, Antioquia</p>
                    <p>Teléfono: 324 5597862</p>
                    <p>Email: paginaweb@merkahorrosas.com</p>
                </div>

                {/* Redes sociales */}
                <div className="social-media">
                    <h3>Síguenos</h3>
                    <div className="social-media-icons">
                        <a
                            href="https://www.facebook.com/supermercadosmerkahorro/?locale=es_LA"
                            aria-label="Facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/facebook.png" alt="Facebook" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@supermercadomerkahorro"
                            aria-label="TikTok"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/tiktok.png" alt="TikTok" />
                        </a>
                        <a
                            href="https://www.instagram.com/supermercadomerkahorro/?hl=es"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/instagram.png" alt="Instagram" />
                        </a>

                        <a
                            href="https://www.youtube.com/@Merkahorro"
                            aria-label="Youtube"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src="/youtube.png" alt="Youtube" />
                        </a>
                    </div>
                </div>

                {/* Políticas */}
                <div className="quick-links">
                    <h3>Políticas</h3>
                    <ul>
                        <li><Link to="/politicas">Políticas de privacidad</Link></li>
                        <li><Link to="/condiciones">Términos y Condiciones</Link></li>
                    </ul>
                </div>

                {/* Desarrollado por */}
                <div className="developer-info">
                    <h3>Equipo de Desarrollo</h3>
                    <p>Johan Sánchez</p>
                    <p>Kevin Pineda</p>
                    <p>Juan Isaza</p>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
