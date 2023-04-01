import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import './Canvas.scss';

const CanvasComponent = ({url}) => {

  const LoadImage = () => {
    const [image] = useImage(url);
    return <Image image={image} />;
  };  

  return (
    <div className="canvas-container">
      Canvas
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <LoadImage />
        </Layer>
      </Stage>
    </div>
  );
}

export default CanvasComponent;