import { React, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Slider, Stack, Drawer, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronLeft, ChevronRight, Menu, Inbox, Mail } from '@mui/icons-material'

import CustomCanvas from '../../components/Canvas/Canvas';
import ButtonComponent from '../../components/Button/Button';
import FileInput from '../../components/FileInput/FileInput';

import './FileHandler.scss';

const FileHandler = () => {
  const [canvasImage, setCanvasImage] = useState();
  const [fileInput, setFileInput] = useState("");
  const [stroke, setStroke] = useState(5);
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleFileUpload = (inputValue) => {
    setCanvasImage(URL.createObjectURL(inputValue.files[0]));
    setFileInput(inputValue.value);
  }

  const clearFile = () => {
    setFileInput("");
    setCanvasImage();
  }

  const handleSliderChange = (evemt, newValue) => {
    setStroke(newValue);
  };

  return (
    <div className="file-handler-container">
      <div className="drawer-button">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          className={`drawer-button-icon ${ open && "open" }`}
        >
          <Menu />
        </IconButton>
      </div>
      <Drawer
        variant="persistent"
        anchor="left"
        className="drawer-container"
        open={open}
      >
        <div className="drawer-header">
          <div className="drawer-text">
            Information
          </div>
          <div className="drawer-icon">
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </div>
        </div>
        <Divider />
        <List className='drawer-list'>
          <ListItem className='drawer-list-item'>
            <span className="drawer-list-label">Stroke Size: </span> { stroke }
          </ListItem>

          <ListItem className='drawer-list-item'>
            <div className='drawer-list-stack'>
              <div className="min-value">
                5
              </div>
              <Slider min={5} max={100} step={1} aria-label="Volume" valueLabelDisplay="auto" value={stroke} onChange={handleSliderChange} />
              <div className="max-value">
                100
              </div>
            </div>
          </ListItem>
        </List>
        <Divider />
        <List className='drawer-list'>
          {['Stroke', 'Zoom', 'Brush'].map((text, index) => (
            <ListItem key={text} className='drawer-list-item'>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div className="button-container">
        <div className="upload-btn">
          <FileInput clickEvent={handleFileUpload} clearEvent={clearFile} fileInput={fileInput} />
        </div>
        <div className="clear-btn">
          <ButtonComponent clickEvent={clearFile} disabled={fileInput === ""}>Clear</ButtonComponent>
        </div>
      </div>
      <CustomCanvas url={canvasImage} strokeWidth={stroke} />
    </div>
  );
}

export default FileHandler;