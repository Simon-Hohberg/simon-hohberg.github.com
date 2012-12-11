baseUrl = 'js/rdf/robot2012/'

class Robot
	
    constructor: ->
        @bodies = []
        @joints = []
        @isInitialized = false
        @bodyQueue = []
        @loader = null
    
    
    loadRdf: (rdfUrl) ->
    	$.getJSON rdfUrl, @rdfLoadingCallback
    
    
    rdfLoadingCallback: (description) =>
        console.log 'loading description \"' + description.name + '\"'
        
        # fill queue with bodies
        @bodyQueue = @bodyQueue.concat description.bodies
        
        # load bodies
        @loader = new THREE.JSONLoader()
        @loadNextBody()
    
    
    loadNextBody: =>
        if @bodyQueue.length > 0
            path = baseUrl + @bodyQueue[0]['de.fumanoids.message.BodyExternal.path']
            console.log 'adding body #' + @bodyQueue[0].id
            @bodyQueue[0].id + ' loaded from ' + path
            @loader.load path, @addBody
    
    
    addBody: (geometry) =>
    	
    	# pop first element
        body = @bodyQueue[0]
        @bodyQueue.shift()
        
        mesh = new THREE.Mesh geometry, new THREE.MeshFaceMaterial()
        body.mesh = mesh
        #bodies[body.id] = body
        mesh.matrix = matrixFromProto body.position
        mesh.matrixAutoUpdate = false
        mesh.updateMatrixWorld true
        scene.add mesh
        @loadNextBody()
      