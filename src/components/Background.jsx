import React from 'react';
import backgroundImage from '../assets/background.jpg';

export default function Background() {
  return (
    <>
      <div 
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-lg" />
    </>
  );
}
