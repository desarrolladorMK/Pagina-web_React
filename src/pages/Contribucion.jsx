import React from "react";
import "./Contribucion.css";
import { Footer } from "../components/Footer";
import { ChatBot } from "../components/ChatBot";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Contribucion = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50, // Reducir el offset para que las animaciones se activen más arriba
    });
  }, []);

  const sections = [
    {
      title: "Obras Sociales",
      videos: [
        {
          thumbnail: "obras1.webp",
          instagramLink:
            "https://www.instagram.com/reel/C7kniH5MzdD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "obras2.webp",
          instagramLink:
            "https://www.instagram.com/reel/C3Q5KrqPTTu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "obras3.webp",
          instagramLink:
            "https://www.instagram.com/reel/CyqyuXZOhJP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "obras4.webp",
          instagramLink:
            "https://www.instagram.com/reel/C6cH2SxPDLS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
      ],
    },
    {
      title: "Merkahorro Contribuye",
      videos: [
        {
          thumbnail: "contribuye1.webp",
          instagramLink:
            "https://www.instagram.com/reel/C4x3VVRO9qv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye2.webp",
          instagramLink:
            "https://www.instagram.com/reel/C_nYZ3cuHAd/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye3.webp",
          instagramLink:
            "https://www.instagram.com/reel/C8u13V7PThy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye4.webp",
          instagramLink:
            "https://www.instagram.com/reel/C_jViLkPKUc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye5.webp",
          instagramLink:
            "https://www.instagram.com/reel/C_0vYl5vqAp/?igsh=d2o4dTl3czMwajlu",
        },
        {
          thumbnail: "contribuye6.webp",
          instagramLink:
            "https://www.instagram.com/reel/C_k8OLQOgJG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye7.webp",
          instagramLink:
            "https://www.instagram.com/reel/C9-NIlGpt5Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye8.webp",
          instagramLink:
            "https://www.instagram.com/reel/C9LCH0_vI6l/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "contribuye9.webp",
          instagramLink:
            "https://www.instagram.com/reel/C9f8dyivkiw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
      ],
    },
    {
      title: "Bachilleres Merkahorro",
      videos: [
        {
          thumbnail: "bachiller1.webp",
          instagramLink:
            "https://www.instagram.com/reel/CuLBPv_tGGj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "bachiller2.webp",
          instagramLink:
            "https://www.instagram.com/reel/C7ZMvL6MRlI/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "bachiller3.webp",
          instagramLink:
            "https://www.instagram.com/reel/DAYgYCjuZN6/?igsh=MTBrcjNoemFlOTFzcg==",
        },
      ],
    },
    {
      title: "Escuela Aristotélica",
      videos: [
        {
          thumbnail: "aristotelica1.webp",
          instagramLink:
            "https://www.instagram.com/reel/C-TAH8FP0G6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "aristotelica2.webp",
          instagramLink:
            "https://www.instagram.com/reel/DAuQga9PVmt/?igsh=ZDBzYmMxbHd5a2lh",
        },
      ],
    },
    {
      title: "Club Amas de Casa",
      videos: [
        {
          thumbnail: "club1.webp",
          instagramLink:
            "https://www.instagram.com/reel/C5bV2PrrAmo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "club2.webp",
          instagramLink:
            "https://www.instagram.com/reel/C__PUCQPtZM/?igsh=NHRiOG9sbTBxYXQ3",
        },
        {
          thumbnail: "club3.webp",
          instagramLink:
            "https://www.instagram.com/reel/C4BONVGraG4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "club4.webp",
          instagramLink:
            "https://www.instagram.com/reel/C-TcFsKvWoh/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        },
        {
          thumbnail: "club5.webp",
          instagramLink:
            "https://www.instagram.com/reel/DA89lI-PNUO/?igsh=MTBwdnprdThoY3E4cQ==",
        },
        {
          thumbnail: "club6.webp",
          instagramLink:
            "https://www.instagram.com/reel/C7pGU1eJJe_/?igsh=MW41c2JqMnZxajBjZQ==",
        },
      ],
    },
  ];

  return (
    <div className="contribucion-body">
      <header className="contribucion-header" data-aos="fade-down">
        <div className="logo-container">
          <a href="/">
            <img src="logoMK.webp" alt="Logo Merkahorro" />
          </a>
        </div>
        <h1>Contribución Merkahorro</h1>
      </header>
      <main>
        {sections.map((section, index) => (
          <section
            key={index}
            className="contribucion-section"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <h2 className="section-title">{section.title}</h2>
            <div className="contribucion-video-container">
              {section.videos.map((video, videoIndex) => (
                <a
                  href={video.instagramLink}
                  key={videoIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contribucion-thumbnail-container"
                  data-aos="zoom-in"
                  data-aos-delay={videoIndex * 50}
                >
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
      <div className="floating-buttons" data-aos="fade-up" data-aos-offset="0">
        <ChatBot showInviteMessage={false} />
      </div>
      <Footer />
    </div>
  );
};

export { Contribucion };
