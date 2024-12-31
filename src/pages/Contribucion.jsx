import React from 'react';
import './Contribucion.css';
import { Footer } from '../components/Footer';

const Contribucion = () => {
  const sections = [
    {
      title: 'Obras Sociales',
      videos: [
        'https://youtube.com/shorts/sz58ZOmlPD0',
        'https://youtube.com/shorts/vkFFss9pUO8?feature=share',
        'https://youtube.com/shorts/zdRT0aZXXDc?feature=share',
        'https://youtube.com/shorts/MZiyMwtGJaY?feature=share',
      ],
    },
    {
      title: 'Merkarhorro Contribuye',
      videos: [
        'https://youtube.com/shorts/tSOY8iG4uOk',
        'https://youtube.com/shorts/9qb61_Z1_CI',
        'https://www.youtube.com/embed/xyOIH0lTjCw',
        'https://youtube.com/shorts/PAWmUlHRBEA',
        'https://youtube.com/shorts/QP6VO9lKKfo',
        'https://youtube.com/shorts/fAWbs2tGL7Q',
        'https://youtube.com/shorts/OMuKrC_HGBQ',
        'https://youtube.com/shorts/OoLIKaPO-FM',
        'contribuye9.mp4',
      ],
    },
    {
      title: 'Bachilleres Merkahorro',
      videos: ['https://youtube.com/shorts/7eJUrwJyIYo',
        'https://www.youtube.com/embed/Qkw4bek6nZE',
        'bachiller3.mp4'],
    },
    {
      title: 'Escuela Aristotélica',
      videos: ['Aristotelica1.mp4', 'Aristotelica2.mp4'],
    },
    {
      title: 'Club Amas de Casa',
      videos: [
        'https://youtube.com/shorts/nlbdeQaB1PE',
        'https://youtube.com/shorts/_PajpyFOwLo',
        'https://youtube.com/shorts/NEsLgp-5Udo',
        'https://youtube.com/shorts/sNQ8G34DIXE',
        'https://youtube.com/shorts/8M1WstwXi0s',
        'https://youtube.com/shorts/JPxmWdMQfiU',
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
