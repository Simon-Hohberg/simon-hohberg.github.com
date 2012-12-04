
function Triangle(v0, v1, v2) {
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
}

Triangle.prototype.render = function(context, camera) {
	var v0NDC = camera.transform(v0);
	var v1NDC = camera.transform(v1);
	var v2NDC = camera.transform(v2);
	
	var p0 = raster(v0NDC);
	var p1 = raster(v1NDC);
	var p2 = raster(v2NDC);
	
	/*
	 * Ensure triangle on the screen to be like:
	 * 
	 *           v0
	 * 		      o
	 *           / \
	 *          /   \
	 *         /     \
	 *     v1 o-------o v2
	 *
	 */
	
	var topMost = v0;
	var leftMost = v1;
	
	//v1 top most
	if (v1NDC.e(2) >= v0NDC.e(2) && v1NDC.e(2) >= v2NDC.e(2)) {
		topMost = v1;
	//v2 top most
	} else if (v2NDC.e(2) >= v0NDC.e(2) && v2NDC.e(2) >= v1NDC.e(2)) {
		topMost = v2;
	}
	
	//v0 left most
	if (v0NDC.e(1) <= v1NDC.e(1) && v0NDC.e(1) <= v2NDC.e(1)) {
		leftMost = v0;
	//v2 left most
	} else if (v2NDC.e(1) <= v0NDC.e(1) && v2NDC.e(1) <= v1NDC.e(1)) {
		leftMost = v2;
	}
	
	var newV0 = topMost;
	var newV1 = leftMost;
	
	//check if topMost == leftMoset
	if (newV0 == newV1) {
    }
    
	for (var y = p0[1]; y < mostBottom[1]; y++) {
		var vec0 = yStep0NDC.multiply(y - p0[1]).add(v0NDC);
		var vec1 = yStep1NDC.multiply(y - p0[1]).add(v0NDC);
		var line = new Line(vec0, vec1, "");
		renderLine(line);
	}
    
};