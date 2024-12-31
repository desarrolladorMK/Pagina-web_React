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
        'obras3.mp4',
        'obras4.mp4',
      ],
    },
    {
      title: 'Merkarhorro Contribuye',
      videos: [
        'contribuye1.mp4',
        'contribuye2.mp4',
        'contribuye3.mp4',
        'contribuye4.mp4',
        'contribuye5.mp4',
        'contribuye6.mp4',
        'contribuye7.mp4',
        'contribuye8.mp4',
        'contribuye9.mp4',
      ],
    },
    {
      title: 'Bachilleres Merkahorro',
      videos: ['bachiller1.mp4', 'bachiller2.mp4', 'bachiller3.mp4'],
    },
    {
      title: 'Escuela Aristotélica',
      videos: ['Aristotelica1.mp4', 'Aristotelica2.mp4'],
    },
    {
      title: 'Club Amas de Casa',
      videos: [
        'club1.mp4',
        'club2.mp4',
        'club3.mp4',
        'club4.mp4',
        'club5.mp4',
        'club6.mp4',
      ],
    },
  ];

  const renderVideo = (video) => {
    if (video.includes('youtube.com')) {
      const videoId = video.split('/').pop(); // Extraer el ID del video
      return (
        <iframe
          key={video}
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else {
      return (
        <video key={video} width="560" height="315" controls>
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
            <img src="logoMK.png" alt="" />
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
