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
      <a href="/Home"><img className="img-logo" src="/logoMK.png" alt="" /></a>
      <div className="container-ofertas">
        <div className="ofertas" onClick={() => openModal('/promo1.jpg')}>
          <img src="/promo1.jpg" alt="Promo 1" />
        </div>
        <div className="ofertas" onClick={() => openModal('assets/imagenes/promo2.jpg')}>
          <img src="assets/imagenes/promo2.jpg" alt="Promo 2" />
        </div>
        <div className="ofertas" onClick={() => openModal('assets/imagenes/promo3.jpg')}>
          <img src="assets/imagenes/promo3.jpg" alt="Promo 3" />
        </div>
        <div className="ofertas" onClick={() => openModal('assets/imagenes/promo4.jpg')}>
          <img src="assets/imagenes/promo4.jpg" alt="Promo 4" />
        </div>
        <div className="ofertas" onClick={() => openModal('assets/imagenes/promo5.jpg')}>
          <img src="assets/imagenes/promo5.jpg" alt="Promo 5" />
        </div>
        <div className="ofertas" onClick={() => openModal('assets/imagenes/promo6.jpg')}>
          <img src="assets/imagenes/promo6.jpg" alt="Promo 6" />
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
