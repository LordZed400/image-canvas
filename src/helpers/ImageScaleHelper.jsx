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
}

export default ImageScaleHelper;