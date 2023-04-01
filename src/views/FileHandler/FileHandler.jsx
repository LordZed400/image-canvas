import { React, useState, useRef } from 'react';

import CustomCanvas from '../../components/Canvas/Canvas';
import ButtonComponent from '../../components/Button/Button';

import './FileHandler.scss';
import FileInput from '../../components/FileInput/FileInput';

const FileHandler = () => {
  const [canvasImage, setCanvasImage] = useState();
  const [fileInput, setFileInput] = useState("");
  const [fileName, setFileName] = useState("No file uploaded");
  
  const handleFileUpload = (inputValue) => {
    setCanvasImage(URL.createObjectURL(inputValue.files[0]));
    setFileInput(inputValue.value);
    setFileName(inputValue.files[0].name);
  }

  const clearFile = () => {
    setFileInput("");
    setCanvasImage();
    setFileName("No file uploaded");
  }

  return (
    <div className="file-handler-container">
      <FileInput clickEvent={handleFileUpload} clearEvent={clearFile} fileInput={fileInput} />
      {fileName}
      <ButtonComponent clickEvent={clearFile}>Clear</ButtonComponent>
      <CustomCanvas url={canvasImage} />
    </div>
  );
}

export default FileHandler;