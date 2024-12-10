import React, { useState, useEffect } from 'react';
import './Promociones.css';

const Promociones = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState('');

  const openModal = (imgSrc) => {
    setModalImgSrc(imgSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Cierra el modal al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const images = [
    '/promo1.jpg',
    '/promo2.jpg',
    '/promo3.jpg',
    '/promo4.jpg',
    '/promo5.jpg',
    '/promo6.jpg',
  ];

  return (
    <div>
      <h1>Súper Ofertas Merkahorro</h1>
      <div className="container-ofertas">
        {images.map((src, index) => (
          <div key={index} className="ofertas" onClick={() => openModal(src)}>
            <img src={src} alt={`Promo ${index + 1}`} />
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          id="myModal"
          className="modal"
          onClick={(e) => {
            if (e.target.id === 'myModal') closeModal();
          }}
        >
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <div className="modal-content">
            <img id="modal-img" src={modalImgSrc} alt="Modal" />
          </div>
        </div>
      )}
    </div>
  );
};

export { Promociones };
