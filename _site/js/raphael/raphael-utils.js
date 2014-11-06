function Grid(posX, posY, numCols, numRows, colSize, rowSize) {
  this.pathArr = [];
  for (c = 0; c < numCols+1; c++) {
    this.pathArr.push(['M', posX + c * colSize, posY]);
    this.pathArr.push(['L', posX + c * colSize, posY + numRows * rowSize]);
  }
  for (r = 0; r < numRows+1; r++) {
    this.pathArr.push(['M', posX, posY + r * rowSize]);
    this.pathArr.push(['L', posX + numCols * colSize, posY +  r * rowSize]);
  }
  
  this.draw = function(paper) {
    this.path = paper.path(this.pathArr);
      // skew by -10rad around x, scale x by 0.5 and translate by 50
    var m = Raphael.matrix(0.5, Math.tan(-10), 0, 1, 10, 80);
    this.path.attr({transform: m.toTransformString(), fill: "rgb(255,255,255)"});
  };
}

function euclideanDist(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function findNearestPoints(arr1, arr2) {
  var minDist = -1;
  var arr1Idx = -1;
  var arr2Idx = -1;
  for (var i = 0; i < arr1.length; i++) {
    for (var j = 0; j < arr2.length; j++) {
      var dist = euclideanDist(arr1[i], arr2[j]);
      if (minDist == -1 || dist < minDist) {
        minDist = dist;
        arr1Idx = i;
        arr2Idx = j;
      }
    }
  }
  return [arr1Idx, arr2Idx];
}

function Node(posX, posY, width, height) {
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
  
  this.linkTo = function(node) {
    var conPoints = findNearestPoints(this.connectionPoints, node.connectionPoints);
    var p1 = this.connectionPoints[conPoints[0]];
    var p2 = node.connectionPoints[conPoints[1]];
    var link = new Link(p1.x, p1.y, p2.x, p2.y, this, node);
    this.links.push(link);
    node.links.push(link);
    return link;
  };
  
  this.draw = function(paper) {
    var path = paper.path(this.pathArr);
    var conCircles = [];
    for (var i = 0; i < this.connectionPoints.length; i++) {
      var circle = paper.circle(this.connectionPoints[i].x, this.connectionPoints[i].y, 2);
      circle.attr({ fill: "rgb(0,0,0)"});
      conCircles.push(circle);
    }
    path.attr({fill: "rgb(255,255,255)"});
    
    var self = this;
    path.mouseover(function() {
      path.attr({stroke: "rgb(200,200,200)"});
      for (var i = 0; i < conCircles.length; i++) {
        conCircles[i].attr({stroke: "rgb(200,200,200)", fill: "rgb(200,200,200)"});
      }
      for (var i = 0; i < self.links.length; i++) {
        self.links[i].path.attr({stroke: "rgb(220,130,130)"});
      }
    });
    path.mouseout(function() {
      path.attr({stroke: "rgb(0,0,0)"});
      for (var i = 0; i < conCircles.length; i++) {
        conCircles[i].attr({stroke: "rgb(0,0,0)", fill: "rgb(0,0,0)"});
      }
      for (var i = 0; i < self.links.length; i++) {
        self.links[i].path.attr({stroke: "rgb(0,0,0)"});
      }
    });
  };
}

function Link(fromX, fromY, toX, toY, nodeFrom, nodeTo) {
  this.nodeFrom = nodeFrom;
  this.nodeTo = nodeTo;
  this.pathArr = [];
  this.pathArr.push(['M', fromX, fromY]);
  this.pathArr.push(['L', toX, toY]);
  this.path = null;

  this.draw = function(paper) {
    this.path = paper.path(this.pathArr);
  };
}

function addMathToSvg(sourceId, targetSvg) {
  var source = $("#" + sourceId);
  var mathJax = source.find(".MathJax_SVG");
  var svg = mathJax.find("svg");
  var g = svg.find("g");
  var group = $(g[0]).clone();
  group[0].setAttribute("transform", "translate(306 63) scale(0.012) matrix(1 0 0 -1 0 0)");
  targetSvg.append(group);
}


