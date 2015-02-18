function CaffeLayer(id, layerProto) {
  this.id = id;
  this.layerProto = layerProto;
  this.top = [];
  this.bottom = [];
}

CaffeLayer.prototype.addTop = function(layer) {
  this.top.push(layer);
}

CaffeLayer.prototype.addBottom = function(layer) {
  this.bottom.push(layer);
}

CaffeLayer.prototype.hasTop = function(layer) {
  return this.top.length > 0;
}

CaffeLayer.prototype.hasBottom = function(layer) {
  return this.bottom.length > 0;
}
