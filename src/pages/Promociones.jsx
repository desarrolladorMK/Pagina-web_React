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
      <div className="main-container">
        <h1 className="titulo-ofertas">Súper Ofertas Merkahorro</h1>
        <Link to="/" className="back-logo-promo">
          <img src="/mkicono.png" alt="Logo" className="logo-image-promo" />
        </Link>

        {promocionesActivas ? (
          <div className="container-ofertas">
            <div className="ofertas" onClick={() => openModal('/im1.jpeg')}>
              <img src="/im1.jpeg" alt="Promo 1" />
            </div>
            <div className="ofertas" onClick={() => openModal('/im2.jpeg')}>
              <img src="/im2.jpeg" alt="Promo 2" />
            </div>
            <div className="ofertas" onClick={() => openModal('/im3.jpeg')}>
              <img src="/im3.jpeg" alt="Promo 3" />
            </div>
            <div className="ofertas" onClick={() => openModal('/im4.jpeg')}>
              <img src="/im4.jpeg" alt="Promo 4" />
            </div>
            <div className="ofertas" onClick={() => openModal('/im5.jpeg')}>
              <img src="/im5.jpeg" alt="Promo 5" />
            </div>
            <div className="ofertas" onClick={() => openModal('/im6.jpeg')}>
              <img src="/im6.jpeg" alt="Promo 6" />
            </div>
            <div className="ofertas" onClick={() => openModal('/im7.jpeg')}>
              <img src="/im7.jpeg" alt="Promo 7" />
            </div>
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

        <Footer />
      </div>
    </div>
  );
};

export { Promociones };