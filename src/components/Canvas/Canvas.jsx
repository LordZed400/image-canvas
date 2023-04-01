import { React, useState } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import './Canvas.scss';

const CanvasComponent = ({url}) => {
  const [cursor, setCursor] = useState({ x: null, y: null });

  const windowWidth = window.innerWidth * 0.3;

  const LoadImage = () => {
    const [image] = useImage(url);
    return <Image image={image} />;
  };

  const handleMouseMove = (event) => {
    const stage = event.currentTarget;
    setCursor(stage.getPointerPosition());
  }

  return (
    <div className="canvas-container">
      <Stage 
        width={windowWidth}
        height={windowWidth}
        onMouseMove={handleMouseMove}
        >
        <Layer>
          <LoadImage />
        </Layer>
      </Stage>
    </div>
  );
}

export default CanvasComponent;