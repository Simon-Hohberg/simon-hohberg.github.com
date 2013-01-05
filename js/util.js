// Generated by CoffeeScript 1.3.3
var matrixFromProto, vectorFromProto;

matrixFromProto = function(protoMatrix) {
  return new THREE.Matrix4(protoMatrix.x11, protoMatrix.x12, protoMatrix.x13, protoMatrix.x14, protoMatrix.x21, protoMatrix.x22, protoMatrix.x23, protoMatrix.x24, protoMatrix.x31, protoMatrix.x32, protoMatrix.x33, protoMatrix.x34, protoMatrix.x41, protoMatrix.x42, protoMatrix.x43, protoMatrix.x44);
};

vectorFromProto = function(protoVector) {
  var x1, x2, x3, _ref, _ref1, _ref2;
  x1 = (_ref = protoVector.x1) != null ? _ref : 0;
  x2 = (_ref1 = protoVector.x2) != null ? _ref1 : 0;
  x3 = (_ref2 = protoVector.x3) != null ? _ref2 : 0;
  return new THREE.Vector3(x1, x2, x3);
};
