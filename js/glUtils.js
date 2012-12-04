/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function loadIdentity() {  
	mvMatrix = Matrix.I(4);  
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function multMatrix(m) {  
	mvMatrix = mvMatrix.x(m);  
}  

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function mvTranslate(v) {  
	multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());  
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function setMatrixUniforms() {  
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");  
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));  

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");  
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));  
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function makePerspective(fovy, aspect, znear, zfar) {
	var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
	var ymin = -ymax;
	var xmin = ymin * aspect;
	var xmax = ymax * aspect;
	return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function makeFrustum(left, right, bottom, top, znear, zfar) {
	var X = 2*znear/(right-left);
	var Y = 2*znear/(top-bottom);
	var A = (right+left)/(right-left);
	var B = (top+bottom)/(top-bottom);
	var C = -(zfar+znear)/(zfar-znear);
	var D = -2*zfar*znear/(zfar-znear);
	return $M([[X, 0, A, 0],
				[0, Y, B, 0],
				[0, 0, C, D],
				[0, 0, -1, 0]]);
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
Matrix.Translation = function (v) {
	if (v.elements.length == 2) {
		var r = Matrix.I(3);
		r.elements[2][0] = v.elements[0];
		r.elements[2][1] = v.elements[1];
		return r;
	}
	if (v.elements.length == 3) {
		var r = Matrix.I(4);
		r.elements[0][3] = v.elements[0];
		r.elements[1][3] = v.elements[1];
		r.elements[2][3] = v.elements[2];
		return r;
	}
	throw "Invalid length for Translation";
};

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
Matrix.prototype.ensure4x4 = function() {
	if (this.elements.length == 4 && this.elements[0].length == 4)
		return this;
	if (this.elements.length > 4 || this.elements[0].length > 4)
		return null;
	for (var i = 0; i < this.elements.length; i++) {
		for (var j = this.elements[i].length; j < 4; j++) {
		if (i == j)
			this.elements[i].push(1);
		else
			this.elements[i].push(0);
		}
	}
	for (var i = this.elements.length; i < 4; i++) {
		if (i == 0)
			this.elements.push([1, 0, 0, 0]);
		else if (i == 1)
			this.elements.push([0, 1, 0, 0]);
		else if (i == 2)
			this.elements.push([0, 0, 1, 0]);
		else if (i == 3)
			this.elements.push([0, 0, 0, 1]);
	}
	return this;
};

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
Vector.prototype.flatten = function () {
	return this.elements;
};

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
Matrix.prototype.flatten = function () {
	var result = [];
	if (this.elements.length == 0)
		return [];
	for (var j = 0; j < this.elements[0].length; j++)
		for (var i = 0; i < this.elements.length; i++)
			result.push(this.elements[i][j]);
	return result;
};