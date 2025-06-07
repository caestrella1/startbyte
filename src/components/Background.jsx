import React from 'react';
import backgroundImage from '../assets/background.jpg';

export default function Background() {
  return (
    <>
      <div 
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-black opacity-50 backdrop-blur-lg"></div>
      </div>
    </>
  );
}
