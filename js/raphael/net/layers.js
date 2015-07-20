function FullyConnectedLayer(node, numNodes, distance) {
  this.nodes = [];
  this.links = [];
  for (var i = 0; i < numNodes; i++) {
    var newNode = $.extend(true, {}, node);
    newNode.setPosition(node.posX, node.posY + distance * i);
    this.nodes.push(newNode);
  }
}

FullyConnectedLayer.prototype.link = function(other) {
  var otherNodes = other.nodes;
  var self = this;
  this.nodes.forEach(function(node) {
    otherNodes.forEach(function(otherNode) {
      self.links.push(createLink(node, otherNode));
    });
  });
}

FullyConnectedLayer.prototype.draw = function(paper) {
  this.nodes.forEach(function(node) {
    node.draw(paper);
  });
}
