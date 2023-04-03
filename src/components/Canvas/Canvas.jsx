import { React, useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Line, Circle, Path, Group } from "react-konva";
import useImage from "use-image";

import "./Canvas.scss";
import ImageScaleHelper from "../../helpers/ImageScaleHelper";

const CanvasComponent = ({ url, clearCanvas , strokeWidth, toolType }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [enableCursor, setEnableCursor] = useState(false);
  const [brush, setBrush] = useState([]);
  const [lasso, setLasso] = useState([]);
  const [path, setPath] = useState([]);
  const isDrawing = useRef(false);
  const [image] = useImage(url);
  const imageRef = useRef();

  useEffect(() => {
    if (!url) {
      setBrush([]);
      setLasso([]);
      setPath([]);
    }
  }, [url]);

  useEffect(() => {
    setBrush([]);
    setLasso([]);
    setPath([]);
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

    switch (toolType) {
      case "lasso":
        setupLassoInfo(true);
        break;
      case "path":
        setupPathInfo(true);
        break;
      case "eraser":
        setupLassoInfo(true);
        setupBrushInfo(true);
        break;
      default:
        setupBrushInfo(true);
        break;
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
    
    switch (toolType) {
      case "lasso":
        setupLassoInfo(false);
        break;
      case "path":
        setupPathInfo(false);
        break;
      case "eraser":
        setupLassoInfo(false);
        setupBrushInfo(false);
        break;
      default:
        setupBrushInfo(false);
        break;
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const setupLassoInfo = (initial) => {
    if (initial) {
      if (lasso.length === 0) {
        setLasso([
          ...lasso,
          {
            tool: toolType,
            points: [mousePos.x, mousePos.y],
            width: strokeWidth,
          },
        ]);
        return;
      } else if(toolType === "eraser") {
        if (lasso.length !== 2) {
          setLasso([
            ...lasso,
            {
              tool: toolType,
              points: [mousePos.x, mousePos.y],
              width: strokeWidth,
            },
          ]);
        }
        return;
      }
    }
    const pointIndex = toolType === "eraser" ? 1 : 0;
    let lastLasso = lasso[pointIndex];
    lastLasso.points = lastLasso.points.concat([
      mousePos.x,
      mousePos.y,
    ]);

    lasso.splice(pointIndex, 1, lastLasso);
    setLasso(lasso.concat());
  };

  const setupPathInfo = (initial) => {
    if (initial) {
      setPath([
        ...path,
        {
          tool: toolType,
          points: [{x: mousePos.x, y: mousePos.y}],
          width: strokeWidth,
        },
      ]);
      return;
    }
    const newPoints = {
      x: mousePos.x,
      y: mousePos.y,
    };
    let lastPath = path[path.length - 1];
    lastPath.points = lastPath.points.concat(newPoints);

    path.splice(path.length - 1, 1, lastPath);
    setPath(path.concat());
  }

  const setupBrushInfo = (initial) => {
    if (initial) {
      setBrush([
        ...brush,
        {
          tool: toolType,
          points: [mousePos.x, mousePos.y],
          width: strokeWidth,
        },
      ]);
      return;
    }
    const newPoints = [
      mousePos.x,
      mousePos.y,
    ];
    let lastBrush = brush[brush.length - 1];
    lastBrush.points = lastBrush.points.concat(newPoints);

    // replace last
    brush.splice(brush.length - 1, 1, lastBrush);
    setBrush(brush.concat());
  }

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
            {brush.map((data, i) => (
              <CreateLines key={i} line={data} />
            ))}
            {lasso.map((data, i) => (
              <CreateLines key={i} line={data} />
            ))}
            {path.map((data, i) => (
              <CreateShape key={i} line={data} />
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

const CreateShape = (value) => {
  const svgPath = value.line.points.reduce(
    (path, point, index) =>
      `${path}${index === 0 ? "M" : "L"}${point.x},${point.y}`,
    ""
  );

  return (
    <Group>
      <Path
        x={value.line.points.x}
        y={value.line.points.y}
        data={svgPath}
        fill="#df4b26"
        opacity={value.line.tool === "eraser" ? 1 : 0.5}
        globalCompositeOperation={
          value.line.tool === "eraser" ? "destination-out" : "source-over"
        }
      />
    </Group>
  );
}

const CreateLines = (value) => {
  return (
    <Group>
      <Line
        points={value.line.points}
        stroke="#df4b26"
        strokeWidth={value.line.width * 2}
        opacity={value.line.tool === "eraser" ? 1 : 0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={
          value.line.tool === "eraser" ? "destination-out" : "source-over"
        }
      />
    </Group>
  );
}
export default CanvasComponent;
