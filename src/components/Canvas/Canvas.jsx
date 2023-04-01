import { React, useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Line } from 'react-konva';
import useImage from 'use-image';

import './Canvas.scss';
import ImageScaleHelper from '../../helpers/ImageScaleHelper';

const CanvasComponent = ({url, strokeWidth}) => {
  const [tool, setTool] = useState('brush');
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!url) {
      setLines([]);
    }
  }, [url]);

  const windowWidth = window.innerWidth * 0.3;

  const LoadImage = () => {
    const [image] = useImage(url);

    if (image) {
      const canvasInfo = {
        width: windowWidth,
        height: windowWidth
      };
  
      const imageInfo = {
        width: image.width,
        height: image.height,
      };
  
      const scaleInfo = ImageScaleHelper.scaleImage(canvasInfo, imageInfo, false);
  
      return <Image image={image} x={scaleInfo.x} y={scaleInfo.y} width={scaleInfo.width} height={scaleInfo.height} />;
    } 
  };

  const handleMouseDown = (e) => {
    if (!url) {
      return;
    }
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], width: strokeWidth }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="canvas-container">
      { !url && (
        <div className="text-container">
          Please upload an Image
          <br />
          You can draw on top of the image after adding it
        </div>
      )}
      <div className="stage-container">
        <Stage 
          width={windowWidth}
          height={windowWidth}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          >
          <Layer>
            { url && <LoadImage /> }
          </Layer>
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={line.width}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default CanvasComponent;