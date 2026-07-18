import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEOS = [
  '/bg1.mp4',
  '/bg2.mp4',
  '/bg3.mp4',
  '/bg4.mp4'
];

export default function VideoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.video
          key={currentIndex}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="f-hero-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <source src={VIDEOS[currentIndex]} type="video/mp4" />
        </motion.video>
      </AnimatePresence>
    </div>
  );
}
