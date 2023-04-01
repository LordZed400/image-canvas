import React from 'react';
import { Button } from '@mui/material';

import './Button.scss';

const ButtonComponent = ({children, clickEvent}) => {

  return (
    <div className="button-container">
      <Button onClick={clickEvent} className="button" variant="contained">
        {children}
      </Button>
    </div>
  );
}

export default ButtonComponent;