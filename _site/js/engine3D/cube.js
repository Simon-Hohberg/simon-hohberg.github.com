

/**
 *         -------------
 *        /|    back  /|
 *       / | top     / |
 *      -------------  |
 *      |  |        |  | right
 * left |  |________|__|
 *      | / bottom  | /
 *      |/  front   |/
 *      -------------
 * 
 * @param size
 * @param position
 * @returns
 */
function Cube(size, position) {
    var self = this;

    //initially there is no transformation
    this.transform = Matrix.Diagonal([1,1,1,1]);
    
    this.position = toHomogeneous(position);
    
    this.size = size;   //edge length
    
    this.sides = [];
    var v0 = Vector.create([-self.size/2, -self.size/2, -self.size/2, 1]);
    var v1 = Vector.create([ self.size/2, -self.size/2, -self.size/2, 1]);
    var v2 = Vector.create([ self.size/2,  self.size/2, -self.size/2, 1]);
    var v3 = Vector.create([ self.size/2,  self.size/2,  self.size/2, 1]);
    var v4 = Vector.create([-self.size/2,  self.size/2,  self.size/2, 1]);
    var v5 = Vector.create([ self.size/2, -self.size/2,  self.size/2, 1]);
    var v6 = Vector.create([-self.size/2,  self.size/2, -self.size/2, 1]);
    var v7 = Vector.create([-self.size/2, -self.size/2,  self.size/2, 1]);

    //rects are defined from left to right and from top to bottom, from the 
    //side they are seen
    
    this.sides["top"]    = new Rect(v7, v5, v4, v3, this.position);
    this.sides["bottom"] = new Rect(v1, v0, v2, v6, this.position);
    
    this.sides["left"]   = new Rect(v7, v4, v0, v6, this.position);
    this.sides["right"]  = new Rect(v3, v5, v2, v1, this.position);
    
    this.sides["back"]   = new Rect(v5, v7, v1, v0, this.position);
    this.sides["front"]  = new Rect(v4, v3, v6, v2, this.position);
    
    this.rotateX = function(degrees) {
        var rad = degToRad(degrees);
        this.transform = this.transform.multiply(rotX(rad));
        for (var side in this.sides) {
        	this.sides[side].transform = this.transform;
        }
    };
    
    this.rotateY = function(degrees) {
        var rad = degToRad(degrees);
        this.transform = this.transform.multiply(rotY(rad));
        for (var side in this.sides) {
        	this.sides[side].transform = this.transform;
        }
    };
    
    this.rotateZ = function(degrees) {
        var rad = degToRad(degrees);
        this.transform = this.transform.multiply(rotZ(rad));
        for (var side in this.sides) {
        	this.sides[side].transform = this.transform;
        }
    };
    
    this.setPosition = function(position) {
    	this.position = position;
    	for (var side in this.sides) {
        	this.sides[side].setPosition(this.position);
        }
    };
}

Cube.prototype.attachTexture = function (side, texture) {
	this.sides[side].attachTexture(texture);
};


/**
 * Constructs a new rectangle from the given points. Points should be relative
 * to the position.
 * 
 * Vertices should be arranged as follows:
 * 
 *           e0
 * 		v0-------v1
 * 		|		  |
 *   e3 |		  | e1
 * 		|		  |
 * 		v2-------v3
 * 		     e2
 * 
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @returns
 */
function Rect(v0, v1, v2, v3, position) {
	this.transform = Matrix.Diagonal([1,1,1,1]);
	this.setPosition(position);
	this.position = position;
    this.texture = null;
    this.upperPoints = [];
    this.leftPoints = [];
    this.edges = [];
    this.edges.push([v0, v1]);
    this.edges.push([v1, v3]);
    this.edges.push([v3, v2]);
    this.edges.push([v2, v0]);
}

Rect.prototype.getEdges = function () {
	var transformedEdges = [];
	//apply transformation and translation
	for (var i = 0; i < this.edges.length; i++) {
		var e = this.edges[i];
		v0 = this.translation.multiply(this.transform.multiply(e[0]));
		v1 = this.translation.multiply(this.transform.multiply(e[1]));
		transformedEdges.push([v0, v1]);
	}
	return transformedEdges;
};

Rect.prototype.setPosition = function (position) {
	var cartPos = toCartesian(position);
	this.translation = Matrix.create([[1, 0, 0, cartPos.e(1)], [0, 1, 0, cartPos.e(2)],[0, 0, 1, cartPos.e(3)],[0, 0, 0, 1]]);
};

/**
 * Sets the texture for this {@link Rect}.
 * @param texture
 */
Rect.prototype.attachTexture = function (texture) {
	this.texture = texture;
	var upperLeftVertex = toCartesian(this.edges[0][0]);
	var upperRightVertex = toCartesian(this.edges[0][1]);
	var lowerLeftVertex = toCartesian(this.edges[3][0]);
	var xStep = upperRightVertex.subtract(upperLeftVertex).multiply(1.0/this.texture.width);
	var yStep = lowerLeftVertex.subtract(upperLeftVertex).multiply(1.0/this.texture.height);
	
	//calculate world coordinates for pixels along the width of the texture
	this.upperPoints = [];
	this.upperPoints.push(Vector.create([0, 0, 0]));
	
	for (var i = 1; i <= this.texture.width; i++) {
		var pointBefore = this.upperPoints[i-1];
		this.upperPoints.push(pointBefore.dup().add(xStep));
	}
	
	//calculate world coordinates for pixels along the height of the texture
	this.leftPoints = [];
	this.leftPoints.push(Vector.create([0, 0, 0]));
	
	for (var i = 1; i <= this.texture.height; i++) {
		var pointBefore = this.leftPoints[i-1];
		this.leftPoints.push(pointBefore.dup().add(yStep));
	}
};

/**
 * Calculates the vector in world coordinates that corresponds to the given 
 * pixel of the texture.
 * @param x
 * @param y
 * @returns
 */
Rect.prototype.getPositionOfTexturePixel = function (x, y) {
	if (this.texture == null) {
		return null;
	}
	var upperLeftVertex = toCartesian(this.edges[0][0]);
	//combine vector along the width and along the height, then translate
	//the resulting vector to the position of the texture
	return toCartesian(this.translation.multiply(this.transform.multiply(toHomogeneous(this.upperPoints[x].add(this.leftPoints[y]).add(upperLeftVertex)))));
};


function Line(startVec, endVec, id) {
	this.startVec = startVec;
	this.endVec = endVec;
	this.id = id;
}