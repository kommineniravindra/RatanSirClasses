import React, { useEffect, useState } from "react";
import "../css/VideoIntro.css";

const VideoIntro = () => {
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    // Always close after 5 seconds
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closeVideo = () => setShowVideo(false);

  return (
    <>
      {showVideo && (
        <div className="video-overlay">
          <video
            autoPlay
            muted
            playsInline
            onEnded={closeVideo}
            onError={closeVideo}
            className="intro-video"
          >
            <source src="/v2.mp4" type="video/mp4" />
          </video>
        </div>
      )}
    </>
  );
};

export default VideoIntro;
