class Joint
	
    @bodies = new THREE.Object3D()
    
	constructor : (@axis, @motorID) ->

    rotate = (radiants) ->
    	matrix = new THREE.Matrix4().makeRotationAxis axis, radiants
    	bodies.setRotationFromMatrix matrix
