bodyQueue = []
loader = null
baseUrl = 'js/rdf/robot2012/'

class Robot
	
	@bodies = new THREE.Object3D()
	@joints = []
	@isInitialized = false
	
	constructor: (@rdfUrl) ->
        $.getJSON(rdfUrl, rdfLoadingCallback)


rdfLoadingCallback = (description) ->
    console.log 'loading description \"' + description.name + '\"'
    
    bodyQueue = bodyQueue.concat description.bodies
    
    # loader bodies
    loader = new THREE.JSONLoader()
    loadNextBody()

loadNextBody = ->
    if bodyQueue.length > 0
        path = baseUrl + bodyQueue[0]['de.fumanoids.message.BodyExternal.path']
        console.log 'adding body #' + bodyQueue[0].id + ' loaded from ' + path
        loader.load path, addBody

addBody = (geometry) ->
	
	# pop first element
    body = bodyQueue[0]
    bodyQueue.shift()
    
    zmesh = new THREE.Mesh geometry, new THREE.MeshFaceMaterial()
    zmesh.position.set 0, 5, 0
    zmesh.scale.set 5, 5, 5
    scene.add zmesh
    loadNextBody()
        