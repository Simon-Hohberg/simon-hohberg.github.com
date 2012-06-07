var canvas;
var canvasWidth = 600;
var canvasHeight = 400;
var context;

var camera = new Camera();
var zBuffer = Matrix.Zero(canvasWidth, canvasHeight).map( function (e) { return e + 1;});
var rotation = 2;
var cube = null;
var sphere = null;
var light = null;
var line1, line2, line3 = null;

var mouseX = canvasWidth/2;
var mouseY = canvasHeight/2;
var deltaX = 0;
var deltaY = 0;
var startMouseX = 0;
var startMouseY = 0;
var mouseIsDown = false;
var forward = false;
var backward = false;
var left = false;
var right = false;

function initRender(canvasID) {
    canvas = document.getElementById(canvasID);
    canvas.onmousemove = getMousePosition;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup   = mouseUp;
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
    context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    render();
}

function render() {
	
	document.getElementById("cameraX").value = camera.position.e(1);
	document.getElementById("cameraY").value = camera.position.e(2);
	document.getElementById("cameraZ").value = camera.position.e(3);
	document.getElementById("nX").value = camera.n.e(1);
	document.getElementById("nY").value = camera.n.e(2);
	document.getElementById("nZ").value = camera.n.e(3);
	document.getElementById("nNear").value = camera.distNear;
	document.getElementById("nFar").value = camera.distFar;
	document.getElementById("openingAngleH").value = radToDeg(camera.hOpeningAngle);
	document.getElementById("openingAngleV").value = radToDeg(camera.hOpeningAngle) * (canvasHeight/canvasWidth);
	
	if (cube != null) {
		document.getElementById("cubeX").value = toCartesian(cube.position).e(1);
		document.getElementById("cubeY").value = toCartesian(cube.position).e(2);
		document.getElementById("cubeZ").value = toCartesian(cube.position).e(3);
	}	
	//reset zBuffer
//	zBuffer = Matrix.Zero(canvasWidth, canvasHeight).map( function (e) { return e + 1;});
	
	//check input
    if (forward) {
        camera.setPosition(camera.position.add(camera.n.map(function (e) { return -e; })));
    } else if (backward) {
        camera.setPosition(camera.position.add(camera.n));
    }
    
    if (left) {
        camera.setPosition(camera.position.add(camera.u.map(function (e) { return -e; })));
    } else if (right) {
        camera.setPosition(camera.position.add(camera.u));
    }
    
    if (mouseIsDown) {
    	camera.setMouse(deltaX, deltaY);
    	camera.calculate();
    }

    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //cube.rotateY(rotation);
    //cube.rotateX(rotation);
//    cube.rotateZ(rotation);
    
    //render cube
    if (cube != null) {
	    var sides = cube.sides;
	    
	    for (var side in sides) {
	        renderRect(sides[side], context);
	    }
    }
    
    if (line1 != null)
    	renderLine(line1);
    if (line2 != null)
    	renderLine(line2);
    if (line3 != null)
    	renderLine(line3);
    
    if (sphere != null)
    	renderSphere(sphere, context);
    
//    setTimeout(render, 50);
}

