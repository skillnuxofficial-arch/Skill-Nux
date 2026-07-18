import React, { useState, useEffect } from 'react';
import './HeroOpusSlider.css';

export default function HeroOpusSlider() {
  const [curSlide, setCurSlide] = useState(1);
  const [isInitial, setIsInitial] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Initial entrance animation
    const initTimer = setTimeout(() => {
      setIsInitial(true);
    }, 1500);
    
    // Unlock animation after entrance
    const animTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 4500);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(animTimer);
    };
  }, []);

  const handleWheel = (e) => {
    if (isAnimating) return;
    
    if (e.deltaY < 0) {
      // scroll up
      if (curSlide > 1) {
        changeSlide(curSlide - 1);
      }
    } else {
      // scroll down
      if (curSlide < 2) {
        changeSlide(curSlide + 1);
      }
    }
  };

  const changeSlide = (targetSlide) => {
    if (isAnimating || targetSlide === curSlide) return;
    setIsAnimating(true);
    setCurSlide(targetSlide);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
  };

  return (
    <div className="opus-slider-container" onWheel={handleWheel}>
      <div className={`app ${isInitial ? 'initial' : ''} ${curSlide === 2 ? 'active' : ''}`}>
        <div className="app__bgimg">
          {/* Tech/Cyber/AI related background images */}
          <div 
            className="app__bgimg-image app__bgimg-image--1" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')` }} 
          />
          <div 
            className="app__bgimg-image app__bgimg-image--2" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')` }} 
          />
        </div>
        
        {/* Foreground element, leaving blank or can add an overlapping image if needed */}
        <div className="app__img">
        </div>
        
        <div className="app__text app__text--1">
          <div className="app__text-line app__text-line--4">SkillNux</div>
          <div className="app__text-line app__text-line--3">Student Experts</div>
          <div className="app__text-line app__text-line--2">LEARN | CONNECT | GROW</div>
          <div className="app__text-line app__text-line--1">
            <img src="/logo.png" alt="SkillNux Logo" />
          </div>
        </div>
        
        <div className="app__text app__text--2">
          <div className="app__text-line app__text-line--4">Top Skills</div>
          <div className="app__text-line app__text-line--3">On Demand</div>
          <div className="app__text-line app__text-line--2">WEB DEV | UI/UX | MARKETING</div>
          <div className="app__text-line app__text-line--1">
            <img src="/logo.png" alt="SkillNux Logo" />
          </div>
        </div>
      </div>
      
      {/* Pagination / Navigation */}
      <div className="pages">
        <ul className="pages__list">
          <li 
            className={`pages__item pages__item--1 ${curSlide === 1 ? 'page__item-active' : ''}`} 
            onClick={() => changeSlide(1)}
          ></li>
          <li 
            className={`pages__item pages__item--2 ${curSlide === 2 ? 'page__item-active' : ''}`} 
            onClick={() => changeSlide(2)}
          ></li>
        </ul>
      </div>
    </div>
  );
}
