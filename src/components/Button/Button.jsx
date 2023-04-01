import React from 'react';
import { Button } from '@mui/material';

import './Button.scss';

const ButtonComponent = ({children, clickEvent, disabled}) => {

  return (
    <div className="button-container">
      <Button onClick={clickEvent} className="button" variant="contained" disabled={disabled}>
        {children}
      </Button>
    </div>
  );
}

export default ButtonComponent;