function renderRect(rect, context) {
	var edges = rect.getEdges();
	var texture = rect.texture;
	if (texture == null) {
		for (var i in edges) {
			var edge = edges[i];
			var v0 = toCartesian(camera.transform(edge[0]));
			var v1 = toCartesian(camera.transform(edge[1]));
			var p0 = raster(v0);
			var p1 = raster(v1);
			
			//check zBuffer, this not correct, but easy
//			if (zBuffer.e(p0[0], p0[1]) < v0.e(3) || zBuffer.e(p1[0], p1[1]) < v1.e(3))
//				continue;
//			
//			zBuffer.elements[p0[0]][p0[1]] = v0.e(3);
//			zBuffer.elements[p1[0]][p1[1]] = v1.e(3);
			
			context.beginPath();
			
			context.moveTo(p0[0], p0[1]);
			context.lineTo(p1[0], p1[1]);
			
			context.closePath();
			context.stroke();
		}
	} else {
		
		for (var x = 0; x < texture.width; x++) {
			for (var y = 0; y < texture.height; y++) {
				
				//calculate the screen coordinates
				
				var upperLeftVector  = toCartesian(camera.transform(toHomogeneous(rect.getPositionOfTexturePixel(  x,   y))));
				var upperRightVector = toCartesian(camera.transform(toHomogeneous(rect.getPositionOfTexturePixel(x+1,   y))));
				var lowerLeftVector  = toCartesian(camera.transform(toHomogeneous(rect.getPositionOfTexturePixel(  x, y+1))));
				var lowerRightVector = toCartesian(camera.transform(toHomogeneous(rect.getPositionOfTexturePixel(x+1, y+1))));
				
				var upperLeftPoint  = raster(upperLeftVector);
				var upperRightPoint = raster(upperRightVector);
				var lowerLeftPoint  = raster(lowerLeftVector);
				var lowerRightPoint = raster(lowerRightVector);
				
				//check zBuffer, this not correct, but easy
//				if (zBuffer.e(upperLeftPoint[0], upperLeftPoint[1]) < upperLeftVector.e(3) 
//						|| zBuffer.e(upperRightPoint[0], upperRightPoint[1]) < upperRightVector.e(3)
//						|| zBuffer.e(lowerLeftPoint[0], lowerLeftPoint[1]) < lowerLeftVector.e(3)
//						|| zBuffer.e(lowerRightPoint[0], lowerRightPoint[1]) < lowerRightVector.e(3))
//					continue;
//				
//				zBuffer.elements[upperLeftPoint[0]][upperLeftPoint[1]] = upperLeftVector.e(3);
//				zBuffer.elements[upperRightPoint[0]][upperRightPoint[1]] = upperRightVector.e(3);
//				zBuffer.elements[lowerLeftPoint[0]][lowerLeftPoint[1]] = lowerLeftVector.e(3);
//				zBuffer.elements[lowerRightPoint[0]][lowerRightPoint[1]] = lowerRightVector.e(3);
//				
				//draw the texture pixel on the screen
				
				var pixel = texture.getPixel(x, y);
				//set color of pixel
				var color = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
	    		context.fillStyle = color;
	    		
	    		context.beginPath();
	    		context.moveTo(upperLeftPoint[0], upperLeftPoint[1]);
	    		context.lineTo(upperRightPoint[0], upperRightPoint[1]);
	    		context.lineTo(lowerRightPoint[0], lowerRightPoint[1]);
	    		context.lineTo(lowerLeftPoint[0], lowerLeftPoint[1]);
	    		context.closePath();
	    		context.fill();
			}
		}
	}
}

