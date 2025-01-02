import React from 'react';
import './Contribucion.css';
import { Footer } from '../components/Footer';

const Contribucion = () => {
  const sections = [
    {
      title: 'Obras Sociales',
      videos: [
        'https://www.youtube.com/embed/sz58ZOmlPD0',
        'https://www.youtube.com/embed/vkFFss9pUO8',
        'https://www.youtube.com/embed/zdRT0aZXXDc',
        'https://www.youtube.com/embed/MZiyMwtGJaY',
      ],
    },
    {
      title: 'Merkarhorro Contribuye',
      videos: [
        'https://www.youtube.com/embed/tSOY8iG4uOk',
        'https://www.youtube.com/embed/9qb61_Z1_CI',
        'https://www.youtube.com/embed/xyOIH0lTjCw',
        'https://www.youtube.com/embed/PAWmUlHRBEA',
        'https://www.youtube.com/embed/QP6VO9lKKfo',
        'https://www.youtube.com/embed/fAWbs2tGL7Q',
        'https://www.youtube.com/embed/OMuKrC_HGBQ',
        'https://www.youtube.com/embed/OoLIKaPO-FM',
        'https://www.youtube.com/embed/LnSgVyBf9Zw',
      ],
    },
    {
      title: 'Bachilleres Merkahorro',
      videos: [
        'https://www.youtube.com/embed/7eJUrwJyIYo',
        'https://www.youtube.com/embed/Qkw4bek6nZE',
        'https://www.youtube.com/embed/B-MmXCCilGA',
      ],
    },
    {
      title: 'Escuela Aristotélica',
      videos: [
        'https://www.youtube.com/embed/ew554uDvcXI',
        'https://www.youtube.com/embed/ZXpE-qY0tlY',
      ],
    },
    {
      title: 'Club Amas de Casa',
      videos: [
        'https://www.youtube.com/embed/nlbdeQaB1PE',
        'https://www.youtube.com/embed/_PajpyFOwLo',
        'https://www.youtube.com/embed/NEsLgp-5Udo',
        'https://www.youtube.com/embed/sNQ8G34DIXE',
        'https://www.youtube.com/embed/8M1WstwXi0s',
        'https://www.youtube.com/embed/JPxmWdMQfiU',
      ],
    },
  ];
  
  const renderVideo = (video) => {
    if (video.includes('youtube.com')) {
      const videoId = video.split('/').pop().split('?')[0]; // Extraer el ID del video
      return (
        <iframe
          key={video}
          className="video-item youtube-video"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else {
      return (
        <video key={video} className="video-item" controls>
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

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
            <h2>{section.title}</h2>
            <div className="contribucion-video-container">
              {section.videos.map((video) => renderVideo(video))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export { Contribucion };

