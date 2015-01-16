
function Node(posX, posY, radius) {
  this.posX = posX;
  this.posY = posY;
  this.radius = radius;
  this.links = [];
  this.pathArr = [];
  this.connectionPoints = [ {x: posX, y: posY +  radius}, {x: posX + 2*radius, y: posY + radius} ];
}

Node.prototype.draw = function(paper) {
  var nodeView;
  if (this.radius > 0) {
    nodeView = paper.circle(this.posX, this.posY, this.radius)
  } else if (this.pathArr.length > 0) {
    nodeView = paper.path(this.pathArr);
  }
  var conCircles = [];
  for (var i = 0; i < this.connectionPoints.length; i++) {
    var circle = paper.circle(this.connectionPoints[i].x, this.connectionPoints[i].y, 2);
    circle.attr({ fill: "rgb(0,0,0)"});
    conCircles.push(circle);
  }
  nodeView.attr({fill: "rgb(255,255,255)"});
  
  var self = this;
  nodeView.mouseover(function() {
    nodeView.attr({stroke: "rgb(200,200,200)"});
    for (var i = 0; i < conCircles.length; i++) {
      conCircles[i].attr({stroke: "rgb(200,200,200)", fill: "rgb(200,200,200)"});
    }
    for (var i = 0; i < self.links.length; i++) {
      self.links[i].path.attr({stroke: "rgb(220,130,130)"});
    }
  });
  nodeView.mouseout(function() {
    nodeView.attr({stroke: "rgb(0,0,0)"});
    for (var i = 0; i < conCircles.length; i++) {
      conCircles[i].attr({stroke: "rgb(0,0,0)", fill: "rgb(0,0,0)"});
    }
    for (var i = 0; i < self.links.length; i++) {
      self.links[i].path.attr({stroke: "rgb(0,0,0)"});
    }
  });
}

function PillNode(posX, posY, width, height) {
  this.radius = 0;
  this.posX = posX;
  this.posY = posY;
  this.width = width;
  this.height = height;
  this.connectionPoints = [ {x: posX, y: posY +  height/2}, {x: posX + width, y: posY + height/2} ];
  this.links = []
  
  this.pathArr = [];
  this.pathArr.push(['M', posX + height/2, posY]);
  this.pathArr.push(['A', height/2, height/2, 0, 1, 0, posX+height/2, posY+height]);
  this.pathArr.push(['L', posX+width-height/2, posY+height]);
  this.pathArr.push(['A', height/2, height/2, 0, 1, 0, posX+width-height/2, posY]);
  this.pathArr.push(['L', posX+height/2, posY]);
  
  this.pathArr.push(['M', posX + width-22, posY+height-5]);
  this.pathArr.push(['C', posX + width-8, posY+height-5, posX + width-19, posY+5, posX + width-5, posY+5]);
  this.pathArr.push(['M', posX + 2*width/3, posY + 2]);
  this.pathArr.push(['L', posX + 2*width/3, posY + height - 2]);
}

PillNode.prototype = new Node();
PillNode.constructor = PillNode;

