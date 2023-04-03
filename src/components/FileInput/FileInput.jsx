import { React, useRef } from "react";

import { ReactComponent as UploadSvg } from "./../../assets/Images/upload.svg";

import "./FileInput.scss";

const FileInput = ({ clickEvent, clearEvent, fileInput }) => {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    if (event.target.files.length) {
      clickEvent(event.target);
    } else {
      clearEvent();
    }
  };

  return (
    <div className="file-input-container">
      <div className="input-icon" onClick={() => handleClick()}>
        <UploadSvg className="svg-img" />
      </div>
      <input
        type="file"
        className="input-element"
        ref={hiddenFileInput}
        value={fileInput}
        onChange={handleChange}
      />
    </div>
  );
};

export default FileInput;
