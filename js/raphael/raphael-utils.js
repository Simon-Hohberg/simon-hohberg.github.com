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

function addMathToSvg(sourceId, targetSvg) {
  var source = $("#" + sourceId);
  var mathJax = source.find(".MathJax_SVG");
  var svg = mathJax.find("svg");
  var g = svg.find("g");
  var group = $(g[0]).clone();
  group[0].setAttribute("transform", "translate(306 100) scale(0.5) matrix(1 0 0 -1 0 0)");
  targetSvg.append(group);
}


