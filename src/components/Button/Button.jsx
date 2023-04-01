import React from 'react';
import { Button } from '@mui/material';

import './Button.scss';

const ButtonComponent = ({children, clickEvent, disabled, size}) => {

  return (
    <div className="button-container">
      <Button onClick={clickEvent} className={`button button-size-${size}`} variant="contained" disabled={disabled}>
        {children}
      </Button>
    </div>
  );
}

export default ButtonComponent;