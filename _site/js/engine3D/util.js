function rotZ(radians) {
    return Matrix.create([
    [Math.cos(radians), Math.sin(radians), 0, 0],
    [-Math.sin(radians),  Math.cos(radians), 0, 0],
    [                0,                  0, 1, 0], 
    [                0,                  0, 0, 1]
    ]);
}

function rotY(radians) {
    return Matrix.create([
    [ Math.cos(radians), 0, Math.sin(radians), 0],
    [                 0, 1,                 0, 0],
    [-Math.sin(radians), 0, Math.cos(radians), 0],
    [                 0, 0,                 0, 1]
    ]);
}

function rotX(radians) {
    return Matrix.create([
    [1,                 0,                  0, 0],
    [0, Math.cos(radians), -Math.sin(radians), 0],
    [0, Math.sin(radians),  Math.cos(radians), 0],
    [0,                 0,                  0, 1]
    ]);
}

function rotAroundAxis(axis, angle) {
    axis = toCartesian(axis).toUnitVector();
    return Matrix.create([
    [axis.e(1) + (1 - axis.e(1)) * Math.cos(angle), 
     axis.e(1) * axis.e(2) * (1 - Math.cos(angle)) - axis.e(3) * Math.sin(angle), 
     axis.e(1) * axis.e(3) * (1 - Math.cos(angle)) + axis.e(2) * Math.sin(angle), 
        0],
     
    [axis.e(1) * axis.e(2) * (1 - Math.cos(angle)) + axis.e(3) * Math.sin(angle), 
     axis.e(2) + (1 - axis.e(2)) * Math.cos(angle), 
     axis.e(2) * axis.e(3) * (1 - Math.cos(angle)) - axis.e(1) * Math.sin(angle), 
     0],
     
    [axis.e(1) * axis.e(3) * (1 - Math.cos(angle)) - axis.e(2) * Math.sin(angle), 
     axis.e(2) * axis.e(3) * (1 - Math.cos(angle)) + axis.e(1) * Math.sin(angle),  
     axis.e(3) + (1 - axis.e(3)) * Math.cos(angle), 
     0],
     
    [0,
     0, 
     0, 
     1]
    ]);
}

/**
 * 
 * @param deg
 * @returns {Number}
 */
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

/**
 * Creates a new Cartesian vector that corresponds to the provided homogeneous
 * vector. The Cartesian vector is calculated by dividing the first three 
 * coordinates by the z coordinate.
 * @param homVec
 * @returns Cartesian vector corresponding to the given vector
 */
function toCartesian(homVec) {
    if (homVec.dimensions() == 3)
        return homVec;
    var h = homVec.e(4);
    var vec = homVec.map(function (s) { return s/h; });
    return Vector.create([vec.e(1), vec.e(2), vec.e(3)]);
}

/**
 * Creates a new homogeneous vector from the provided Cartesian vector, i.e.
 * a vector whose first three coordinates are the same as the provided vector
 * and whose z coordinate is 1.
 * @param cartVec
 * @returns Homogeneous vector corresponding to the given vector
 */
function toHomogeneous(cartVec) {
    if (cartVec.dimensions() == 4)
        return cartVec;
    return Vector.create([cartVec.e(1), cartVec.e(2), cartVec.e(3), 1]);
}

/**
 * @param v
 * @returns {Number}: if v > 0 then 1, if v < 0 then -1, otherwise 0
 */
function sign(v) {
    if (v > 0)
        return 1;
    if (v < 0)
        return -1;
    return 0;
}

/**
 * Calculates the length of the given vector.
 * @param vector
 * @returns Length of the vector
 */
function length(vector) {
	var squares = 0;
	for(var i = 1; i <= vector.dimensions(); i++) {
		squares += vector.e(i)*vector.e(i);
	}
	return Math.sqrt(squares);
}

/**
 * Joins all vectors passed as argument vertically to a new matrix.
 * @returns matrix whose columns are the vectors provided
 */
function joinVectors() {
    var args = joinVectors.arguments;
    //assuming all vectors have the same dimension
    var rows = args[0].dimensions();
    var cols = args.length;
    var arr = new Array(rows);

    for (var i = 0; i < args.length; i++) {
        var vec = args[i];
        for (var j = 0; j < rows; j++) {
            if (typeof arr[j] == "undefined")
                arr[j] = new Array(cols);
            arr[j][i] = vec.e(j+1);
        }
    }
    return Matrix.create(arr);
}