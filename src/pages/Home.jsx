import React, { useRef, useState, useEffect } from "react";
import "./Home.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChatBot } from "../components/ChatBot";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);
  const playButtonRef = useRef(null);

  const images = [
    { src: "/mk1.jpg", title: "Bienvenidos a Merkahorro" },
    { src: "/mk2.jpg", title: "Calidad en cada rincón" },
    { src: "/mk3.jpg", title: "Tu supermercado favorito" },
    { src: "/mk4.jpg", title: "Siempre cerca de ti" },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        playButtonRef.current?.classList.add("playing");
      } else {
        audioRef.current.pause();
        playButtonRef.current?.classList.remove("playing");
      }
    }
  };

  return (
    <div className="Home-body">
      <Header />

      {/* Carrusel sin flechas y a todo el ancho */}
      <div className="carousel" data-aos="fade-in">
        <div className="container-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentIndex ? "active" : ""}`}
              style={{ display: index === currentIndex ? "block" : "none" }}
            >
              <img src={image.src} alt={`Imagen ${index + 1}`} />
              <div className="slide-title">{image.title}</div>
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
      </div>

      {/* Botones flotantes */}
      <div className="floating-buttons" data-aos="zoom-in">
        <button
          id="playButton"
          className="play-button"
          ref={playButtonRef}
          onClick={handlePlay}
        >
          <span className="play-icon"></span>
        </button>
        <audio id="live-audio" preload="auto" ref={audioRef}>
          <source src="https://radiolatina.info/8016/stream" type="audio/mpeg" />
          Tu navegador no soporta la reproducción de audio.
        </audio>
        <ChatBot />
      </div>

      {/* Sección de sedes */}
      <h1 className="title-sedes" data-aos="fade-up">Conoce nuestras sedes</h1>
      <div className="tarjeta-container" data-aos="fade-up" data-aos-delay="200">
        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/Plaza.jpg" alt="Copacabana Plaza" />
          <h2>Copacabana Plaza</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+52+%2352-27" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 52 #52-27
          </p>
          <p>
            <a href="https://wa.me/573147956325" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3147956325
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/centro A.JPG" alt="Centro Administrativo" />
          <h2>Centro Administrativo</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+52+%2352-27" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 52 #52-27
          </p>
          <p>
            <a href="https://wa.me/573147956325" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3147956325
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/villahermosa.jpg" alt="Villa Hermosa" />
          <h2>Villa Hermosa</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+40+%2364-51" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 40 #64-51
          </p>
          <p>
            <a href="https://wa.me/573185369987" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3185369987
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/girardota parque.jpeg" alt="Girardota parque" />
          <h2>Girardota parque</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+7+%2315-61" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 7 #15-61
          </p>
          <p>
            <a href="https://wa.me/573186247765" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3186247765
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/girardota llano.jpg" alt="Girardota llano" />
          <h2>Girardota llano</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Calle+11+%2316-43" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Calle 11 #16-43
          </p>
          <p>
            <a href="https://wa.me/573182681285" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3182681285
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/carnes barbosa.jpg" alt="Carnes barbosa" />
          <h2>Carnes barbosa</h2>
          <p>
            <a href="https://maps.app.goo.gl/7jCPPiDha7FviHP58" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 14 #11-09
          </p>
          <p>
            <a href="https://wa.me/573225105463" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3225105463
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/copacabana vegas.jpg" alt="Copacabana Vegas" />
          <h2>Copacabana Vegas</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+56+%23+43-159" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 56 # 43 - 159
          </p>
          <p>
            <a href="https://wa.me/573243638526" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3243638526
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/barbosa.jpg" alt="Barbosa" />
          <h2>Barbosa</h2>
          <p>
            <a href="https://maps.app.goo.gl/3K9oqWHPMk5WpXfK6" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 14 # 11-18
          </p>
          <p>
            <a href="https://wa.me/573006828595" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3006828595
          </p>
        </section>

        <section className="tarjeta" id="tarjeta">
          <img className="logo-sedes" src="/copacabana san juan.jpg" alt="Copacabana San Juan" />
          <h2>Copacabana San Juan</h2>
          <p>
            <a href="https://www.google.com/maps/search/?api=1&query=Carrera+28+%23+45-41" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetas" src="/ubicacion.png" alt="Ubicación" />
            </a>
            Dirección: Carrera 28 # 45-41
          </p>
          <p>
            <a href="https://wa.me/573165563838" target="_blank" rel="noopener noreferrer">
              <img className="icono-tarjetatel" src="/wasap.png" alt="Teléfono" />
            </a>
            Teléfono: 3165563838
          </p>
        </section>
      </div>

      {/* Logo corporativo */}
      <div className="container-logocorporativo" data-aos="fade-in">
        <img
          id="logocorporativo"
          className="logocorporativo"
          src="/logoMK.png"
          alt="Logo corporativo"
        />
      </div>

      {/* Sección principal */}
      <main className="Home" data-aos="fade-up">
        <div className="card-container">
          <div className="flip-card" id="compañia">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img className="logosmain" src="/carritomercado.png" alt="Nuestra Compañía" />
                <h2>Nuestra Compañía</h2>
              </div>
              <div className="flip-card-back">
                <p>
                  Merkahorro es una entidad empresarial que ha destacado por su notable presencia en el mercado. Su expansión se fundamenta en el compromiso constante de perfeccionar y agilizar los procesos de pedidos, entregas, promociones, órdenes y servicios al cliente.
                </p>
              </div>
            </div>
          </div>

          <div className="flip-card" id="mision">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img className="logosmain" src="/objetivo.png" alt="Misión" />
                <h2>Misión</h2>
              </div>
              <div className="flip-card-back">
                <p>
                  Llevamos bienestar y felicidad a los hogares, a través de productos y servicios de alta calidad que distribuimos en cada uno de nuestros supermercados, con un ambiente de respeto y cuidado hacia nuestros visitantes, y un equipo humano que disfruta lo que hace.
                </p>
              </div>
            </div>
          </div>

          <div className="flip-card" id="vision">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img className="logosmain" src="/visionymision.png" alt="Visión" />
                <h2>Visión</h2>
              </div>
              <div className="flip-card-back">
                <p>
                  En el año 2026, se proyecta que Merkahorro S.A.S tendrá 12 sedes en todo el territorio nacional en diversos municipios, con alrededor de 450 empleados, siendo líder en el segmento de supermercados independientes.
                </p>
              </div>
            </div>
          </div>

          <div className="flip-card" id="principios">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img className="logosmain" src="/principios-morales.png" alt="Principios" />
                <h2>Principios</h2>
              </div>
              <div className="flip-card-back">
                <p>
                  Nuestros principios se fundamentan en transformaciones significativas que surgen al romper con formas tradicionales. Estos incluyen:
                </p>
                <ul>
                  <li><strong>La Verdad:</strong> Vivir con responsabilidad y confiabilidad.</li>
                  <li><strong>La Belleza:</strong> Crear estética en todos los aspectos de la vida.</li>
                  <li><strong>La Bondad:</strong> Fomentar empatía, compasión e integridad.</li>
                  <li><strong>La Unidad:</strong> Promover la cohesión y colaboración.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flip-card" id="fundadores">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img className="logosmain" src="/Ceo.png" alt="Fundadores" />
                <h2>Fundadores</h2>
              </div>
              <div className="flip-card-back">
                <p>
                  Supermercados Merkahorro surgió como la materialización de la visión compartida por dos hermanos en 2015, quienes, pese a la carencia inicial de recursos, se dedicaron a hacer realidad su ambicioso proyecto en Copacabana.
                </p>
                <p>
                  Su enfoque fue lograr ser el principal supermercado en la localidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Video mejorado */}
      <div className="video-container" data-aos="zoom-in">
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