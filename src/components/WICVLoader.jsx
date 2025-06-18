import React from 'react';
import './WICVLoader.css';

const WICVLoader = () => {
  return (
    <div className="wicv-loader-container">
      <div className="wicv-logo">
        <span className="wi">WI</span>
        <span className="cv-arrows">
          <span className="arrow-left">{'<'}</span>
          <span className="cv-text">CV</span>
          <span className="arrow-right">{'>'}</span>
        </span>
      </div>
    </div>
  );
};

export default WICVLoader;