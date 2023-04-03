import React from "react";
import { Button } from "@mui/material";

import "./Button.scss";

const ButtonComponent = ({
  children,
  clickEvent,
  disabled,
  size,
  variant = "contained",
}) => {
  return (
    <div className="button-container">
      <Button
        onClick={clickEvent}
        className={`button button-size-${size}`}
        variant={variant}
        disabled={disabled}
      >
        {children}
      </Button>
    </div>
  );
};

export default ButtonComponent;
