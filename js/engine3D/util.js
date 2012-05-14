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

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function toCartesian(homVec) {
    if (homVec.dimensions() == 3)
        return homVec;
    var h = homVec.e(4);
    var vec = homVec.map(function (s) { return s/h });
    return Vector.create([vec.e(1), vec.e(2), vec.e(3)]);
}

function toHomogeneous(cartVec) {
    if (cartVec.dimensions() == 4)
        return cartVec;
    return Vector.create([cartVec.e(1), cartVec.e(2), cartVec.e(3), 1]);
}

function sign(v) {
    if (v > 0)
        return 1;
    if (v < 0)
        return -1;
    return 0;
}
