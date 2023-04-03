class CanvasHelper {
  static getStaticFilename = (url) => {
    const pathIndex = url.lastIndexOf("/");
    const staticPath = url.substr(pathIndex + 1);
    const partialFilename = staticPath.split(".");
    const filename = partialFilename[0] + "." + partialFilename[2];
    return filename;
  };

  static setupBrushInfo = (initial, eraser, strokeWidth, brush, mousePos) => {
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

  static setupPathInfo = (initial, strokeWidth, path, mousePos) => {
    if (initial) {
      if (path.length === 0 || !path.map(e => e.width).includes(strokeWidth)) {
        return([
          ...path,
          {
            tool: "path",
            points: [mousePos.x, mousePos.y, mousePos.x + 0.00000001, mousePos.y + 0.00000001],
            width: strokeWidth,
          },
        ]);
      }
    }
    const newPoints = [mousePos.x, mousePos.y];
    var pointIndex = path.findIndex(e => e.tool === "path" && e.width === strokeWidth);
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

  static setupPolygonInfo = (initial, guides, polygon, mousePos, strokeWidth) => {
    if (!initial && !guides.rect.length) {
      return;
    }
    if (initial) {
      if (guides.complete) {
        const polygonSet = ([
          ...polygon,
          {
            tool: "polygon",
            points: guides.rect.flatMap(e => Object.values(e)),
            width: strokeWidth,
          },
        ]);
        const guideSet = ({
          rect: [],
          lines: [],
          complete: false
        });
        return ({
          guideSet,
          polygonSet
        });
      }
      return({
        guideSet: {
          rect: [...guides.rect, ...[{x: mousePos.x, y: mousePos.y}]],
          lines: [...guides.lines, ...[{startX: mousePos.x + 4, startY: mousePos.y + 4, endX: mousePos.x + 4, endY: mousePos.y + 4}]],
          conplete: guides.complete
        },
        polygonSet: polygon
      });
    }

    const lastGuide = guides.lines.at(guides.lines.length - 1);
    if (Math.abs(mousePos.x - guides.rect.at(0).x) < 20 && Math.abs(mousePos.y - guides.rect.at(0).y) < 20) {
      lastGuide.endX = guides.rect.at(0).x + 4;
      lastGuide.endY = guides.rect.at(0).y + 4;
      guides.complete = true;
    } else {
      lastGuide.endX = mousePos.x;
      lastGuide.endY = mousePos.y;
      guides.complete = false;
    }
    guides.lines.splice(guides.lines.length - 1, 1, lastGuide);
    return({
      guideSet: guides,
      polygonSet: polygon
    });
  }
}

export default CanvasHelper;