export function getVideoUrl(skill) {
  if (!skill) return '/bg1.mp4';
  const sk = skill.toLowerCase();
  
  // Tech & Development
  if (
    sk.includes('dev') || 
    sk.includes('tech') || 
    sk.includes('web') || 
    sk.includes('code') || 
    sk.includes('landing') || 
    sk.includes('database') || 
    sk.includes('api') || 
    sk.includes('setup') || 
    sk.includes('store') || 
    sk.includes('website') || 
    sk.includes('app') || 
    sk.includes('chatbot') ||
    sk.includes('program')
  ) {
    return '/bg2.mp4';
  }
  
  // Design & Creative
  if (
    sk.includes('design') || 
    sk.includes('creative') || 
    sk.includes('video') || 
    sk.includes('thumbnail') || 
    sk.includes('editing') || 
    sk.includes('logo') || 
    sk.includes('brand') || 
    sk.includes('ui') || 
    sk.includes('ux') || 
    sk.includes('poster') || 
    sk.includes('graphics') || 
    sk.includes('reels') || 
    sk.includes('photo') || 
    sk.includes('packag') || 
    sk.includes('pitch') || 
    sk.includes('canva') ||
    sk.includes('art')
  ) {
    return '/bg3.mp4';
  }
  
  // Marketing & Sales
  if (
    sk.includes('market') || 
    sk.includes('seo') || 
    sk.includes('sem') || 
    sk.includes('social') || 
    sk.includes('content') || 
    sk.includes('write') || 
    sk.includes('email') || 
    sk.includes('ads') || 
    sk.includes('outreach') || 
    sk.includes('reputation') || 
    sk.includes('whatsapp') || 
    sk.includes('blog')
  ) {
    return '/bg4.mp4';
  }
  
  // Default (AI, Business, general)
  return '/bg1.mp4';
}
