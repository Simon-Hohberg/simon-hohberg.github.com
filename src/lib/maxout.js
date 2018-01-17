
(function(){
let Maxout = {};

Raphael.fn.arrow = function(x1, y1, x2, y2, size) {
var angle = Raphael.angle(x1, y1, x2, y2);
var a45   = Raphael.rad(angle-45);
var a45m  = Raphael.rad(angle+45);
var a135  = Raphael.rad(angle-135);
var a135m = Raphael.rad(angle+135);
var x1a = x1 + Math.cos(a135) * size;
var y1a = y1 + Math.sin(a135) * size;
var x1b = x1 + Math.cos(a135m) * size;
var y1b = y1 + Math.sin(a135m) * size;
var x2a = x2 + Math.cos(a45) * size;
var y2a = y2 + Math.sin(a45) * size;
var x2b = x2 + Math.cos(a45m) * size;
var y2b = y2 + Math.sin(a45m) * size;
return this.path(
//      "M"+x1+" "+y1+"L"+x1a+" "+y1a+
//      "M"+x1+" "+y1+"L"+x1b+" "+y1b+
    "M"+x1+" "+y1+"L"+x2+" "+y2+
    "M"+x2+" "+y2+"L"+x2a+" "+y2a+
    "M"+x2+" "+y2+"L"+x2b+" "+y2b
);
};
Maxout.net0 = function() {
var svgWidth = 700;
var svgHeight = 260;
var raphael = Raphael("svg-container-0", '100%', '100%');
raphael.setViewBox(0, 0, svgWidth, svgHeight, true);
//$("#svg-container").css("padding-bottom", ((svgHeight/svgWidth)*100) + "%")

var black = "rgb(0,0,0)";
var green = "rgb(0,255,0)";
var blue = "rgb(0,0,255)"
var grey = "rgb(180,180,180)";
var darkGrey = "rgb(100,100,100)";

var numMaxoutUnits = 5;

var net = new Net(raphael);
var neuronRadius = 5;
var inLayer = new FullyConnectedLayer(new NetNode(100, 70, neuronRadius, 0, black), numMaxoutUnits, 30);
var fcLayer1 = new FullyConnectedLayer(new NetNode(200, 110, neuronRadius, 0, green), numMaxoutUnits, 30);
var fcLayer2 = new FullyConnectedLayer(new NetNode(250, 70, neuronRadius, 0, green), numMaxoutUnits, 30);
var fcLayer3 = new FullyConnectedLayer(new NetNode(300, 30, neuronRadius, 0, green), numMaxoutUnits, 30);
var maxLayer = new FullyConnectedLayer(new NetNode(400, 70, neuronRadius, 0, blue), numMaxoutUnits, 30);
inLayer.link(fcLayer1);
inLayer.link(fcLayer2);
inLayer.link(fcLayer3);
net.addLayer(inLayer).addLayer(fcLayer1).addLayer(fcLayer2).addLayer(fcLayer3).addLayer(maxLayer);
for(var i = 0; i < maxLayer.nodes.length; i++) {
    net.link(i + 4*numMaxoutUnits, i + numMaxoutUnits);
    net.link(i + 4*numMaxoutUnits, i + 2*numMaxoutUnits);
    net.link(i + 4*numMaxoutUnits, i + 3*numMaxoutUnits);
}
var bias = new FullyConnectedLayer(new NetNode(100, 220, neuronRadius, 0, grey), 1, 0);

bias.link(fcLayer1);
bias.link(fcLayer2);
bias.link(fcLayer3);
net.addLayer(bias);

var inputNeuronIndexes = Array.apply(null, Array(numMaxoutUnits)).map(function (_, i) {return i;});
var fcNeuronIndexes = Array.apply(null, Array(3*numMaxoutUnits)).map(function (_, i) {return i+numMaxoutUnits;});
var maxPoolNeuronIndexes = Array.apply(null, Array(numMaxoutUnits)).map(function (_, i) {return i+4*numMaxoutUnits;});
var biasIndexes = [5*numMaxoutUnits]

// draw
net.draw(raphael);
Array.apply(null, Array(numMaxoutUnits)).map(function (_, i) {return i+3*numMaxoutUnits;}).forEach(function(idx) {
    net.nodes[idx].nodeView.toBack();
});

// indexes
var dArrow = raphael.arrow(80, 70, 80, 190, 3).toBack();
dArrow.attr({"stroke": darkGrey});
var textD = raphael.text(70, 80, "d");
textD.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": darkGrey });

var kArrow = raphael.arrow(200, 250, 300, 170, 3).toBack();
kArrow.attr({"stroke": darkGrey});
var textK = raphael.text(230, 240, "k");
textK.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": darkGrey });

var mArrow = raphael.arrow(320, 30, 320, 150, 3).toBack();
mArrow.attr({"stroke": darkGrey});
var textM = raphael.text(330, 40, "m");
textM.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": darkGrey });

var mArrow = raphael.arrow(420, 70, 420, 190, 3).toBack();
mArrow.attr({"stroke": darkGrey});
var textM = raphael.text(430, 80, "m");
textM.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": darkGrey });


var textX = raphael.text(100, 50, "x");
textX.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": black });

var textZ = raphael.text(300, 10, "z");
textZ.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": black });

var textH = raphael.text(400, 50, "h");
textH.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": black });

var textX = raphael.text(560, 20, "Input Units");
textX.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif" });
var textFC = raphael.text(600, 40, "Fully-connected Units");
textFC.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": green });
var textFC = raphael.text(587, 60, "Max-pooling Units");
textFC.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": blue });
var textBias = raphael.text(538, 80, "Bias");
textBias.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": grey });

var inputNeuronExample = new NetNode(500, 20, neuronRadius, 0, black);
inputNeuronExample.draw(raphael);
var fcNeuronExample = new NetNode(500, 40, neuronRadius, 0, green);
fcNeuronExample.draw(raphael);
var maxPoolNeuronExample = new NetNode(500, 60, neuronRadius, 0, blue);
maxPoolNeuronExample.draw(raphael);
var biasExample = new NetNode(500, 80, neuronRadius, 0, grey);
biasExample.draw(raphael);

inputNeuronExample.nodeView.mouseover(function() {
    inputNeuronExample.highlight();
    net.highlight(inputNeuronIndexes);
});
inputNeuronExample.nodeView.mouseout(function() {
    inputNeuronExample.unhighlight();
    net.unhighlight(inputNeuronIndexes);
});

fcNeuronExample.nodeView.mouseover(function() {
    fcNeuronExample.highlight();
    net.highlight(fcNeuronIndexes);
});
fcNeuronExample.nodeView.mouseout(function() {
    fcNeuronExample.unhighlight();
    net.unhighlight(fcNeuronIndexes);
});

maxPoolNeuronExample.nodeView.mouseover(function() {
    maxPoolNeuronExample.highlight();
    net.highlight(maxPoolNeuronIndexes);
});
maxPoolNeuronExample.nodeView.mouseout(function() {
    maxPoolNeuronExample.unhighlight();
    net.unhighlight(maxPoolNeuronIndexes);
});

biasExample.nodeView.mouseover(function() {
    biasExample.highlight();
    net.highlight(biasIndexes);
});
biasExample.nodeView.mouseout(function() {
    biasExample.unhighlight();
    net.unhighlight(biasIndexes);
});
}

Maxout.net1 = function() {
    var svgWidth = 700;
    var svgHeight = 160;
    var raphael = Raphael("svg-container-1", '100%', '100%');
    raphael.setViewBox(0, 0, svgWidth, svgHeight, true);
    //$("#svg-container").css("padding-bottom", ((svgHeight/svgWidth)*100) + "%")
    
    var black = "rgb(0,0,0)";
    var grey = "rgb(180,180,180)";
    var green = "rgb(0,255,0)";
    var blue = "rgb(0,0,255)"
    
    var net = new Net(raphael);
    var neuronRadius = 5;
    var inLayer = new FullyConnectedLayer(new NetNode(100, 70, neuronRadius, 0, black), 1, 20);
    var fcLayer1 = new FullyConnectedLayer(new NetNode(200, 110, neuronRadius, 0, green), 1, 20);
    var fcLayer2 = new FullyConnectedLayer(new NetNode(250, 70, neuronRadius, 0, green), 1, 20);
    var fcLayer3 = new FullyConnectedLayer(new NetNode(300, 30, neuronRadius, 0, green), 1, 20);
    var maxLayer = new FullyConnectedLayer(new NetNode(400, 70, neuronRadius, 0, blue), 1, 20);
    inLayer.link(fcLayer1);
    inLayer.link(fcLayer2);
    inLayer.link(fcLayer3);
    net.addLayer(inLayer).addLayer(fcLayer1).addLayer(fcLayer2).addLayer(fcLayer3).addLayer(maxLayer);
    for(var i = 0; i < maxLayer.nodes.length; i++) {
      net.link(i + 4, i + 1);
      net.link(i + 4, i + 2);
      net.link(i + 4, i + 3);
    }
    var bias = new FullyConnectedLayer(new NetNode(100, 100, neuronRadius, 0, grey), 1, 0);
    
    bias.link(fcLayer1);
    bias.link(fcLayer2);
    bias.link(fcLayer3);
    net.addLayer(bias);
    
    var inputNeuronIndexes = [0];
    var fcNeuronIndexes = [1,2,3]
    var maxPoolNeuronIndexes = [4];
    var biasIndexes = [5];
    
    // draw
    net.draw(raphael);

    var textX = raphael.text(100, 50, "x");
    textX.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": black });

    var textZ = raphael.text(300, 10, "z");
    textZ.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": black });
    
    var textH = raphael.text(400, 50, "h");
    textH.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": black });

    var textX = raphael.text(560, 20, "Input Units");
    textX.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif" });
    var textFC = raphael.text(600, 40, "Fully-connected Units");
    textFC.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": green });
    var textFC = raphael.text(587, 60, "Max-pooling Units");
    textFC.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": blue });
    var textBias = raphael.text(538, 80, "Bias");
    textBias.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif", "fill": grey });
    
    var inputNeuronExample = new NetNode(500, 20, neuronRadius, 0, black);
    inputNeuronExample.draw(raphael);
    var fcNeuronExample = new NetNode(500, 40, neuronRadius, 0, green);
    fcNeuronExample.draw(raphael);
    var maxPoolNeuronExample = new NetNode(500, 60, neuronRadius, 0, blue);
    maxPoolNeuronExample.draw(raphael);
    var biasExample = new NetNode(500, 80, neuronRadius, 0, grey);
    biasExample.draw(raphael);
    
    inputNeuronExample.nodeView.mouseover(function() {
      inputNeuronExample.highlight();
      net.highlight(inputNeuronIndexes);
    });
    inputNeuronExample.nodeView.mouseout(function() {
      inputNeuronExample.unhighlight();
      net.unhighlight(inputNeuronIndexes);
    });
    
    fcNeuronExample.nodeView.mouseover(function() {
      fcNeuronExample.highlight();
      net.highlight(fcNeuronIndexes);
    });
    fcNeuronExample.nodeView.mouseout(function() {
      fcNeuronExample.unhighlight();
      net.unhighlight(fcNeuronIndexes);
    });
    
    maxPoolNeuronExample.nodeView.mouseover(function() {
      maxPoolNeuronExample.highlight();
      net.highlight(maxPoolNeuronIndexes);
    });
    maxPoolNeuronExample.nodeView.mouseout(function() {
      maxPoolNeuronExample.unhighlight();
      net.unhighlight(maxPoolNeuronIndexes);
    });
    
    biasExample.nodeView.mouseover(function() {
      biasExample.highlight();
      net.highlight(biasIndexes);
    });
    biasExample.nodeView.mouseout(function() {
      biasExample.unhighlight();
      net.unhighlight(biasIndexes);
    });
  }

  var root = this;

  // AMD Loader
  if (typeof define === 'function' && define.amd) {
    define(function () {
      'use strict';
      return Maxout;
    });
  
  // CommonJS/nodeJS Loader
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Maxout;
  
  // Regular Browser loader
  } else {
    root.Maxout = Maxout;
  }
  }).call(this);
