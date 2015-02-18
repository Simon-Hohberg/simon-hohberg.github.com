function CaffeNet(protobuf) {
  this.roots = [];
  
  // maps IDs to layer objects
  this.layers = [];
  var topMapping = {}
  // create layer models
  for(var i = 0; i < protobuf.message.layers.length; i++) {
    var layer = new CaffeLayer(i, protobuf.message.layers[i]);
    this.layers.push(layer);
    // map top blob names to layer(s)
    if (layer.proto.top !== undefined) {
      for(var t = 0; t < layer.proto.top.length; t++) {
        var topName = layer.proto.top[t];
        // ignore in-place layers here
        if ($.inArray(topName, layer.proto.bottom) != -1) {
          continue;
        }
        if (topMapping[topName] === undefined) {
          topMapping[topName] = [];
        }
        topMapping[topName].push(layer);
      }
    }
  }
  var self = this;
  // create graph
  this.layers.forEach(function(layer) {
    var bottom = layer.proto.bottom;
    // check if this layer is a root of the graph
    if (bottom === undefined) {
      self.roots.push(layer);
    } else if (bottom.length == 0) {
      self.roots.push(layer);
    }
    bottom.forEach(function(nameBelow) {
      // get layers below, i.e. the layers where top matches the layer's bottom
      var layersBelow = topMapping[nameBelow];
      // again when there are no layers below, the layer is a root of the graph
      if (layersBelow === undefined) {
        self.roots.push(layer);
      } else {
        // link layers to form the graph
        layersBelow.forEach(function(lb) {
          if ($.inArray(nameBelow, layer.proto.top) != -1) {
            lb.addInPlace(layer);
          } else {
            layer.addBottom(lb);
          }
        });
      }
    });
  });
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
  SOFTMAX_LOSS: "#A61F3D",
  SPLIT: "#000000",
  SLICE: "#000000",
  TANH: "#000000",
  WINDOW_DATA: "#000000",
  THRESHOLD: "#000000"
};

function CaffeNetView(net) {
  var startX = 10;
  var startY = 10;
  var distH = 10;
  var distV = 10;
  var width = 100;
  var height = 20;
  this.net = net;
  this.layerViews = {};
  var self = this;
  this.net.layers.forEach(function(layer) {
    self.layerViews[layer] = new CaffeLayerView(layer, startX, startY, width, height, distH, distV);
  });
}

CaffeNetView.prototype.draw = function(paper) {
  // find longest path for required number of "rows" of layers
  var longestPath = [];
  // queue of paths
  var paths = [];
  net.roots.forEach(function(root) {
    // save each path as list of layers
    paths.push([root]);
  });
  // traverse graph until all paths have been examined
  while (paths.length > 0) {
    var path = paths.shift();
    var lastLayer = path[path.length-1];
    // check for layers following this layer
    // if none, the path ends and we check if there was a longer path, yet
    if (lastLayer.hasTop()) {
      lastLayer.tops.forEach(function(top) {
        var newPath = path.slice();
        newPath.push(top);
        paths.push(newPath);
      });
    } else {
      // save longest path
      if (path.length > longestPath.length) {
        longestPath = path;
      }
    }
  }
  
  var rowMapping = {};
  var graphTable = [];
  for (var i = 0; i < longestPath.length; i++) {
    var layer = longestPath[i];
    rowMapping[layer] = i;
    graphTable[i] = [layer];
    this.layerViews[layer].draw(paper, i, 0);
  }
  var self = this;
  net.roots.forEach(function(root) {
    if ($.inArray(root, graphTable[0]) == -1) {
      rowMapping[root] = 0;
      graphTable[0].push(root);
      self.layerViews[root].draw(paper, 0, graphTable[0].length-1);
    }
  });
  
  var layerQueue = net.roots.slice();
  while (layerQueue.length > 0) {
    var layer = layerQueue.shift();
    layer.tops.forEach(function(layerAbove) {
      layerQueue.push(layerAbove);
      if (rowMapping[layerAbove] === undefined) {
        var maxRow = 0;
        layerAbove.bottoms.forEach(function(l) {
          if (rowMapping[l] !== undefined) {
            if (rowMapping[l] > maxRow) {
              maxRow = rowMapping[l];
            }
          }
        });
        var row = maxRow + 1;
        var col = graphTable[row].length;
        self.layerViews[layerAbove].draw(paper, row, col);
        rowMapping[layerAbove] = row;
        graphTable[row].push(layerAbove);
      }
    });
  }
};