function renderLine(line) {
	var startVecNDC = camera.transform(toHomogeneous(line.startVec));
	var endVecNDC = camera.transform(toHomogeneous(line.endVec));
	var startPoint = raster(startVecNDC);
	var endPoint = raster(endVecNDC);
	
	var fromX = startPoint[0];
	var fromY = startPoint[1];
	var toX = endPoint[0];
	var toY = endPoint[1];
	var off;
	
	//bresenham
	
	//change x and y if slope is greater than 1
	var inverse = false;
	if (Math.abs((toY - fromY)/ (toX - fromX)) > 1) {
		var tempX = toX;
		toX = toY;
		toY = tempX;
		var tempFromX = fromX;
		fromX = fromY;
		fromY = tempFromX;
		inverse = true;
	}
	
	//translate starting point to origin
	if (fromX < toX) {
		off = [fromX, fromY];
		toX -= off[0];
		toY -= off[1];
	} else {
		off = [toX, toY];
		toX = fromX - off[0];
		toY = fromY - off[1];
	}
	
	var s = 2 * toY;
	var error = 0;
	var y = 0;	//start at origin
	
	//step in world coordinates
	var stepVec = (line.endVec.subtract(line.startVec)).multiply(1.0/toX);
	
	//step in NDC
	var stepVecNDC = (endVecNDC.subtract(startVecNDC)).multiply(1.0/toX);
	
	//line length in world coordinates
	var lengthWorld = length(line.endVec.subtract(line.startVec));
	
	//line length in NDC
	var lengthNDC = length(endVecNDC.subtract(startVecNDC));

	context.fillStyle = "rgb(0, 0, 0)";
	if (inverse) {
		context.fillRect(off[1], off[0], 1, 1);
		context.strokeText(line.id, off[1], off[0]);
	} else {
		context.fillRect(off[0], off[1], 1, 1);
		context.strokeText(line.id, off[0], off[1]);
	}
	
	for (var x = 1; x <= toX; x++) {
		
		//intensity in NDC
		var colorIntensNDC = Math.round(255.0 * (length(stepVecNDC.multiply(x))/lengthNDC));
		
		//intensity in world coordinates
		var colorIntens = Math.round(255.0 * (length(stepVec.multiply(x))/lengthWorld));
		
		context.fillStyle = "rgb(" + colorIntensNDC + ", " + colorIntensNDC + ", " + colorIntensNDC + ")";
		
		//compare intensities for middle point
		if (x == Math.round(toX/2.0)) {
			document.getElementById(line.id + "Error").value = Math.abs(colorIntens - colorIntensNDC);
		}
		
		error += s;
		if (Math.abs(error) >= toX) {
			y = error > 0 ? y + 1 : y - 1;
			error = error > 0 ? error - 2 * toX : error + 2 * toX;
		}
		if (inverse) {
			context.fillRect(y + off[1], x + off[0], 1, 1);
		} else {
			context.fillRect(x + off[0], y + off[1], 1, 1);
		};
	};
	
//	context.beginPath();
//	context.moveTo(startPoint[0], startPoint[1]);
//	context.lineTo(endPoint[0], endPoint[1]);
//	context.closePath();
//	context.stroke();
}

function renderSphere(sphere, context) {
	var centerTransformed = camera.transform(sphere.center);
	var center = raster(centerTransformed);
	var radiusVector = camera.transform(toHomogeneous(camera.v.toUnitVector().dup().multiply(sphere.radius).add(toCartesian(sphere.center))));
	var radiusPoint = raster(radiusVector);
	var radius = Math.sqrt(Math.pow(radiusPoint[0]-center[0], 2) + Math.pow(radiusPoint[1]-center[1], 2));
	var transformedRadius = toCartesian(radiusVector).distanceFrom(toCartesian(centerTransformed));
	
//	context.fillRect(Math.round(center[0] - radius), Math.round(center[1] - radius), 2*radius, 2*radius);
	
	//iterate over pixels in bounding box of the sphere
	for (var x = Math.round(center[0] - radius); x < Math.round(center[0] + radius); x++) {
		for (var y = Math.round(center[1] - radius); y < Math.round(center[1] + radius); y++) {
			var point = [x, y];
			var vec = unraster(point);
			
			var vecNDC = solveForZ(centerTransformed, vec, transformedRadius);
			
			if (vecNDC == null) {
				continue;
			}
			
			var vecWorld = toCartesian(camera.detransform(toHomogeneous(vecNDC)));
			
//			console.log(vecWorld.distanceFrom(toCartesian(sphere.center)));

			var L = toCartesian(toCartesian(light.position).subtract(vecWorld).toUnitVector());
			var A = camera.position.subtract(vecWorld).toUnitVector();
			var N = vecWorld.toUnitVector();
			
			var cosAlpha = 2 * L.dot(N) * N.dot(A) - L.dot(A);
			var r = length(L);
			
			var I = light.intensity * (1.0/(light.attenuation[0] + light.attenuation[1]*r + light.attenuation[2]*r*r)) * 10 * Math.pow(cosAlpha, 0.5);
//			console.log(I);
			var R = (200 * (1-I));
			context.fillStyle = "rgb(" + Math.round(R) + ",0,0)";
			
			context.fillRect(x,y,1,1);
		}
	}
	
//	console.log(radius);
//	console.log(sphere.center.inspect());
	
//	context.fillStyle = sphere.color;
//	context.beginPath();
//	context.arc(center[0], center[1], radius, 0, Math.PI * 2, false);
//	context.closePath();
//	context.fill();
	
}

