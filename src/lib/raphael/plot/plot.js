function Plot(func, rangeStart, rangeStop) {
  this.func = func;
  this.rangeStart = rangeStart;
  this.rangeStop = rangeStop;
}

Plot.prototype.draw = function(paper) {
  var res = 100;
  var pathArr =['M', 0, res-this.func(this.rangeStart)*(res/2)];
  var stepSize = (this.rangeStop - this.rangeStart)/res;
  for(var x = 0; x < res; x++) {
    pathArr.push(['L', x, (res-this.func(this.rangeStart + stepSize*x)*(res/2))]);
  }
  paper.path(pathArr);
};
