import React from 'react';

import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="header-container">
        <div className="title-container">
          <Typography className="title" component="div">
            Image Canvas
          </Typography>
        </div>
      </div>
      <div className="content-container">
        <div className="content">
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;