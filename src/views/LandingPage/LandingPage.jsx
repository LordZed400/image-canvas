import React from 'react';
import { Typography } from '@mui/material';

import FileHandler from '../FileHandler/FileHandler';

import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="header-container">
        <div className="title-container">
          <div className="outer-title">
            <Typography className="title" variant="h2" component="h2">
              Image Canvas
            </Typography>
          </div>
        </div>
      </div>
      <div className="content-container">
        <div className="content">
          <FileHandler />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;