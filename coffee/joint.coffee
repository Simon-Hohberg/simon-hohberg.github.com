class Joint
	
	body     : null # body mesh object
	motor    : null # proto motor object
	children : {}   # map of child joints: joint.id => joint
    
    
	constructor : (@id, @name, @axis, position, @bodyIsChild) ->
        @sceneNode = new THREE.Object3D()
        @sceneNode.position.set position.x, position.y, position.z
        @axis.normalize()
        
        # add joint at root first
        scene.add @sceneNode
        scene.updateMatrixWorld()
    
    
    rotate: (radians) ->
        matrix = new THREE.Matrix4().makeRotationAxis @axis, radians
        @sceneNode.matrix.multiplySelf matrix
        @sceneNode.rotation.getRotationFromMatrix matrix, @sceneNode.scale
    
    
    addBodyChild: (bodyMesh) ->
    	
        bodyMatrixWorld = new THREE.Matrix4()
        bodyMatrixWorld.copy bodyMesh.matrixWorld
        
        # remove from last parent
        if bodyMesh.parent?
            bodyMesh.parent.remove bodyMesh
        
        # get inverse world matrix of joint node
        invSceneNodeMatrixWorld = new THREE.Matrix4()
        invSceneNodeMatrixWorld.getInverse @sceneNode.matrixWorld
        
        # calculate relative matrix of body
        bodyMesh.matrix.multiply invSceneNodeMatrixWorld, bodyMatrixWorld
        bodyMesh.rotation.getRotationFromMatrix bodyMesh.matrix, bodyMesh.scale
        bodyMesh.position.getPositionFromMatrix bodyMesh.matrix
        @sceneNode.add bodyMesh
        
        scene.updateMatrixWorld()
	
	
	addJointChild: (joint) ->
		
        childMatrixWorld = new THREE.Matrix4()
        childMatrixWorld.copy joint.sceneNode.matrixWorld
		
        @children[joint.id] = joint
        
        # remove from last parent
        if joint.sceneNode.parent?
            joint.sceneNode.parent.remove joint.sceneNode
        
        # get inverse world matrix of joint node
        invSceneNodeMatrixWorld = new THREE.Matrix4()
        invSceneNodeMatrixWorld.getInverse @sceneNode.matrixWorld
        
        # calculate relative matrix of joint
        joint.sceneNode.matrix.multiply invSceneNodeMatrixWorld, childMatrixWorld
        joint.sceneNode.rotation.getRotationFromMatrix joint.sceneNode.matrix, joint.sceneNode.scale
        joint.sceneNode.position.getPositionFromMatrix joint.sceneNode.matrix
        @sceneNode.add joint.sceneNode
        
        if joint.hasBody() and not joint.bodyIsChild
        	@addBodyChild joint.body
        else
        	scene.updateMatrixWorld()
    
    
    setBody: (bodyMesh) ->
    	@body = bodyMesh
    	if @bodyIsChild
    		@addBodyChild bodyMesh
    
    
    hasBody: -> @body?
    
    
    hasMotor: -> @motor?
    
    
    hasParent: -> @sceneNode.parent?