import { React, useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Line, Circle, Path } from "react-konva";
import useImage from "use-image";

import "./Canvas.scss";
import ImageScaleHelper from "../../helpers/ImageScaleHelper";

const CanvasComponent = ({ url, clearCanvas , strokeWidth, toolType }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [enableCursor, setEnableCursor] = useState(false);
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const [image] = useImage(url);
  const imageRef = useRef();

  useEffect(() => {
    if (!url) {
      setLines([]);
    }
  }, [url]);

  useEffect(() => {
    setLines([]);
  }, [clearCanvas]);

  // when image is loaded we need to cache the shape
  useEffect(() => {
    if (image) {
      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      imageRef.current.cache();
    }
  }, [image]);

  const windowWidth = window.innerWidth * 0.3;

  const LoadImage = () => {
    if (image) {
      const canvasInfo = {
        width: windowWidth,
        height: windowWidth,
      };

      const imageInfo = {
        width: image.width,
        height: image.height,
      };

      const scaleInfo = ImageScaleHelper.scaleImage(
        canvasInfo,
        imageInfo,
        false
      );

      return (
        <Image
          ref={imageRef}
          image={image}
          x={scaleInfo.x}
          y={scaleInfo.y}
          width={scaleInfo.width}
          height={scaleInfo.height}
          // filters={[Konva.Filters.Pixelate]}
          // pixelSize={10}
        />
      );
    }
  };

  const handleMouseDown = (e) => {
    if (!url) {
      return;
    }
    isDrawing.current = true;
    const mousePosition = e.target.getStage().getPointerPosition();
    setMousePos({
      x: mousePosition.x,
      y: mousePosition.y,
    });

    if (lines.length === 0) {
      setLines([
        {
          tool: toolType,
          points: [mousePosition.x, mousePosition.y],
          width: strokeWidth,
        },
      ]);
    }
  };

  const handleMouseMove = (e) => {
    if (!url) {
      return;
    }
    const stage = e.target.getStage();
    const mousePosition = stage.getPointerPosition();
    setMousePos({
      x: mousePosition.x,
      y: mousePosition.y,
    });
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([
      mousePosition.x,
      mousePosition.y,
    ]);

    // replace last
    // lines.splice(lines.length - 1, 1, lastLine);
    // setLines(lines.concat());
    setLines([lastLine]);

    // setLines([
    //   ...lines,
    //   {
    //     tool: toolType,
    //     points: [mousePosition.x, mousePosition.y],
    //     width: strokeWidth,
    //   },
    // ]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="canvas-container">
      {!url && (
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
          onMouseEnter={() => { setEnableCursor(true) }}
          onMouseLeave={() => { setEnableCursor(false) }}
        >
          <Layer>{url && <LoadImage />}</Layer>
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={line.width * 2}
                opacity={line.tool === "eraser" ? 1 : 0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
          <Layer>
            <Circle
              x={mousePos.x}
              y={mousePos.y}
              radius={url && enableCursor ? strokeWidth : 0}
              stroke="#ffffff"
              strokeWidth={5}
              fill="#df4b26"
              opacity={0.5}
              filters={[Konva.Filters.Pixelate]}
              pixelSize={10}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasComponent;
