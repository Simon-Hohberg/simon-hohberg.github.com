---
layout: post
title: Convolutional Neural Networks &ndash; Cheat Sheet
---

Some findings worth noting regarding convolutional neural networks.

### Activation Function

| | |
|---|---|
| **Sigmoid**            | |
| **Hyperbolic Tangent** | |
| **Rectifier**          | |

### Parallelized Training

| | |
|-----------------------|-------------------------------------------------------|
| **Model Parallelism** | One model is trained by multiple workers. Each trains a part of the model. |
| **Data Parallelism**  | Multiple models (or copies of the same model) are trained in parallel using different data sets. |
