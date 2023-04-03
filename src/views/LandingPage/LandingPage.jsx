import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { imageSet } from '../../constants/imageSet';

import ButtonComponent from '../../components/Button/Button';

import './LandingPage.scss';

const LandingPage = () => {
  const navigate = useNavigate();

  const navigateWithoutImage = () => {
    navigate("/canvas");
  }

  const navigateWithImage = (image, index) => {
    navigate("/canvas", { state: {image, index} });
  }

  return (
    <div className="landing-page-container">
      <div className="header-container">
        <div className="title-container">
          <div className="outer-title">
            <Typography className="title" variant="h4" component="div">
              Image Canvas
            </Typography>
          </div>
        </div>
      </div>
      <div className="content-container">
        <div className="content">
          <div className="text-container">
            <Grid className='grid-container' container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid className='grid-item main-title' item xs={4} sm={4} md={4}>  
                <div className="label">Choose any of the following images to draw on</div>
              </Grid>
              <Grid className='grid-item divider-text' item xs={4} sm={4} md={4}>  
                <div className="label">or</div>
              </Grid>
              <Grid className='grid-item navigate-link' item xs={4} sm={4} md={4}>  
                <ButtonComponent clickEvent={navigateWithoutImage} variant="outlined">Upload an Image</ButtonComponent>
              </Grid>
            </Grid>
          </div>
          <div className="image-container">
            <Grid className='image-grid-container' container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              { imageSet.map( (item, index) => (
                <Grid item xs={3} sm={3} md={3} key={index} >
                  <div className="image-set-container" onClick={() => navigateWithImage(item, index)}>
                    <Box className="image-set" sx={{ backgroundImage: `url(${item})` }}></Box>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;