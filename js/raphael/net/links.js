
function Link(fromX, fromY, toX, toY, nodeFrom, nodeTo) {
  this.nodeFrom = nodeFrom;
  this.nodeTo = nodeTo;
  this.pathArr = [];
  this.pathArr.push(['M', fromX, fromY]);
  this.pathArr.push(['L', toX, toY]);
  this.path = null;
}

Link.prototype.draw = function(paper) {
  this.path = paper.path(this.pathArr);
}