/**
 * 
 * @param vector
 * @returns {Array}
 */
function raster(vector) {
	var vec = toCartesian(vector);
	var x = Math.round( (canvasWidth/2) * vec.e(1) + canvasWidth/2 );
	var y = Math.round( (canvasHeight/2) * vec.e(2) + canvasHeight/2 ) ;
	return [x, y];
}

/**
 * Calculates the vector in NDC that corresponds to the provided point with the
 * z component set to 0.
 * @param point
 * @returns Vector in NDC that corresponds to the point
 */
function unraster(point) {
	var x = (point[0] * (2.0/canvasWidth)) - 1;
	var y = (point[1] * (2.0/canvasHeight)) - 1;
	
	return Vector.create([x, y, 0]);
}

/**
 * 
 * @param sphere
 * @param vector
 */
function solveForZ(sphereCenterNDC, vector, radius) {
	var epsilon = 0.01;
	var center = toCartesian(sphereCenterNDC);
	var minusPHalf = center.e(3);
	var q = center.e(3)*center.e(3) + Math.pow(vector.e(1) - center.e(1), 2) + Math.pow(vector.e(2) - center.e(2), 2) - radius*radius;
	var unsolvedRootTerm = minusPHalf*minusPHalf - q;
	
	if (unsolvedRootTerm < 0) {	//no solution -> vector is not part of the sphere
		return null;
	} else {
		var rootTerm = Math.sqrt(unsolvedRootTerm);
		if (rootTerm < epsilon) {	//there is only one solution
			return Vector.create([vector.e(1), vector.e(2), minusPHalf]);
		} else {	//there are two vectors that fulfill the criteria, choose the one that is closer to the camera
			var v1 = Vector.create([vector.e(1), vector.e(2), minusPHalf + rootTerm]);
			var v2 = Vector.create([vector.e(1), vector.e(2), minusPHalf - rootTerm]);
			
			if (v1.e(3) < v2.e(3)) {
				return v1;
			} else {
				return v2;
			}
		}
	}
}

function getMousePosition(event) {
    if (!mouseIsDown) {
        return;
    }
    if (event.offsetY) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else if (event.layerY) {
        mouseX = event.layerX;
        mouseY = event.layerY;
    }
    deltaX = mouseX - startMouseX;
    deltaY = mouseY - startMouseY;
    render();
}

function keyDown(event) {
    if (event.keyCode == 87) {
        forward = true;
        render();
    } else if (event.keyCode == 83) {
        backward = true;
        render();
    } else if (event.keyCode == 65) {
        left = true;
        render();
    } else if (event.keyCode == 68) {
        right = true;
        render();
    }
}

function keyUp(event) {
    if (event.keyCode == 87) {
        forward = false;
        render();
    } else if (event.keyCode == 83) {
        backward = false;
        render();
    } else if (event.keyCode == 65) {
        left = false;
        render();
    } else if (event.keyCode == 68) {
        right = false;
        render();
    }
}

function mouseDown(event) {
    mouseIsDown = true;
    if (event.offsetY) {
        startMouseX = event.offsetX;
        startMouseY = event.offsetY;
    } else if (event.layerY) {
        startMouseX = event.layerX;
        startMouseY = event.layerY;
    }
}

function mouseUp(event) {
    mouseIsDown = false;
}

