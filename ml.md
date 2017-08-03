---
layout: page
title: ML Resources
isEditable: true
---

Easily the best way to improve at machine learning is to just get practice at it. Practice helps you improve at machine learning in two ways:
1. You get familiar with implementing common algorithms. Whether you use machine learning libraries or roll your own, becoming comfortable with these algorithms is critical.
2. By working with a variety of data sets, you can also gain an intuition of how data is structured, so you know when to apply what algorithms.

So, the most effective way to gain experience at machine learning is to experience implementing a *variety* of algorithms over *differently behaved* data sets.

I've consolidated the machine learning resources I am familiar with, both from school and outside, into a list below. I've marked each data set with what model(s) I used for the data set, but please experiment with any algorithm that interests you!

## Regression
* Predict food truck profit from city population. Download: [population_profit.csv](public/files/ml_data/population_profit.csv){:download=""}. Dataset from Andrew Ng's Coursera course. Models I used: linear regression.

* Predict house prices. Download: [area_bedrooms_price.csv](public/files/ml_data/area_bedrooms_price.csv){:download=""}. Dataset from Andrew Ng's Coursera course. Models I used: linear regression.

* Predict car MPG from 7 variables. Download: [auto_data.csv](public/files/ml_data/auto_data.csv){:download=""}. Dataset from [UCI repository](https://archive.ics.uci.edu/ml/datasets/Auto+MPG){:target="_blank"}. Models I used: linear regression.

* Predict E. coli bacterial growth rate. For this, use only the gene expressions as attributes. Download: [ecoli_data.zip](public/files/ml_data/ecoli_data.zip){:download=""}. Dataset from Ilias Tagkopoulos at UC Davis. Models I used: linear regression with regularization.


## Classification
**Note: For any supervised classification problem, you can also use it to practice unsupervised clustering by ignoring the class labels.**

* Predict college admission. Download: [score1_score2_admit.csv](public/files/ml_data/score1_score2_admit.csv){:download=""}. Dataset from Andrew Ng's Coursera course. Models I used: logistic regression.

* Predict microchip acceptance. Download: [score1_score2_accept.csv](public/files/ml_data/score1_score2_accept.csv){:download=""}. Dataset from Andrew Ng's Coursera course. Models I used: logistic regression.

* Classify handwritten 0-9 digit. Download: [MNIST_classification.zip](public/files/ml_data/MNIST_classification.zip){:download=""}. Dataset from Andrew Ng's Coursera course. Models I used: logistic regression, fully-connected neural network with 1 hidden layer.

* Classify yeast protein localization site based on 8 features. Download: [yeast_data.csv](public/files/ml_data/yeast_data.csv){:download=""}. Dataset from [UCI repository](https://archive.ics.uci.edu/ml/datasets/Yeast){:target="_blank"}. Models I used: fully-connected neural network with various numbers of layers.

* Classify E. coli bacterial characteristics. Classify the strain type, medium type, environmental type and gene perturbation. Download: [ecoli_data.zip](public/files/ml_data/ecoli_data.zip){:download=""}. Dataset from [Ilias Tagkopoulos](https://faculty.engineering.ucdavis.edu/tagkopoulos/){:target="_blank"} at UC Davis. Models I used: SVM.

## Unsupervised Learning
* Simple synthetic datasets to practice k-means clustering. Download: [kmeans_simple.zip](public/files/ml_data/kmeans_simple.zip){:download=""}. Dataset from [Thomas Strohmer](https://www.math.ucdavis.edu/~strohmer/){:target="_blank"} at UC Davis. Models I used: k-means clustering with BIC and AIC.

* Iris species clustering: try to cluster irises into species based on 4 features. Download: [iris.csv](public/files/ml_data/iris.csv){:download=""}. Dataset from [UCI repository](https://archive.ics.uci.edu/ml/datasets/iris){:target="_blank"}. Models I used: k-means clustering.

* "Crescents" synthetic dataset which is impossible with k-means clustering. Download: [crescents.csv](public/files/ml_data/crescents.csv){:download=""}. Dataset from [Thomas Strohmer](https://www.math.ucdavis.edu/~strohmer/){:target="_blank"} at UC Davis. Models I used: diffusion maps.

## Dimensionality Reduction
* Reduce the dimensionality of 32x32 grayscale face images. Download: [yale_faces.zip](public/files/ml_data/yale_faces.zip){:download=""}. Dataset originally from Yale, collected by [Thomas Strohmer](https://www.math.ucdavis.edu/~strohmer/){:target="_blank"} at UC Davis.
