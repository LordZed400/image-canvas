import React from 'react';
import { Typography } from '@mui/material';

import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="header-container">
        <div className="title-container">
        <Typography className="title" variant="h1" component="h2">
          Image Canvas
        </Typography>
        </div>
      </div>
      <div className="content-container">
        <div className="content">
          <p>Page Content</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;