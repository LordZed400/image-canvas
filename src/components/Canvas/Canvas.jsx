import { React, useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Line, Circle, Path, Group } from "react-konva";
import useImage from "use-image";
import { Button, Divider, Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

import ImageScaleHelper from "./../../helpers/ImageScaleHelper";
import { brushTools } from "./../../constants/brushTools";
import FileInput from "../FileInput/FileInput";

import "./Canvas.scss";
import CanvasHelper from "../../helpers/CanvasHelper";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 50,
    textAlign: "center",
  },
});

const CanvasComponent = ({
  url,
  strokeWidth,
  toolType,
  setToolType,
  clearFile,
  clickEvent,
  fileInput,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [enableCursor, setEnableCursor] = useState(false);
  const [brush, setBrush] = useState([]);
  const [lasso, setLasso] = useState([]);
  const [path, setPath] = useState([]);
  const isDrawing = useRef(false);
  const [image] = useImage(url);
  const imageRef = useRef();
  const stageRef = useRef();

  const [stageInfo, setStageInfo] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    draggable: false,
  });

  const resetStageInfo = () => {
    setStageInfo({
      stageScale: 1,
      stageX: 0,
      stageY: 0,
      draggable: false,
    });
  }

  const handleWheel = (e) => {
    e.evt.preventDefault();

    setStageInfo({ ...ImageScaleHelper.calculateStageZoom(e.target, e.evt.deltaY), ...{draggable: stageInfo.draggable}});
  };

  useEffect(() => {
    if (!url) {
      setBrush([]);
      setLasso([]);
      setPath([]);
    }
  }, [url]);

  // when image is loaded we need to cache the shape
  useEffect(() => {
    if (image) {
      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      imageRef.current.cache();
    }
  }, [image]);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const clearCanvas = () => {
    setBrush([]);
    setLasso([]);
    setPath([]);
  };

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
          x={windowWidth / 2}
          y={windowHeight / 2}
          offsetX={scaleInfo.width / 2}
          offsetY={scaleInfo.height / 2}
          width={scaleInfo.width}
          height={scaleInfo.height}
        />
      );
    }
  };

  const handleMouseDown = (e) => {
    if (!url || stageInfo.draggable) {
      return;
    }
    isDrawing.current = true;
    const mousePosition = e.target.getStage().getPointerPosition();
    setMousePos({
      x: mousePosition.x,
      y: mousePosition.y,
    });

    switch (toolType) {
      case "path":
        setupPathInfo(true);
        break;
      case "lasso":
        setupLassoInfo(true);
        break;
      case "eraser":
        setupPathInfo(true, true);
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
      case "path":
        setupPathInfo(false);
        break;
      case "lasso":
        setupLassoInfo(false);
        break;
      case "eraser":
        setupPathInfo(false, true);
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

  const setupBrushInfo = (initial, eraser) => {
    const brushInfo = CanvasHelper.setupBrushInfo(initial, eraser, strokeWidth, brush, mousePos);
    if (!brushInfo) {
      return;
    }
    setBrush(brushInfo);
  };

  const setupPathInfo = (initial, eraser) => {
    const pathInfo = CanvasHelper.setupPathInfo(initial, eraser, strokeWidth, path, mousePos);
    if (!pathInfo) {
      return;
    }
    setPath(pathInfo);
  };

  const setupLassoInfo = (initial) => {
    const lassoInfo = CanvasHelper.setupLassoInfo(initial, strokeWidth, path, mousePos);
    if (!lassoInfo) {
      return;
    }
    setLasso(lassoInfo);
  };  

  return (
    <div className={`canvas-container ${!url ? "empty-canvas" : ""}`}>
      {!url && (
        <div
          className="upload-container"
          style={{ width: windowWidth * 0.3, height: windowWidth * 0.3 }}
        >
          <div className="upload-icon">
            <FileInput
              clickEvent={clickEvent}
              clearEvent={clearFile}
              fileInput={fileInput}
            />
          </div>
          <div className="upload-text">
            Please upload an Image
            <br />
            You can draw on top of the image after adding it
          </div>
        </div>
      )}
      {url && (
        <div className="stage-container">
          <Stage
            width={windowWidth}
            height={windowHeight}
            scaleX={stageInfo.stageScale}
            scaleY={stageInfo.stageScale}
            x={stageInfo.stageX}
            y={stageInfo.stageY}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseEnter={() => {
              if (stageInfo.draggable) {
                document.body.style.cursor = "grabbing";
              } else {
                document.body.style.cursor = "default";
              }
              setEnableCursor(true);
            }}
            onMouseLeave={() => {
              setEnableCursor(false);
            }}
            onDragMove={() => {
              const pointerPos = stageRef.current.getPointerPosition();
              setMousePos({
                x: pointerPos.x,
                y: pointerPos.y,
              });
            }}
            onWheel={handleWheel}
            ref={stageRef}
            draggable={stageInfo.draggable}
          >
            <Layer>{url && <LoadImage />}</Layer>
            <Layer>
              {brush.map((data, i) => (
                <CreateLines key={i} line={data} />
              ))}
              {path.map((data, i) => (
                <CreateLines key={i} line={data} />
              ))}
              {lasso.map((data, i) => (
                <CreateShape key={i} line={data} />
              ))}
            </Layer>
            <Layer>
              {url && enableCursor && !stageInfo.draggable && (
                <Circle
                  x={mousePos.x}
                  y={mousePos.y}
                  radius={strokeWidth}
                  fill="#df4b26"
                  opacity={0.5}
                  filters={[Konva.Filters.Pixelate]}
                  pixelSize={10}
                />
              )}
            </Layer>
          </Stage>
        </div>
      )}

      <div className="toolbox-container">
        <div className="toolbox-panel">
          <CustomWidthTooltip title="Brush" arrow>
            <Button
              className={`toolbox-tool brush-tool ${
                toolType === "brush" ? "active" : ""
              }`}
              variant="text"
              onClick={() => setToolType("brush")}
            >
              <img
                className="brush-img"
                src={brushTools.brush}
                alt="brush-tool"
              />
            </Button>
          </CustomWidthTooltip>
          <CustomWidthTooltip title="Polyline" arrow>
            <Button
              className={`toolbox-tool path-tool ${
                toolType === "path" ? "active" : ""
              }`}
              variant="text"
              onClick={() => setToolType("path")}
            >
              <img
                className="brush-img"
                src={brushTools.polyline}
                alt="path-tool"
              />
            </Button>
          </CustomWidthTooltip>
          <CustomWidthTooltip title="Lasso" arrow>
            <Button
              className={`toolbox-tool lasso-tool ${
                toolType === "lasso" ? "active" : ""
              }`}
              variant="text"
              onClick={() => setToolType("lasso")}
            >
              <img
                className="brush-img"
                src={brushTools.lasso}
                alt="lasso-tool"
              />
            </Button>
          </CustomWidthTooltip>
          <CustomWidthTooltip title="Eraser" arrow>
            <Button
              className={`toolbox-tool eraser-tool ${
                toolType === "eraser" ? "active" : ""
              }`}
              variant="text"
              onClick={() => setToolType("eraser")}
            >
              <img
                className="brush-img"
                src={brushTools.eraser}
                alt="eraser-tool"
              />
            </Button>
          </CustomWidthTooltip>
        </div>
      </div>
      <div className="action-container">
        <div className="action-panel">
          <CustomWidthTooltip title="Clear" arrow>
            <Button
              className="clear-tool"
              variant="text"
              disabled={url === ""}
              onClick={() => clearCanvas()}
            >
              <img
                className="action-img"
                src={brushTools.clear}
                alt="clear-tool"
              />
            </Button>
          </CustomWidthTooltip>
          <CustomWidthTooltip title="Remove" arrow>
            <Button
              className="remove-tool"
              variant="text"
              disabled={url === ""}
              onClick={() => { clearFile(); resetStageInfo(); }}
            >
              <img
                className="action-img"
                src={brushTools.remove}
                alt="remove-tool"
              />
            </Button>
          </CustomWidthTooltip>
          <Divider orientation="vertical" flexItem />
          <CustomWidthTooltip title="Pan" arrow>
            <Button
              className={`action-tool pan-tool ${stageInfo.draggable ? 'active' : ''}`}
              variant="text"
              onClick={() => setStageInfo({ ...stageInfo, ...{ draggable: !stageInfo.draggable } })}
            >
              <img className="action-img" src={brushTools.pan} alt="pan-tool" />
            </Button>
          </CustomWidthTooltip>
          <CustomWidthTooltip title="Reset Zoom" arrow>
            <Button
              className={`action-tool zoom-tool`}
              variant="text"
              onClick={() => resetStageInfo()}
            >
              <img className="action-img" src={brushTools.zoom} alt="zoom-tool" />
            </Button>
          </CustomWidthTooltip>
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
};

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
};
export default CanvasComponent;
