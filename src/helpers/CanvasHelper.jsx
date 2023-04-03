class CanvasHelper {
  static getStaticFilename = (url) => {
    const pathIndex = url.lastIndexOf("/");
    const staticPath = url.substr(pathIndex + 1);
    const partialFilename = staticPath.split(".");
    const filename = partialFilename[0] + "." + partialFilename[2];
    return filename;
  };
}

export default CanvasHelper;