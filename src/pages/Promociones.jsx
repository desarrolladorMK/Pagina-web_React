import React, { useState } from 'react';
import './Promociones.css'; 
import { Footer } from '../components/Footer';

const Promociones = () => {
  const [modalImg, setModalImg] = useState('');

  const openModal = (imgSrc) => {
    setModalImg(imgSrc);
    document.getElementById("myModal").style.display = "flex";
  };

  const closeModal = () => {
    document.getElementById("myModal").style.display = "none";
  };

  return (
    <div>
      <h1 className='titulo-ofertas'>Súper Ofertas Merkahorro</h1>
      <a href="/"><img className="img-logo" src="/logoMK.png" alt="" /></a>
      <div className="container-ofertas">
        <div className="ofertas" onClick={() => openModal('/promo1.jpg')}>
          <img src="/promo1.jpg" alt="Promo 1" />
        </div>
        <div className="ofertas" onClick={() => openModal('/promo1.jpg')}>
          <img src="/promo1.jpg" alt="Promo 1" />
        </div>
        <div className="ofertas" onClick={() => openModal('/promo1.jpg')}>
          <img src="/promo1.jpg" alt="Promo 1" />
        </div>
        <div className="ofertas" onClick={() => openModal('/promo41jpg')}>
          <img src="/promo1.jpg" alt="Promo 1" />
        </div>
        <div className="ofertas" onClick={() => openModal('/promo1.jpg')}>
          <img src="/promo.jpg" alt="Promo 1" />
        </div>
        <div className="ofertas" onClick={() => openModal('/promo1.jpg')}>
          <img src="/promo.jpg" alt="Promo 1" />
        </div>
      </div>

      <div id="myModal" className="modal" onClick={closeModal}>
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="modal-content">
          <img id="modal-img" src={modalImg} alt="Modal" />
        </div>
      </div>
   <Footer/>
   
    </div>
   
  );
};

export {Promociones};
