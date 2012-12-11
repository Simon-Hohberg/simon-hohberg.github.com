
width = 800
height = 600

scene = null
renderer = null
camera = null
controls = null
zmesh = null
mouseX = 0
mouseY = 0

robot = null

document.addEventListener  'mousemove', onDocumentMouseMove, false

onDocumentMouseMove = (event) ->
    mouseX = event.clientX - width/2
    mouseY = event.clientY - height/2

init = ->
    
    robot = new Robot('js/rdf/robot2012/Robot2012.js')
	
    canvas = document.getElementById 'robotCanvas'
    renderer = new THREE.WebGLRenderer()
    renderer.setSize width, height
    renderer.domElement.id = 'robotCanvas'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '150px'
    renderer.domElement.style.left = '50px'
    document.body.appendChild renderer.domElement
    
    scene = new THREE.Scene()
    
    # ambient light
    ambient = new THREE.AmbientLight( 0xaaaaaa )
    scene.add ambient
            
    # direct lights
    directionalLight = new THREE.DirectionalLight( 0xffeedd )
    directionalLight.position.set( 0, -70, 100 ).normalize()
    scene.add directionalLight
    
    camera = new THREE.PerspectiveCamera( 35, 800 / 600, 0.1, 10000 )
    camera.position.set 0, 0, 50
    camera.lookAt scene.position
    scene.add camera
    
    # controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.target.set 0, 0, 0
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8
    controls.noZoom = false
    controls.noPan = false
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    # keys "A", "S", "D"
    controls.keys = [ 65, 83, 68 ]
    controls.addEventListener( 'change', render ) 

render = ->
    renderer.render scene, camera

# animation loop
animate = ->
    requestAnimationFrame animate
    controls.update()
    render()
