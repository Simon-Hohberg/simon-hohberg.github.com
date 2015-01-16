function Net(topo, args) {
  this.nodes = [];
  this.links = [];
}

Net.prototype.addNode = function(node) {
  this.nodes.push(node);
  return this;
}

Net.prototype.link = function(nodeIdx1, nodeIdx2) {
  var node1 = this.nodes[nodeIdx1];
  var node2 = this.nodes[nodeIdx2];
  var conPoints = findNearestPoints(node1.connectionPoints, node2.connectionPoints);
  var p1 = node1.connectionPoints[conPoints[0]];
  var p2 = node2.connectionPoints[conPoints[1]];
  var link = new Link(p1.x, p1.y, p2.x, p2.y, node1, node2);
  this.links.push(link);
  node1.links.push(link);
  node2.links.push(link);
  return this;
}

Net.prototype.draw = function(paper) {
  for (var i = 0; i < this.nodes.length; i++) {
    this.nodes[i].draw(raphael);
  }
  for (var i = 0; i < this.links.length; i++) {
    this.links[i].draw(raphael);
  }
  return this;
}
