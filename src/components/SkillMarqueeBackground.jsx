import React from 'react';
import './SkillMarqueeBackground.css';

const SKILLS = [
  "Web Development", "UI/UX Design", "Digital Marketing", "SEO Optimization",
  "Video Editing", "Content Writing", "Data Analysis", "Excel Experts",
  "ChatGPT Prompting", "App Development", "Graphic Design", "Brand Identity",
  "Copywriting", "3D Animation", "Social Media Management", "E-commerce"
];

// Helper to repeat and shuffle skills array
const renderSkills = () => {
  // Shuffle array randomly
  const shuffled = [...SKILLS].sort(() => Math.random() - 0.5);
  // We duplicate the list multiple times so the row is extremely long and won't gap during animation
  const repeated = [...shuffled, ...shuffled, ...shuffled];
  return repeated.map((skill, index) => (
    <span key={index}>{skill} •</span>
  ));
};

export default function SkillMarqueeBackground() {
  return (
    <div className="marquee-bg-container">
      {/* Row 1: Moves Left, Fast */}
      <div className="marquee-row scroll-left speed-fast">
        {renderSkills()}
      </div>
      
      {/* Row 2: Moves Right, Medium speed */}
      <div className="marquee-row scroll-right speed-med">
        {renderSkills()}
      </div>
      
      {/* Row 3: Moves Left, Slow */}
      <div className="marquee-row scroll-left speed-slow">
        {renderSkills()}
      </div>

      {/* Row 4: Moves Right, Fast */}
      <div className="marquee-row scroll-right speed-fast">
        {renderSkills()}
      </div>

      {/* Row 5: Moves Left, Medium */}
      <div className="marquee-row scroll-left speed-med">
        {renderSkills()}
      </div>
      
      {/* Row 6: Moves Right, Slow */}
      <div className="marquee-row scroll-right speed-slow">
        {renderSkills()}
      </div>
    </div>
  );
}
