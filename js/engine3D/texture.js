
var textureMap = {};

/**
 * Creates a new texture that is loaded from the given filename.
 * @param filename
 * @returns
 */
function Texture(filename) {
	//load image and draw it on a new canvas
	var img = new Image();
	img.src = filename;
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", filename);
	canvas.setAttribute("width", img.width);
	canvas.setAttribute("height", img.height);
	this.width = img.width;
	this.height = img.height;
	this.context = canvas.getContext("2d");
	this.context.drawImage(img, 0, 0);
	
	//add to texture map
	textureMap[filename] = this.context;
}

/**
 * Gets the information of the pixel at x and y.
 * @param x
 * @param y
 * @returns {ImageData}
 */
Texture.prototype.getPixel = function (x, y) {
	return this.context.getImageData(x, y, 1, 1).data; 
};