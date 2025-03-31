import React, { useState } from 'react';
import './Promociones.css';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { ChatBot } from '../components/ChatBot';

const Promociones = () => {
  const [modalImg, setModalImg] = useState('');
  const promocionesActivas = true;

  const openModal = (imgSrc) => {
    setModalImg(imgSrc);
    document.getElementById("myModal").style.display = "flex";
  };

  const closeModal = () => {
    document.getElementById("myModal").style.display = "none";
  };

  return (
    <div className="custom-body">
      <div className="page-container">
        <div className="main-container">
          <h1 className="titulo-ofertas">Súper Ofertas Merkahorro</h1>
          <Link to="/" className="back-logo-promo">
            <img src="/mkicono.png" alt="Logo" className="logo-image-promo" />
          </Link>

          {promocionesActivas ? (
            <div className="container-ofertas">
              <div className="ofertas" onClick={() => openModal('/prom1.jpeg')}>
                <img src="/prom1.jpeg" alt="Promo 1" />
              </div>
              <div className="ofertas" onClick={() => openModal('/prom2.jpeg')}>
                <img src="/prom2.jpeg" alt="Promo 2" />
              </div>
              <div className="ofertas" onClick={() => openModal('/prom3.jpeg')}>
                <img src="/prom3.jpeg" alt="Promo 3" />
              </div>
              <div className="ofertas" onClick={() => openModal('/prom4.jpeg')}>
                <img src="/prom4.jpeg" alt="Promo 4" />
              </div>
              {/* 
              <div className="ofertas" onClick={() => openModal('/im5.jpg')}>
                <img src="/im5.jpg" alt="Promo 5" />
              </div> */}
            </div>
          ) : (
            <div className="no-promociones">
              <h2 className="mensaje-promociones">
                En estos momentos no tenemos promociones activas, ¡pero volverán pronto!
              </h2>
            </div>
          )}

          <div id="myModal" className="modal" onClick={closeModal}>
            <span className="close" onClick={closeModal}>×</span>
            <div className="modal-content">
              <img id="modal-img" src={modalImg} alt="Modal" />
            </div>
          </div>

          <div className="floating-buttons">
            <ChatBot showInviteMessage={false} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export { Promociones };