function updateParameters() {
	var x = parseFloat(document.getElementById("cameraX").value);
	var y = parseFloat(document.getElementById("cameraY").value);
	var z = parseFloat(document.getElementById("cameraZ").value);
	var nX = parseFloat(document.getElementById("nX").value);
	var nY = parseFloat(document.getElementById("nY").value);
	var nZ = parseFloat(document.getElementById("nZ").value);
	var nNear = parseFloat(document.getElementById("nNear").value);
	var nFar = parseFloat(document.getElementById("nFar").value);
	var openingH = parseFloat(document.getElementById("openingAngleH").value);
	var openingV = parseFloat(document.getElementById("openingAngleV").value);
	
	if (cube != null) {
		var cubeX = parseFloat(document.getElementById("cubeX").value);
		var cubeY = parseFloat(document.getElementById("cubeY").value);
		var cubeZ = parseFloat(document.getElementById("cubeZ").value);
		cube.setPosition(Vector.create([cubeX, cubeY, cubeZ]));
	}
		
	camera.distNear = nNear;
	camera.distFar = nFar;
	
	camera.position = Vector.create([x, y, z]);
	camera.n = Vector.create([nX, nY, nZ]);
	
	camera.hOpeningAngle = degToRad(openingH);
	
	var width = 2 * Math.tan(degToRad(openingH/2.0)) * camera.distNear;
	canvasHeight = 2 * Math.tan(degToRad(openingV/2.0)) * camera.distNear * (canvasWidth / width);
	
	canvas.height = canvasHeight;
	
	
	camera.calculate();
	
	render();
}

function loadTask(task) {
	switch (task) {
	case 26:
		cube = null;
		sphere = null;
		light = null;
	    line1 = new Line(Vector.create([-10, 0, 20]), Vector.create([0, 0, 20]), "line1");
	    line2 = new Line(Vector.create([-1, 0, 18]), Vector.create([5, 0, 26]), "line2");
	    line3 = new Line(Vector.create([7, 0, 20]), Vector.create([7, 0, 30]), "line3");
		document.getElementById("cameraX").value = 0;
		document.getElementById("cameraY").value = 0;
		document.getElementById("cameraZ").value = 0;
		document.getElementById("nX").value = 0;
		document.getElementById("nY").value = 0.0001;
		document.getElementById("nZ").value = -1;
		document.getElementById("nNear").value = 1;
		document.getElementById("nFar").value = 100;
		document.getElementById("openingAngleH").value = 60;
		document.getElementById("openingAngleV").value = 60;
		updateParameters();
		break;
	case 27:
		sphere = null;
		light = null;
		line1 = null;
		line2 = null;
		line3 = null;
		var chessTexture4x4 = new Texture("./js/engine3D/textures/chessboard4x4.png", 
				function() { 
						var dice6Texture = new Texture("./js/engine3D/textures/dice6.png", 
						function () { 
							var cubePos = Vector.create([0, 1, 6]);
						    cube = new Cube(2, cubePos);
						    cube.attachTexture("left", dice6Texture);
						    cube.attachTexture("front", chessTexture4x4);
						    cube.rotateX(-90);
							cube.rotateZ(45);
						    
							document.getElementById("cameraX").value = 0;
							document.getElementById("cameraY").value = 0;
							document.getElementById("cameraZ").value = 0;
							document.getElementById("nX").value = 0;
							document.getElementById("nY").value = 0.0001;
							document.getElementById("nZ").value = -1;
							document.getElementById("nNear").value = 1;
							document.getElementById("nFar").value = 100;
							document.getElementById("openingAngleH").value = 60;
							document.getElementById("openingAngleV").value = 60;
							document.getElementById("cubeX").value = cube.position.e(1);
							document.getElementById("cubeY").value = cube.position.e(2);
							document.getElementById("cubeZ").value = cube.position.e(3);
						    
						    updateParameters();
				}); });
		break;
	default:
		break;
	}
}
