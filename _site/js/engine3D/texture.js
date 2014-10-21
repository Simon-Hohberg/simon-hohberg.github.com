
var textureMap = {};

/**
 * Creates a new texture that is loaded from the given filename.
 * @param filename
 * @returns
 */
function Texture(filename, callback) {
	var self = this;
	//load image and draw it on a new canvas
	var img = document.createElement("img");
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", filename);
	this.context = canvas.getContext("2d");
	img.onload = function (e) {
		canvas.setAttribute("width", img.width);
		canvas.setAttribute("height", img.height);
		textureMap[filename] = this.context;
		self.width = img.width;
		self.height = img.height;
		self.context.drawImage(img, 0, 0);
		callback();
	};
	img.src = filename;
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