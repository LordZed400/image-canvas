import { React, useState, useEffect } from "react";
import {
  Slider,
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Close, Inbox, Mail } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import CustomCanvas from "../../components/Canvas/Canvas";
import ButtonComponent from "../../components/Button/Button";
import FileInput from "../../components/FileInput/FileInput";

import "./FileHandler.scss";
import CanvasHelper from "../../helpers/CanvasHelper";

const FileHandler = () => {
  const [canvasImage, setCanvasImage] = useState();
  const [file, setFile] = useState();
  const [fileInput, setFileInput] = useState("");
  const [stroke, setStroke] = useState(5);
  const [tool, setTool] = useState("brush");
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setCanvasImage(location.state.image);
    }
  }, [location.state]);

  const navigateToHome = () => {
    navigate("/");
  };

  const handleFileUpload = (inputValue) => {
    setCanvasImage(URL.createObjectURL(inputValue.files[0]));
    setFileInput(inputValue.value);
    setFile(inputValue.files[0]);
  };

  const clearFile = () => {
    setFileInput("");
    setFile();
    setCanvasImage();
  };

  const setToolType = (tool) => {
    setTool(tool);
  };

  const handleSliderChange = (event, newValue) => {
    setStroke(newValue);
  };

  return (
    <div className="file-handler-container">
      <Drawer
        variant="permanent"
        anchor="left"
        className="drawer-container"
        open={open}
      >
        <div className="drawer-header">
          <div className="drawer-text">Information</div>
          <div className="drawer-icon">
            <IconButton onClick={() => navigateToHome()}>
              <Close />
            </IconButton>
          </div>
        </div>
        <Divider />
        {canvasImage && (
          <div className="drawer-item-details-container">
            <List className="drawer-list">
              <ListItem className="drawer-list-item">
                <span className="drawer-list-label">Image Details: </span>
              </ListItem>
              <ListItem className="drawer-list-item">
                <div className="drawer-list-stack vertical-stack">
                  <div className="drawer-list-stack-item">
                    Name:{" "}
                    {file
                      ? file.name
                      : CanvasHelper.getStaticFilename(canvasImage)}
                  </div>
                </div>
              </ListItem>
            </List>
            <Divider />
          </div>
        )}
        <div className="drawer-list-tool-container">
          <List className="drawer-list drawer-list-stroke">
            <ListItem className="drawer-list-item">
              <span className="drawer-list-label">Stroke Size: </span> {stroke}
            </ListItem>
            <ListItem className="drawer-list-item">
              <div className="drawer-list-stack">
                <div className="drawer-list-stack-item min-value">5</div>
                <Slider
                  min={5}
                  max={100}
                  step={1}
                  aria-label="Volume"
                  valueLabelDisplay="auto"
                  value={stroke}
                  onChange={handleSliderChange}
                />
                <div className="drawer-list-stack-item max-value">100</div>
              </div>
            </ListItem>
          </List>
          <List className="drawer-list drawer-list-tool">
            <ListItem className="drawer-list-item">
              <span className="drawer-list-label">Tool type: </span>{" "}
              {tool.charAt(0).toUpperCase() + tool.substring(1)}
            </ListItem>
          </List>
          <Divider />
        </div>
        <List className="drawer-list">
          {["Stroke", "Zoom", "Brush"].map((text, index) => (
            <ListItem key={text} className="drawer-list-item">
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <CustomCanvas
        url={canvasImage}
        strokeWidth={stroke}
        toolType={tool}
        setToolType={setToolType}
        clearFile={clearFile}
        clickEvent={handleFileUpload}
        fileInput={fileInput}
      />
    </div>
  );
};

export default FileHandler;
