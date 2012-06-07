
var textureMap = {};

/**
 * Creates a new texture that is loaded from the given filename.
 * @param filename
 * @returns
 */
function Texture(filename) {
	var self = this;
	//load image and draw it on a new canvas
	var img = document.createElement("img");
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", filename);
	this.context = canvas.getContext("2d");
	img.onload = function (e) {
		canvas.setAttribute("width", img.width);
		canvas.setAttribute("height", img.height);
		self.context.drawImage(img, 0, 0);
	};
	img.src = filename;
	this.width = img.width;
	this.height = img.height;
	
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