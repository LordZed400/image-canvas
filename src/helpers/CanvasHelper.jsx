class CanvasHelper {
  static getStaticFilename = (url) => {
    const pathIndex = url.lastIndexOf("/");
    const staticPath = url.substr(pathIndex + 1);
    const partialFilename = staticPath.split(".");
    const filename = partialFilename[0] + "." + partialFilename[2];
    return filename;
  };

  static setupBrushInfo = (initial, eraser, strokeWidth, brush, mousePos) => {
    if (eraser && brush.length === 0) {
      return;
    }
    if (initial) {
      return([
        ...brush,
        {
          tool: eraser ? "eraser" : "brush",
          points: [mousePos.x, mousePos.y, mousePos.x + 0.00000001, mousePos.y + 0.00000001],
          width: strokeWidth,
        },
      ]);
    }
    const newPoints = [mousePos.x, mousePos.y];
    let lastBrush = brush[brush.length - 1];
    lastBrush.points = lastBrush.points.concat(newPoints);

    // replace last
    brush.splice(brush.length - 1, 1, lastBrush);
    return(brush.concat());
  };

  static setupPathInfo = (initial, eraser, strokeWidth, path, mousePos) => {
    if (eraser && path.length === 0) {
      return;
    }
    if (initial) {
      if (!eraser && (path.length === 0 || !path.map(e => e.width).includes(strokeWidth))) {
        return([
          ...path,
          {
            tool: "path",
            points: [mousePos.x, mousePos.y, mousePos.x + 0.00000001, mousePos.y + 0.00000001],
            width: strokeWidth,
          },
        ]);
      } else if (eraser) {
        return([
          ...path,
          {
            tool: "eraser",
            points: [mousePos.x, mousePos.y],
            width: strokeWidth,
          },
        ]);
      }
    }
    const newPoints = [mousePos.x, mousePos.y];
    var pointIndex;
    if (eraser) {
      pointIndex = path.length - 1
    } else {
      pointIndex = path.findIndex(e => e.tool === "path" && e.width === strokeWidth);
    }
    let lastPath = path.at(pointIndex);
    
    lastPath.points = lastPath.points.concat(newPoints);

    path.splice(pointIndex, 1, lastPath);
    return(path.concat());
  };

  static setupLassoInfo = (initial, strokeWidth, lasso, mousePos) => {
    if (initial) {
      return([
        ...lasso,
        {
          tool: "lasso",
          points: [{ x: mousePos.x, y: mousePos.y }],
          width: strokeWidth,
        },
      ]);
    }
    const newPoints = {
      x: mousePos.x,
      y: mousePos.y,
    };
    let lastLasso = lasso[lasso.length - 1];
    lastLasso.points = lastLasso.points.concat(newPoints);

    lasso.splice(lasso.length - 1, 1, lastLasso);
    return(lasso.concat());
  };  
}

export default CanvasHelper;