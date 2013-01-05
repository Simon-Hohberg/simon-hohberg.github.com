matrixFromProto = (protoMatrix) ->
    return new THREE.Matrix4 protoMatrix.x11, protoMatrix.x12, protoMatrix.x13, protoMatrix.x14, protoMatrix.x21, protoMatrix.x22, protoMatrix.x23, protoMatrix.x24, protoMatrix.x31, protoMatrix.x32, protoMatrix.x33, protoMatrix.x34, protoMatrix.x41, protoMatrix.x42, protoMatrix.x43, protoMatrix.x44
    
vectorFromProto = (protoVector) ->
	x1 = protoVector.x1 ? 0
	x2 = protoVector.x2 ? 0
	x3 = protoVector.x3 ? 0
	return new THREE.Vector3(x1, x2, x3)