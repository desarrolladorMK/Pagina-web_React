import React from 'react';
import './Contribucion.css';
import { Footer } from '../components/Footer';
import { ChatBot } from '../components/ChatBot';

const Contribucion = () => {
  // Datos de las secciones con las especificaciones proporcionadas
  const sections = [
    // Obras Sociales
    {
      title: 'Obras Sociales',
      videos: [
        {
          thumbnail: 'obras1.jpg', // Reemplazar por la URL de la imagen
          instagramLink: 'https://www.instagram.com/reel/C7kniH5MzdD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' // Reemplazar por la URL de la publicación de Instagram
        },
        {
          thumbnail: 'obras2.jpg', // Reemplazar por la URL de la imagen
          instagramLink: 'https://www.instagram.com/reel/C3Q5KrqPTTu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' // Reemplazar por la URL de la publicación de Instagram
        },
        {
          thumbnail: 'obras3.jpg', // Reemplazar por la URL de la imagen
          instagramLink: 'https://www.instagram.com/reel/CyqyuXZOhJP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' // Reemplazar por la URL de la publicación de Instagram
        },
        {
          thumbnail: 'obras4.jpg', // Reemplazar por la URL de la imagen
          instagramLink: 'https://www.instagram.com/reel/C6cH2SxPDLS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' // Reemplazar por la URL de la publicación de Instagram
        }
      ]
    },

    // Merkahorro Contribuye
    {
      title: 'Merkahorro Contribuye',
      videos: [
        {
          thumbnail: 'contribuye1.jpg',
          instagramLink: 'https://www.instagram.com/reel/C4x3VVRO9qv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye2.jpg',
          instagramLink: 'https://www.instagram.com/reel/C_nYZ3cuHAd/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye3.jpg',
          instagramLink: 'https://www.instagram.com/reel/C8u13V7PThy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye4.jpg',
          instagramLink: 'https://www.instagram.com/reel/C_jViLkPKUc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye5.jpg',
          instagramLink: 'https://www.instagram.com/reel/C_0vYl5vqAp/?igsh=d2o4dTl3czMwajlu'
        },
        {
          thumbnail: 'contribuye6.jpg',
          instagramLink: 'https://www.instagram.com/reel/C_k8OLQOgJG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye7.jpg',
          instagramLink: 'https://www.instagram.com/reel/C9-NIlGpt5Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye8.jpg',
          instagramLink: 'https://www.instagram.com/reel/C9LCH0_vI6l/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'contribuye9.jpg',
          instagramLink: 'https://www.instagram.com/reel/C9f8dyivkiw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        }
      ]
    },

    // Bachilleres Merkahorro
    {
      title: 'Bachilleres Merkahorro',
      videos: [
        {
          thumbnail: 'bachiller1.jpg',
          instagramLink: 'https://www.instagram.com/reel/CuLBPv_tGGj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'bachiller2.jpg',
          instagramLink: 'https://www.instagram.com/reel/C7ZMvL6MRlI/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'bachiller3.jpg',
          instagramLink: 'https://www.instagram.com/reel/DAYgYCjuZN6/?igsh=MTBrcjNoemFlOTFzcg=='
        }
      ]
    },

    // Escuela Aristotélica
    {
      title: 'Escuela Aristotélica',
      videos: [
        {
          thumbnail: 'aristotelica1.jpg',
          instagramLink: 'https://www.instagram.com/reel/C-TAH8FP0G6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'aristotelica2.jpg',
          instagramLink: 'https://www.instagram.com/reel/DAuQga9PVmt/?igsh=ZDBzYmMxbHd5a2lh'
        }
      ]
    },

    // Club Amas de Casa
    {
      title: 'Club Amas de Casa',
      videos: [
        {
          thumbnail: 'club1.jpg',
          instagramLink: 'https://www.instagram.com/reel/C5bV2PrrAmo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'club2.jpg',
          instagramLink: 'https://www.instagram.com/reel/C__PUCQPtZM/?igsh=NHRiOG9sbTBxYXQ3'
        },
        {
          thumbnail: 'club3.jpg',
          instagramLink: 'https://www.instagram.com/reel/C4BONVGraG4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'club4.jpg',
          instagramLink: 'https://www.instagram.com/reel/C-TcFsKvWoh/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
        },
        {
          thumbnail: 'club5.jpg',
          instagramLink: 'https://www.instagram.com/reel/DA89lI-PNUO/?igsh=MTBwdnprdThoY3E4cQ=='
        },
        {
          thumbnail: 'club6.jpg',
          instagramLink: 'https://www.instagram.com/reel/C7pGU1eJJe_/?igsh=MW41c2JqMnZxajBjZQ=='
        }
      ]
    }
  ];

  return (
    <div className="contribucion-body">
      <header className="contribucion-header">
        <div className="logo-container">
          <a href="/">
            <img src="logoMK.png" alt="Logo Merkahorro" />
          </a>
        </div>
        <h1>Contribución Merkahorro</h1>
      </header>
      <main>
        {sections.map((section, index) => (
          <section key={index} className="contribucion-section">
            <h2 className="section-title">{section.title}</h2>
            <div className="contribucion-video-container">
              {section.videos.map((video, videoIndex) => (
                <a href={video.instagramLink} key={videoIndex} target="_blank" rel="noopener noreferrer" className="contribucion-thumbnail-container">
                  <img
                    src={video.thumbnail}
                    alt={`Thumbnail de ${section.title}`}
                    className="contribucion-thumbnail"
                  />
                  <div className="play-button-videos">▶</div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export { Contribucion };
