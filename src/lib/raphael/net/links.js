
function Link(fromX, fromY, toX, toY, nodeFrom, nodeTo) {
  this.nodeFrom = nodeFrom;
  this.nodeTo = nodeTo;
  this.pathArr = [];
  this.pathArr.push(['M', fromX, fromY]);
  this.pathArr.push(['L', toX, toY]);
  this.path = null;
}

Link.prototype.highlight = function() {
  this.path.attr({stroke: "rgb(220,30,30)"});
}

Link.prototype.unhighlight = function() {
  //this.path.strokeLinearGradient("grad1", 1);
  this.path.attr({stroke: "rgba(200,200,200,0.5)"});
}

Link.prototype.draw = function(paper) {
  this.path = paper.path(this.pathArr);
  this.path.attr({stroke: "rgba(200,200,200,0.5)"});
}

