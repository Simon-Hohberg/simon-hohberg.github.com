function CaffeLayer(id, proto) {
  this.id = id;
  this.proto = proto;
  this.tops = [];
  this.bottoms = [];
  this.inplace = [];
}

CaffeLayer.prototype.addBottom = function(layer) {
  if ($.inArray(layer, this.bottoms) == -1) {
    this.bottoms.push(layer);
  }
  if ($.inArray(this, layer.tops) == -1) {
    layer.tops.push(this);
  }
}

CaffeLayer.prototype.addTop = function(layer) {
  layer.addBottom(this);
}

CaffeLayer.prototype.addInPlace = function(layer) {
  this.inplace.push(layer);
}

CaffeLayer.prototype.hasTop = function() {
  return this.tops.length > 0;
}

CaffeLayer.prototype.hasBottom = function() {
  return this.bottoms.length > 0;
}

CaffeLayer.prototype.hasInPlace = function() {
  return this.inplace.length > 0;
}

CaffeLayer.prototype.toString = function() {
  return "" + this.id;
}


function CaffeLayerView(layer, startX, startY, width, height, distH, distV) {
  this.layer = layer;
  this.startX = startX;
  this.startY = startY;
  this.width = width;
  this.height = height;
  this.distH = distH;
  this.distV = distV;
}

CaffeLayerView.prototype.draw = function(paper, row, col) {
  var viewSet = paper.set();
  var rect = paper.rect(0, 0, this.width, this.height, 5);
  rect.attr({fill: LayerColors[LayerEnum[this.layer.proto.type]]});
  viewSet.push(rect);
  var layerNameText = paper.text(3, 5, this.layer.proto.name);
  layerNameText.attr({fill: "#ffffff", "text-anchor": "start"});
  viewSet.push(layerNameText);
  viewSet.translate(this.startX + col*(this.width + this.distH), this.startY + row*(this.height + this.distV));
};

CaffeLayerView.prototype.toString = function() {
  return this.layer.toString();
}
