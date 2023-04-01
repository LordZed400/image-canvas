import { React, useRef } from 'react';
import ButtonComponent from '../Button/Button';

import './FileInput.scss';

const FileInput = ({clickEvent, clearEvent, fileInput}) => {
  const hiddenFileInput = useRef(null);
  
  const handleClick = () => {
    hiddenFileInput.current.click();
  }

  const handleChange = event => {
    if (event.target.files.length) {
      clickEvent(event.target);
    } else {
      clearEvent();
    }
  };

  return (
    <div className="file-input-container">
      <ButtonComponent clickEvent={handleClick}>Upload</ButtonComponent>
      <input type="file" className="input-element" ref={hiddenFileInput} value={fileInput} onChange={handleChange}/>
    </div>
  );
};

export default FileInput;