import { Header } from "../components/Header";
import { useState, useEffect, } from "react";
import './Home.css';
import { Footer } from "../components/Footer";
import React, { useRef } from 'react';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual
  const audioRef = useRef(null); // Referencia al reproductor de audio
  const playButtonRef = useRef(null); // Referencia al botón de reproducción

  const images = [
    "/mk1.jpg",
    "/mk2.jpg",
    "/mk3.jpg",
    "/mk4.jpg"
  ];

  // Función para cambiar al siguiente slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Avanza al siguiente slide
  };

  // Función para cambiar al slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Retrocede al slide anterior
  };

  // Función para ir a un slide específico
  const goToSlide = (index) => {
    setCurrentIndex(index); // Ir a un slide específico
  };



 // Reproducción del audio al hacer clic en el botón
 const handlePlay = () => {
  if (audioRef.current.paused) {
      audioRef.current.play();
      playButtonRef.current.classList.add('playing'); // Cambiar icono o estilo
  } else {
      audioRef.current.pause();
      playButtonRef.current.classList.remove('playing');
  }
};



  // useEffect para cambiar las imágenes automáticamente
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Cambia cada 3 segundos

    // Limpiamos el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // El segundo parámetro vacío asegura que el intervalo se establezca solo una vez al montar el componente

  return (
  
    <div className="Home-body">
      <Header />
      {/* Carrusel */}
      <div className="carousel">
        <div className="container-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentIndex ? "active" : ""}`}
              style={{
                display: index === currentIndex ? "block" : "none",
              }}
            >
              <img src={image} alt={`Imagen ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>


        {/* Reproductor de audio */}
        <div className="audio-player-container">
          <button
            id="playButton"
            className="play-button draggable"
            ref={playButtonRef}
            onClick={handlePlay}
          >
            <span className="play-icon"></span>
          </button>
          <audio id="live-audio" preload="auto" ref={audioRef}>
            <source src="https://radiolatina.info/8016/stream" type="audio/mpeg" />
            Tu navegador no soporta la reproducción de audio.
          </audio>
        </div>


      </div>
      {/* Código de las sedes */}
      <h1 className="title-sedes">Conoce nuestras sedes</h1>
      <div className="tarjeta-container">
        {/* Tarjeta 1 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/Plaza.jpg" alt="Logo de Copacabana Plaza" />
          <h2>Copacabana Plaza</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+52+%2352-27" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 52 #52-27
          </p>
          <p>
            <a href="https://wa.me/573147956325" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3147956325
          </p>
        </section>
        {/* Tarjeta 2 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/centro A.JPG" alt="Logo del Centro Administrativo" />
          <h2>Centro Administrativo</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+52+%2352-27" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 52 #52-27
          </p>
          <p>
            <a href="https://wa.me/573147956325" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3147956325
          </p>
        </section>
        {/* Tarjeta 3 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/villahermosa.jpg" alt="Logo de Villa Hermosa" />
          <h2>Villa Hermosa</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+40+%2364-51" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 40 #64-51
          </p>
          <p>
            <a href="https://wa.me/573185369987" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3185369987
          </p>
        </section>

        {/* Tarjeta 4 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/girardota parque.jpeg" alt="Logo de Girardota parque" />
          <h2>Girardota parque</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+7+%2315-61" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección:Calle 7 #15-61
          </p>
          <p>
            <a href="https://wa.me/573186247765" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3186247765
          </p>
        </section>

        {/* Tarjeta 5 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/girardota llano.jpg" alt="Logo de Girardota llano" />
          <h2>Girardota llano</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+11+%2316-43" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 11 #16-43
          </p>
          <p>
            <a href="https://wa.me/573182681285" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono:  3182681285
          </p>
        </section>

        {/* Tarjeta 6 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/carnes barbosa.jpg" alt="Logo de carnes barbosa" />
          <h2>Carnes barbosa</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+14+%2311-09" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 14 #11-09
          </p>
          <p>
            <a href="https://wa.me/573225105463" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono:  3225105463
          </p>
        </section>

        {/* Tarjeta 7 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/copacabana vegas.jpg" alt="Logo de Copacabana Vegas" />
          <h2>Copacabana Vegas</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+56+%23+43-159" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 56 # 43 - 159
          </p>
          <p>
            <a href="https://wa.me/573243638526" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono:   3243638526
          </p>
        </section>

        {/* Tarjeta 8 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/barbosa.jpg" alt="Logo de Barbosa" />
          <h2>Barbosa</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+14+%23+11-18" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 56 # 43 - 159
          </p>
          <p>
            <a href="https://wa.me/573006828595" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono:   3243638526
          </p>
        </section>

        {/* Tarjeta 9 */}
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/copacabana san juan.jpg" alt="Logo de copacabana San juan" />
          <h2>Copacabana San Juan</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+28+%23+45-41" target="_blank">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 28 # 45-41
          </p>
          <p>
            <a href="https://wa.me/573165563838" target="_blank">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono:   3165563838
          </p>
        </section>
      </div>


      <div className="container-logocorporativo">
        <img
          id="logocorporativo"
          className="logocorporativo"
          src="/logoMK.png"
          alt="Logo corporativo"
        />
      </div>


      <main>
        <div className="card-container">
          <section className="card" id="compañia">
            <img
              className="logosmain"
              src="/carritomercado.png"
              alt="Logo"
            />
            <h2>Nuestra Compañía</h2>
            <p>
              Merkahorro es una entidad empresarial que ha destacado por su
              notable presencia en el mercado. Su expansión se fundamenta en el
              compromiso constante de perfeccionar y agilizar los procesos de
              pedidos, entregas, promociones, órdenes y servicios al cliente.
            </p>
          </section>

          <section className="card" id="mision">
            <h2>Misión</h2>
            <p>
              Llevamos bienestar y felicidad a los hogares, a través de
              productos y servicios de alta calidad que distribuimos en cada uno
              de nuestros supermercados, con un ambiente de respeto y cuidado
              hacia nuestros visitantes, y un equipo humano que disfruta lo que
              hace.
            </p>
            <img
              className="logosmain"
              src="/objetivo.png"
              alt="Logom"
            />
          </section>

          <section className="card" id="vision">
            <h2>Visión</h2>
            <img
              className="logosmain"
              src="/visionymision.png"
              alt=""
            />
            <p>
              En el año 2026, se proyecta que Merkahorro S.A.S tendrá 12 sedes
              en todo el territorio nacional en diversos municipios, con
              alrededor de 450 empleados, siendo líder en el segmento de
              supermercados independientes. La empresa tendrá alta eficiencia en
              todas sus unidades de negocio, como Fruver, Carnes y Abarrotes en
              todas sus categorías, optimizando al máximo cada uno de sus
              procesos y mejorando continuamente los beneficios económicos para
              sus socios y el bienestar de todos los empleados directos e
              indirectos.
            </p>
          </section>

          <section className="card" id="principios">
            <h2>Principios</h2>
            <p>
              Nuestros principios se fundamentan en transformaciones
              significativas que surgen al romper valientemente con las formas
              tradicionales de pensamiento. Estos principios son:
            </p>
            <ul>
              <img
                className="logosmain"
                src="/principios-morales.png"
                alt=""
              />
              <br />
              <li>
                <strong>La Verdad:</strong> Es la razón del ser, que nos lleva
                a vivir en responsabilidad y confiabilidad, fortaleciendo el
                carácter y las relaciones de valor impactando vidas.
              </li>
              <li>
                <strong>La Belleza:</strong> Valorar y crear estética en todos
                los aspectos de nuestras vidas.
              </li>
              <li>
                <strong>La Bondad:</strong> Fomentar la empatía, la compasión y
                la integridad en nuestras acciones.
              </li>
              <li>
                <strong>La Unidad:</strong> Promover la cohesión y la
                colaboración entre las personas y las ideas.
              </li>
            </ul>
          </section>

          <section className="card" id="fundadores">
            <img
              className="logosmain"
              src="/Ceo.png"
              alt=""
            />
            <h2>Fundadores</h2>
            <p>
              Supermercados Merkahorro surgió como la materialización de la
              visión compartida por los hermanos Diego y William Ramírez en 2015.
              A pesar de la carencia inicial de recursos, estos emprendedores se
              dedicaron a hacer realidad su ambicioso proyecto, concentrándose en
              el municipio de Copacabana.
            </p>
            <p>
              Su enfoque claro y definido desde el principio consistió en
              alcanzar la posición de ser el principal supermercado en dicha
              localidad.
            </p>
          </section>
        </div>
      </main>

      <div className="video-container">
        <h1>Historia de nuestra compañía</h1>
        <video className="video" controls muted loop>
          <source src="Videomercahorro.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      <Footer />
    </div>

  );
};



export { Home };
