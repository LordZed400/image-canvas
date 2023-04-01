import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import './Canvas.scss';

const CanvasComponent = ({url}) => {
  const windowWidth = window.innerWidth * 0.3;

  const LoadImage = () => {
    const [image] = useImage(url);
    return <Image image={image} />;
  };  

  return (
    <div className="canvas-container">
      <Stage width={windowWidth} height={windowWidth}>
        <Layer>
          <LoadImage />
        </Layer>
      </Stage>
    </div>
  );
}

export default CanvasComponent;