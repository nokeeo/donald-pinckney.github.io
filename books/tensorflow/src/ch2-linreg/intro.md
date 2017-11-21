---
layout: bookpost
title: Linear Regression
date: 2017-11-21
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch2-linreg/intro.md
published: false
---

# Linear Regression

Roughly, there are two categories of machine learning:
1. In **supervised learning** one already has access to a data set of example inputs and desired outputs, and teaches the computer to produce the desired outputs given the example inputs.
2. In **unsupervised learning** one only has access to a data set: there is not necessarily any notion of "input" and "output". The goal is to teach the computer to autonomously discover underlying patterns in the data set.

For example, if we have a data set containing students' GPAs and SAT scores, we could attempt to train a supervised machine learning model to predict SAT scores given GPAs. Here, GPA would be the input, and SAT score would be the desired output. On the other hand, if we only have access to students' GPAs, then we could try to use unsupervised machine learning models to find patterns in the GPAs: perhaps there exist "clusters" in the data of similarly performing students.

Unsupervised machine learning will be touched on later, but for now we focus on supervised machine learning: in general it is easier, and the objective is clearer.  Specifically, there are two main types of supervised learning:
1. **Regression** aims to predict a continuous output, given the inputs.
2. **Classification** aims to predict a classification, given the inputs.

The GPA and SAT score example from above is an example of regression, since we are trying to predict the continuous output variable of SAT scores. We aren't trying to classify students based on GPAs, we just want to estimate what their SAT score will be. On the other hand, suppose we also have data about UC Davis college admissions: we could then try to predict whether or not a student will be accepted based on their GPA. This would be an example of classification, since the output of the prediction is not continuous, it is a classification (accepted or rejected).

In this chapter we look at regression only, and specifically the simplest form: linear regression. We start with the most basic form of linear regression (single variable linear regression), and then move on to consider variants of linear regression. Using these variants we can obtain models that are both fairly simple and powerful.
