baseUrl = 'js/rdf/robot2012/'

class Robot
    
    description  : null
    bodies       : {}       # maps body.id  => body
    joints       : {}       # maps joint.id => joint
    links        : {}
    motors       : {}
    sensors      : {}
    bodyQueue    : []
    loader       : null
    
    constructor: ->
    
    loadRdf: (rdfUrl, @callback) ->
        # load robot desciption from url
        $.getJSON rdfUrl, @rdfLoadingCallback
    
    
    rdfLoadingCallback: (description) =>
        console.log 'Loading description \"' + description.name + '\" created on ' + description.timestamp
        
        @description = description
        
        # fill queue with bodies
        @bodyQueue = @bodyQueue.concat description.bodies
        
        # load bodies
        @loader = new THREE.JSONLoader()
        console.log 'Loading bodies...'
        @loadBody()
    
    
    loadBody: =>
        if @bodyQueue.length > 0
            path = baseUrl + @bodyQueue[0]['de.fumanoids.message.BodyExternal.path']
            @loader.load path, @addBody
        else
            @loadSensors()
            console.log '...done.\n Creating joints...'
            scene.updateMatrixWorld()
            @createJoints()
            console.log '...done.\n Loading description complete.'
            
            @callback()
    
    
    addBody: (geometry) =>
        
        # pop first element
        body = @bodyQueue[0]
        @bodyQueue.shift()
        
        @bodies[body.id] = body
        
        mesh = new THREE.Mesh geometry, new THREE.MeshFaceMaterial()
        body.mesh = mesh
        matrix = matrixFromProto body.position
        mesh.rotation.getRotationFromMatrix matrix, mesh.scale
        mesh.position.getPositionFromMatrix matrix
        
        # add all bodies at the root node first
        scene.add mesh
        
        @loadBody()
    
    
    loadSensors: =>
        for sensor in @description.sensors
            switch sensor.type
                when 'MOTOR' then @motors[sensor.id] = sensor
                else @sensors[sensor.id] = sensor
    
    
    createJoints: =>
        
        # create a joint for each link
        for link in @description.links
            joint = new Joint link.id, link.name, vectorFromProto(link.axis), vectorFromProto(link.position), link.bodyIsChild
            joint.setBody( if link.bodyID? then @bodies[link.bodyID].mesh else null )
            if link.motorID?
                @motors[link.motorID].joint = joint
            @joints[link.id] = joint
        
        for link in @description.links
            if link.parallelLinkIDs?
                for id in link.parallelLinkIDs
                    @joints[link.id].parallelJoints.push @joints[id]
            if link.parallelOponentLinkID?
                @joints[link.id].opposingJoints.push @joints[link.parallelOponentLinkID]
        
        # add bodies
        for id, body of @bodies
            if body.parentID?
                @joints[body.parentID].addBodyChild body.mesh
        
        # create kinematic chain
        for link in @description.links
            if link.childIDs?
                for childID in link.childIDs
                    @joints[link.id].addJointChild @joints[childID]
      