import React from 'react';
import './Contribucion.css';
import { Footer } from '../components/Footer';

const Contribucion = () => {
  const sections = [
    {
      title: 'Obras Sociales',
      videos: [
        'obras1.mp4',
        'obras2.mp4',
        'video/con7.mp4',
        'video/con10.mp4',
      ],
    },
    {
      title: 'Merkarhorro Contribuye',
      videos: [
        'video/con4.mp4',
        'video/con3.mp4',
        'video/con15.mp4',
        'video/con6.mp4',
        'video/con9.mp4',
        'video/con13.mp4',
        'video/con1.mp4',
        'video/con21.mp4',
        'video/con22.mp4',
      ],
    },
    {
      title: 'Bachilleres Merkahorro',
      videos: ['video/con8.mp4', 'video/con5.mp4', 'video/con17.mp4'],
    },
    {
      title: 'Escuela Aristotélica',
      videos: ['Aristotelica1.mp4', 'video/con12.mp4'],
    },
    {
      title: 'Club Amas de Casa',
      videos: [
        'video/con18.mp4',
        'video/con19.mp4',
        'video/con20.mp4',
        'video/con23.mp4',
        'video/con24.mp4',
        'video/con25.mp4',
      ],
    },
  ];

  return (
    <div className="contribucion-body">
      <header className="contribucion-header">
        <h1>Contribución Merkahorro</h1>
      </header>
      <main>
        {sections.map((section, index) => (
          <section key={index} className="contribucion-section">
            <h2>{section.title}</h2>
            <div className="contribucion-video-container">
              {section.videos.map((video, idx) => (
                <video key={idx} src={video} controls></video>
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
