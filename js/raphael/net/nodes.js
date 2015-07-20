
function Node(posX, posY, radius, connectionPoinSize, color) {
  this.posX = posX;
  this.posY = posY;
  this.radius = radius;
  this.links = [];
  this.pathArr = [];
  this.connectionPoints = [ {x: posX - radius, y: posY}, {x: posX + radius, y: posY} ];
  this.connectionPointSize = connectionPoinSize;
  this.color = color;
  this.nodeView = undefined;
  this.connectionCircles = [];
}

Node.prototype.setPosition = function(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.connectionPoints = [ {x: posX - this.radius, y: posY}, {x: posX + this.radius, y: posY} ];
}

Node.prototype.highlight = function() {
  this.nodeView.attr({fill: this.color});
  for (var i = 0; i < this.connectionCircles.length; i++) {
    this.connectionCircles[i].attr({stroke: "rgb(200,200,200)", fill: "rgb(200,200,200)"});
  }
  for (var i = 0; i < this.links.length; i++) {
    this.links[i].highlight();
  }
}

Node.prototype.unhighlight = function() {
  this.nodeView.attr({fill: "rgb(255,255,255)"});
  for (var i = 0; i < this.connectionCircles.length; i++) {
    this.connectionCircles[i].attr({stroke: "rgb(0,0,0)", fill: "rgb(0,0,0)"});
  }
  for (var i = 0; i < this.links.length; i++) {
    this.links[i].unhighlight();
  }
}

Node.prototype.draw = function(paper) {
  if (this.radius > 0) {
    this.nodeView = paper.circle(this.posX, this.posY, this.radius)
  } else if (this.pathArr.length > 0) {
    this.nodeView = paper.path(this.pathArr);
  }
  if (this.connectionPointSize > 0) {
    for (var i = 0; i < this.connectionPoints.length; i++) {
      var circle = paper.circle(this.connectionPoints[i].x, this.connectionPoints[i].y, this.connectionPointSize);
      circle.attr({ fill: "rgb(0,0,0)"});
      this.connectionCircles.push(circle);
    }
  }
  this.nodeView.attr({stroke: this.color});
  this.nodeView.attr({fill: "rgb(255,255,255)"});
  
  var self = this;
  this.nodeView.mouseover(function() {
    self.highlight();
  });
  this.nodeView.mouseout(function() {
    self.unhighlight();
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
PillNode.prototype.setPosition = function(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.connectionPoints = [ {x: posX, y: posY +  this.height/2}, {x: posX + this.width, y: posY + this.height/2} ];
  this.pathArr = [];
  this.pathArr.push(['M', posX + this.height/2, posY]);
  this.pathArr.push(['A', this.height/2, this.height/2, 0, 1, 0, posX+this.height/2, posY+this.height]);
  this.pathArr.push(['L', posX+this.width-this.height/2, posY+this.height]);
  this.pathArr.push(['A', this.height/2, this.height/2, 0, 1, 0, posX+this.width-this.height/2, posY]);
  this.pathArr.push(['L', posX+this.height/2, posY]);
  
  this.pathArr.push(['M', posX + this.width-22, posY+this.height-5]);
  this.pathArr.push(['C', posX + this.width-8, posY+this.height-5, posX + this.width-19, posY+5, posX + this.width-5, posY+5]);
  this.pathArr.push(['M', posX + 2*this.width/3, posY + 2]);
  this.pathArr.push(['L', posX + 2*this.width/3, posY + this.height - 2]);
}

