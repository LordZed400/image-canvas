import { React, useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Line, Circle, Path, Group } from "react-konva";
import useImage from "use-image";

import ImageScaleHelper from "../../helpers/ImageScaleHelper";
import { brushTools } from "../../constants/brushTools";

import "./Canvas.scss";
import { Button, Divider } from "@mui/material";

const CanvasComponent = ({ url, clearCanvas , strokeWidth, toolType }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [enableCursor, setEnableCursor] = useState(false);
  const [brush, setBrush] = useState([]);
  const [lasso, setLasso] = useState([]);
  const [path, setPath] = useState([]);
  const isDrawing = useRef(false);
  const [image] = useImage(url);
  const imageRef = useRef();

  const [stageInfo, setStageInfo] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    draggable: false
  });
  
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageInfo({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
      draggable: stageInfo.draggable
    });
  };

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

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight - 200;

  const LoadImage = () => {
    if (image) {
      const canvasInfo = {
        width: windowWidth * 0.3,
        height: windowWidth * 0.3,
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
          // x={windowWidth / 2}
          // y={windowHeight / 2}
          // width={scaleInfo.width}
          // height={scaleInfo.height}
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
        setupLassoInfo(true, true);
        setupBrushInfo(true, true);
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
        setupLassoInfo(false, true);
        setupBrushInfo(false, true);
        break;
      default:
        setupBrushInfo(false);
        break;
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const setupLassoInfo = (initial, eraser) => {
    if (eraser && lasso.length === 0) {
      return;
    }
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

  const setupBrushInfo = (initial, eraser) => {
    if (eraser && brush.length === 0) {
      return;
    }
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
          width={windowWidth * 0.3}
          height={windowWidth * 0.3}
          scaleX={stageInfo.stageScale}
          scaleY={stageInfo.stageScale}
          x={stageInfo.stageX}
          y={stageInfo.stageY}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseEnter={() => { setEnableCursor(true); setStageInfo({...stageInfo, ...{ draggable: false}})}}
          onMouseLeave={() => { setEnableCursor(false); setStageInfo({...stageInfo, ...{ draggable: true}})}}
          onWheel={handleWheel}
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
            { url && enableCursor &&
              (
                <Circle
                  x={mousePos.x}
                  y={mousePos.y}
                  radius={strokeWidth}
                  stroke="#ffffff"
                  strokeWidth={5}
                  fill="#df4b26"
                  opacity={0.5}
                  filters={[Konva.Filters.Pixelate]}
                  pixelSize={10}
                />
              )
            }
          </Layer>
        </Stage>
      </div>
      <div className="toolbox-container">
        <div className="toolbox-panel">
          <Button className="brush-tool" variant="text">
            <img className="brush-img" src={brushTools.brush} alt="brush-tool" />
          </Button>
          <Button className="lasso-tool" variant="text">
            <img className="brush-img" src={brushTools.lasso} alt="lasso-tool" />
          </Button>
          <Button className="path-tool" variant="text">
            <img className="brush-img" src={brushTools.polyline} alt="path-tool" />
          </Button>
          <Button className="eraser-tool" variant="text">
            <img className="brush-img" src={brushTools.eraser} alt="eraser-tool" />
          </Button>
        </div>
      </div>
      <div className="action-container">
        <div className="action-panel">
          <Button className="clear-tool" variant="text">
            <img className="action-img" src={brushTools.clear} alt="clear-tool" />
          </Button>
          <Button className="remove-tool" variant="text">
            <img className="action-img" src={brushTools.remove} alt="remove-tool" />
          </Button>
          <Divider orientation="vertical" flexItem />
          <Button className="pan-tool" variant="text">
            <img className="action-img" src={brushTools.pan} alt="pan-tool" />
          </Button>
        </div>
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
