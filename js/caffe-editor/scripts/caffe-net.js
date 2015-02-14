function CaffeNet(protobuf) {
  this.bottomLayers = [];
  this.graph = {};
  this.layers = {};
  
  var topMapping = {}
  // map layer names to layer objects
  for(var i = 0; i < protobuf.message.layers.length; i++) {
    var layer = protobuf.message.layers[i];
    this.layers[layer.name] = layer;
  }
  // map layer's tops to its name
  for(var i = 0; i < protobuf.message.layers.length; i++) {
    var layer = protobuf.message.layers[i];
    for(var t = 0; t < layer.top.length; t++) {
      topMapping[layer.top[t]] = layer.name;
    }
  }
  // create graph
  for(var i = 0; i < protobuf.message.layers.length; i++) {
    var layer = protobuf.message.layers[i];
    this.graph[layer.name] = [];
    if (layer.bottom.length == 0) {
      this.bottomLayers.push(layer.name);
    } else {
      for(var b = 0; b < layer.bottom.length; b++) {
        // get name of layer below, i.e. the layer where top matches this layers
        // bottom
        var layerBelow = topMapping[layer.bottom[b]];
        if (layerBelow === undefined) {
          this.bottomLayers.push(layerBelow);
        } else {
          this.graph[layerBelow].push(layer.name);
        }
      }
    }
  }
}

var LayerEnum = {
  0: "NONE",
  35: "ABSVAL",
  1: "ACCURACY",
  30: "ARGMAX",
  2: "BNLL",
  3: "CONCAT",
  37: "CONTRASTIVE_LOSS",
  4: "CONVOLUTION",
  5: "DATA",
  6: "DROPOUT",
  32: "DUMMY_DATA",
  7: "EUCLIDEAN_LOSS",
  25: "ELTWISE",
  8: "FLATTEN",
  9: "HDF5_DATA",
  10: "HDF5_OUTPUT",
  28: "HINGE_LOSS",
  11: "IM2COL",
  12: "IMAGE_DATA",
  13: "INFOGAIN_LOSS",
  14: "INNER_PRODUCT",
  15: "LRN",
  29: "MEMORY_DATA",
  16: "MULTINOMIAL_LOGISTIC_LOSS",
  34: "MVN",
  17: "POOLING",
  26: "POWER",
  18: "RELU",
  19: "SIGMOID",
  27: "SIGMOID_CROSS_ENTROPY_LOSS",
  36: "SILENCE",
  20: "SOFTMAX",
  21: "SOFTMAX_LOSS",
  22: "SPLIT",
  33: "SLICE",
  23: "TANH",
  24: "WINDOW_DATA",
  31: "THRESHOLD"
};

var LayerColors = {
  NONE: "#000000",
  ABSVAL: "#000000",
  ACCURACY: "#000000",
  ARGMAX: "#000000",
  BNLL: "#000000",
  CONCAT: "#000000",
  CONTRASTIVE_LOSS: "#000000",
  CONVOLUTION: "#5B7444",
  DATA: "#47697E",
  DROPOUT: "#000000",
  DUMMY_DATA: "#000000",
  EUCLIDEAN_LOSS: "#000000",
  ELTWISE: "#000000",
  FLATTEN: "#000000",
  HDF5_DATA: "#000000",
  HDF5_OUTPUT: "#000000",
  HINGE_LOSS: "#000000",
  IM2COL: "#000000",
  IMAGE_DATA: "#000000",
  INFOGAIN_LOSS: "#000000",
  INNER_PRODUCT: "#EF7351",
  LRN: "#000000",
  MEMORY_DATA: "#688B9A",
  MULTINOMIAL_LOGISTIC_LOSS: "#000000",
  MVN: "#000000",
  POOLING: "#FFCC33",
  POWER: "#000000",
  RELU: "#A3C586",
  SIGMOID: "#000000",
  SIGMOID_CROSS_ENTROPY_LOSS: "#000000",
  SILENCE: "#000000",
  SOFTMAX: "#000000",
  SOFTMAX_LOSS: "#FCF1D1",
  SPLIT: "#000000",
  SLICE: "#000000",
  TANH: "#000000",
  WINDOW_DATA: "#000000",
  THRESHOLD: "#000000"
};

function CaffeNetView(net) {
  this.net = net;
  
  this.draw = function(paper) {
    var layersDrawn = [];
    var startX = 10;
    var startY = 10;
    var distH = 10;
    var distV = 10;
    var width = 100;
    var height = 20;
      
    var layerQueue = [net.bottomLayers.slice()];
    var row = 0;
    var col = 0;
    while (layerQueue.length > 0) {
      var nextRow = [];
      var currRow = layerQueue.shift();
      currRow.forEach(function(layerName) {
        if ($.inArray(layerName, layersDrawn) == -1) {
          var layer = net.layers[layerName];
          var layersAbove = net.graph[layerName];
          layersAbove.forEach(function(layerAbove) {
            if ($.inArray(layerAbove, nextRow) == -1) {
              nextRow.push(layerAbove);
            }
          });
          rect = paper.rect(startX + col*(width + distH), startY + row*(height + distV), width, height, 5);
          rect.attr({fill: LayerColors[LayerEnum[layer.type]]});
          layersDrawn.push(layerName);
          col++;
        }
      });
      col = 0;
      row++;
      if (nextRow.length > 0) {
        layerQueue = $.merge(layerQueue, [nextRow]);
      }
    }
  };
}
