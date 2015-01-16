---
layout: post
title: Convolutional Neural Networks &ndash; Cheat Sheet
---

Some findings worth noting regarding convolutional neural networks.

<script type="text/javascript" src="/js/raphael/raphael-min.js"></script>
<script type="text/javascript" src="/js/raphael/plot/plot.js"></script>

### Activation Function

Purpose: Introduce non-linearity

<div id="sigm-plot"></div>

<script type="text/javascript">
  
  var svgWidth = 100;
  var svgHeight = 100;
  var raphael = Raphael("sigm-plot", 100, 100);
  raphael.setViewBox(0, 0, svgWidth, svgHeight, true);

  var sigmPlot = new Plot(function(x){return 1/(1+Math.exp(-x))}, -4, 4);
  sigmPlot.draw(raphael);
</script>


| | |
|---|---|
| **Sigmoid**            | |
| **Hyperbolic Tangent** | |
| **Rectifier**          | |
| **Soft Plus**          | |

### Parallelized Training

| | |
|-----------------------|-------------------------------------------------------|
| **Model Parallelism** | One model is trained by multiple workers. Each trains a part of the model. |
| **Data Parallelism**  | Multiple models (or copies of the same model) are trained in parallel using different data sets. |
