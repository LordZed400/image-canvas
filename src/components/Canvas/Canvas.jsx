import { React, useState, useRef } from 'react';
import { Stage, Layer, Image, Line } from 'react-konva';
import useImage from 'use-image';

import './Canvas.scss';

const CanvasComponent = ({url}) => {
  const [tool, setTool] = useState('brush');
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const windowWidth = window.innerWidth * 0.3;

  const LoadImage = () => {
    const [image] = useImage(url);
    return <Image image={image} width={windowWidth} height={windowWidth} />;
  };

  const handleMouseDown = (e) => {
    if (!url) {
      return;
    }
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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
      <Stage 
        width={windowWidth}
        height={windowWidth}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        >
        <Layer>
          <LoadImage />
        </Layer>
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
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
  );
}

export default CanvasComponent;