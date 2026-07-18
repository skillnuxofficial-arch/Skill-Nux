import React, { useEffect, useRef } from 'react';
import { getVideoUrl } from '../utils/videoHelpers';

export default function BackgroundVideo({ skill }) {
  const videoRef = useRef(null);
  const videoUrl = getVideoUrl(skill);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Video autoplay prevented:", e));
    }
  }, [videoUrl]);

  return (
    <div className="video-bg-wrap">
      <video
        ref={videoRef}
        key={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="video-bg-content"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="video-bg-overlay" style={{ background: 'rgba(250, 249, 246, 0.3)' }}></div>
    </div>
  );
}
