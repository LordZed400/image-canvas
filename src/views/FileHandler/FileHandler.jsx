import { React, useState } from 'react';

import CustomCanvas from '../../components/Canvas/Canvas';
import ButtonComponent from '../../components/Button/Button';
import FileInput from '../../components/FileInput/FileInput';

import './FileHandler.scss';

const FileHandler = () => {
  const [canvasImage, setCanvasImage] = useState();
  const [fileInput, setFileInput] = useState("");
  
  const handleFileUpload = (inputValue) => {
    setCanvasImage(URL.createObjectURL(inputValue.files[0]));
    setFileInput(inputValue.value);
  }

  const clearFile = () => {
    setFileInput("");
    setCanvasImage();
  }

  return (
    <div className="file-handler-container">
      <div className="button-container">
        <div className="upload-btn">
          <FileInput clickEvent={handleFileUpload} clearEvent={clearFile} fileInput={fileInput} />
        </div>
        <div className="clear-btn">
          <ButtonComponent clickEvent={clearFile} disabled={fileInput === ""}>Clear</ButtonComponent>
        </div>
      </div>
      <CustomCanvas url={canvasImage} />
    </div>
  );
}

export default FileHandler;