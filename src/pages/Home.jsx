import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import './Home.css'
const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual
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

    // useEffect para cambiar las imágenes automáticamente
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Cambia cada 3 segundos

        // Limpiamos el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []); // El segundo parámetro vacío asegura que el intervalo se establezca solo una vez al montar el componente

    return (
        <div>
            <Header />
            {/* Carrusel */}
            <div className="carousel">
                {/* Flechas eliminadas */}
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
            </div>
        </div>
    );
};

export { Home };
