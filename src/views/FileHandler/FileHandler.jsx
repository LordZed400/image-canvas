import { React, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Slider, Drawer, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronLeft, ChevronRight, Menu, Inbox, Mail } from '@mui/icons-material'

import CustomCanvas from '../../components/Canvas/Canvas';
import ButtonComponent from '../../components/Button/Button';
import FileInput from '../../components/FileInput/FileInput';

import './FileHandler.scss';

const FileHandler = () => {
  const [canvasImage, setCanvasImage] = useState();
  const [file, setFile] = useState();
  const [fileInput, setFileInput] = useState("");
  const [stroke, setStroke] = useState(5);
  const [tool, setTool] = useState("pen");
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
    setFile(inputValue.files[0]);
  }

  const clearFile = () => {
    setFileInput("");
    setFile();
    setCanvasImage();
  }

  const handleSliderChange = (evemt, newValue) => {
    setStroke(newValue);
  };

  return (
    <div className="file-handler-container">
      <div className="drawer-button">
        <ButtonComponent clickEvent={handleDrawerToggle} size="medium">
          { !open && "Open Toolbox"}
          { open && "Close Toolbox"}
        </ButtonComponent>
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
        {
          canvasImage && (
            <div className="drawer-item-details-container">
              <List className='drawer-list'>
                <ListItem className='drawer-list-item'>
                  <span className="drawer-list-label">Image Details: </span>
                </ListItem>
                <ListItem className='drawer-list-item'>
                  <div className='drawer-list-stack vertical-stack'>
                    <div className="drawer-list-stack-item">
                      Name: {file.name}
                    </div>
                  </div>
                </ListItem>
              </List>
              <Divider />
            </div>
          )
        }
        <div className="drawer-list-tool-container">
          <List className='drawer-list drawer-list-stroke'>
            <ListItem className='drawer-list-item'>
              <span className="drawer-list-label">Stroke Size: </span> { stroke }
            </ListItem>
            <ListItem className='drawer-list-item'>
              <div className='drawer-list-stack'>
                <div className="drawer-list-stack-item min-value">
                  5
                </div>
                <Slider min={5} max={100} step={1} aria-label="Volume" valueLabelDisplay="auto" value={stroke} onChange={handleSliderChange} />
                <div className="drawer-list-stack-item max-value">
                  100
                </div>
              </div>
            </ListItem>
          </List>
          <List className='drawer-list drawer-list-tool'>
            <ListItem className='drawer-list-item'>
              <span className="drawer-list-label">Tool type: </span> { tool === "pen" ? "Brush" : "Eraser" }
            </ListItem>
            <ListItem className='drawer-list-item'>
              <div className='drawer-list-stack'>
                <div className="drawer-list-stack-item">
                  <ButtonComponent clickEvent={() => { setTool("pen") }}>Brush</ButtonComponent>
                </div>
                <div className="drawer-list-stack-item">
                  <ButtonComponent clickEvent={() => { setTool("eraser") }}>Eraser</ButtonComponent>
                </div>
              </div>
            </ListItem>
          </List>
          <Divider />
        </div>
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
          <ButtonComponent clickEvent={clearFile} disabled={fileInput === ""} size="small">Clear</ButtonComponent>
        </div>
      </div>
      <CustomCanvas url={canvasImage} strokeWidth={stroke} toolType={tool}/>
    </div>
  );
}

export default FileHandler;