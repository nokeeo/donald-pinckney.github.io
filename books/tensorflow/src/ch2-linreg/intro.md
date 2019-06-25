---
layout: bookpost
title: Linear Regression
date: 2017-11-21
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch2-linreg/intro.md
published: false
---

<link rel="stylesheet" href="/public/css/bootstrap.min.css">

<div class="alert alert-danger" role="alert">Warning: The TensorFlow tutorials are now deprecated and will not be updated. Please see <a href="/books/pytorch/book/ch2-linreg/intro.html">the corresponding PyTorch tutorials.</a></div>

# Linear Regression

Roughly, there are two categories of machine learning:

1. In **supervised learning** one already has access to a data set of example inputs and desired outputs, and teaches the computer to produce the desired outputs given the example inputs.
2. In **unsupervised learning** one only has access to a data set: there is not necessarily any notion of "input" and "output". The goal is to teach the computer to autonomously discover underlying patterns in the data set.

For example, if we have a data set containing students' GPAs and SAT scores, we could attempt to train a supervised machine learning model to predict SAT scores given GPAs. Here, GPA would be the input, and SAT score would be the desired output. On the other hand, instead of trying to predict SAT scores based on GPA, we could use both SAT and GPA as input, and see if the computer can discover interesting patterns. In the plots below, supervised learning can easily predict the output variable based on the input variable via a straight line. A good unsupervised learning algorithm could hopefully discover the two clusters in the right plot.

Supervised Learning              |  Unsupervised Learning
:-------------------------------:|:-------------------------------:
![Regression Image][regression]  | ![Clustering Image][clustering]

Unsupervised machine learning will be touched on later, but for now we focus on supervised machine learning: in general it is easier, and the objective is clearer.  Specifically, there are two main types of supervised learning:

1. **Regression** aims to predict a continuous output, given the inputs.
2. **Classification** aims to predict a classification, given the inputs.

The GPA and SAT score example from above is an example of regression, since we are trying to predict the continuous output variable of SAT scores. We aren't trying to classify students based on GPAs, we just want to estimate what their SAT score will be. On the other hand, suppose we also have data about UC Davis college admissions: we could then try to predict whether or not a student will be accepted based on their GPA and SAT combined. This would be an example of classification, since the output of the prediction is not continuous, it is a classification (accepted or rejected). In the example plots below, the left plot shows predicting continuous SAT from GPA, while the right plot shows distinguishing UC Davis rejected applicants (marked with 'x') from UC Davis accepted applicants (marked with 'o'). The plot looks similar to the unsupervised plot from above, but the crucial difference is that we know have data about who was accepted and rejected.

Regression                       |  Classification
:-------------------------------:|:-------------------------------:
![Regression Image][regression]  | ![Classification Image][classification]

In this chapter we look at regression only, and specifically the simplest form: linear regression. We start with the most basic form of linear regression (single variable linear regression), and then move on to consider variants of linear regression. Using these variants we can obtain models that are both fairly simple and powerful.

[regression]: /books/tensorflow/book/ch2-linreg/assets/regression.png
[clustering]: /books/tensorflow/book/ch2-linreg/assets/clustering.png
[classification]: /books/tensorflow/book/ch2-linreg/assets/classification.png

