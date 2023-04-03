class ImageScaleHelper {
  static scaleImage = (canvas, img, fit) => {
    // get the scale
    var scale = 0;
    if (fit) {
      scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    } else {
      scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    }
    // get the top left position of the image
    var x = (canvas.width / 2) - (img.width / 2) * scale;
    var y = (canvas.height / 2) - (img.height / 2) * scale;

    return {
      x: x,
      y: y,
      width: img.width * scale,
      height: img.height * scale
    };
  };

  static getCenterPos = (canvas, img) => {
    const centerPos = {
      x: canvas.width / 2 - img.width / 2,
      y: canvas.height / 2 - img.height / 2,
    }
    return centerPos;
  }

  static calculateStageZoom = (target, deltaY) => {
    const scaleBy = 1.02;
    const stage = target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: (stage.getPointerPosition().x - stage.x()) / oldScale,
      y: (stage.getPointerPosition().y - stage.y()) / oldScale,
    };

    const newScale = deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    return({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  }
}

export default ImageScaleHelper;