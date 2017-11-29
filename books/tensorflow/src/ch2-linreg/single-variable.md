---
layout: bookpost
title: Single Variable Linear Regression
date: 2017-11-21
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch2-linreg/single-variable.md
---

# Single Variable Regression

## Motivation

Single variable linear regression is one of the fundamental tools for any interpretation of data. Using linear regression, we can predict continuous variable outcomes given some data, if the data has a roughly linear shape, i.e. it generally has the shape a line. For example, consider the plot below of 2015 US homicide deaths per age[^fn1], and the line of best fit next to it.

Original data              |  Result of single variable linear regression
:------------------------------:|:-------------------------:
![Homicide Plot][homicide] | ![Homicide Regression Plot][homicide_fit]

Visually, it appears that this data is approximated pretty well by a "line of best fit". Single variable linear regression is precisely the tool to find this line. The line of best fit can then be used to guess how many homicide deaths there would be for ages we don't have data on. By the end of this tutorial you can run linear regression on this homicide data, and in fact solve any single variable regression problem.

## Theory

Since we don't have any theory yet to understand linear regression, first we need to develop the theory necessary to program it.

### Data set format

For regression problems, the goal is to predict a continuous variable output, given some input variables (usually also continuous). For single variable regression, we only have one input variable, called \\(x\\), and our *desired* output \\(y\\). Our data set \\(D\\) then consists of many examples of \\(x\\) and \\(y\\), so:
\\[
    D = \\{ (x_1, y_1), (x_2, y_2), \\cdots, (x_m, y_m) \\}
\\]
where \\(m\\) is the number of examples in the data set. For a concrete example, the homicide data set plotted above looks like:
\\[
    D = \\{ (21, 652), (22, 633), \\cdots, (50, 197) \\}
\\]
We will write code to load data sets from files later.

### Model concept

So, how can we mathematically model single linear regression? Since the goal is to find the perfect line, let's start by defining the **model** (the mathematical description of how predictions will be created) as a line:
\\[
    y'(x, a, b) = ax + b
\\]
where \\(x\\) is an input, \\(a, b\\) are constants, and \\(y'\\) is the prediction for the input \\(x\\). Note that although this is an equation for a line with \\(x\\) as the variable, the values of \\(a\\) and \\(b\\) determine what specific line it is. To find the best line, we just need to find the best values for \\(a\\) (the slope) and \\(b\\) (the y-intercept). For example, the line of best fit for the homicide data above has a slope of about \\(a \\approx -17.69\\) and a y-intercept of \\(b \\approx 1000\\). How we find the magic best values for \\(a\\) and \\(b\\) we don't know yet, but once we find them, prediction is easy, since we just use the formula above.

How then, how do we find the correct values of \\(a\\) and \\(b\\)? First, we need a way to define what the "best line" is exactly. To do so, we define a **loss function** (also called a cost function), which measures how bad a particular choice of \\(a\\) and \\(b\\) are. Values of \\(a\\) and \\(b\\) that seem poor (a line that does not fit the data set) should result in a large value of the loss function, whereas good values of \\(a\\) and \\(b\\) (a line that fits the data set well) should result in small values of the loss function. In other words, the loss function should measure how far the predicted line is from each of the data points, and add this value up for all data points. We can write this as:
\\[
    L(a, b) = \\sum_{i=1}^m (y'(x_i, a, b) - y_i)^2
\\]
Recall that there are \\(m\\) examples in the data set, \\(x_i\\) is the i'th input, and \\(y_i\\) is the i'th desired output. So, \\((y'(x_i, a, b) - y_i)^2\\) measures how far the i'th prediction is from the i'th desired output. For example, if the prediction \\(y'\\) is 7, and the correct output \\(y\\) is 10, then we would get \\((7 - 10)^2 = 9.\\) Note that squaring it is important so that it is always positive.  Finally, we just add up all of these individual losses.

> Note: The choice to square \\(y'(x_i, a, b) - y_i\\) is somewhat arbitrary. Though we need to make it positive, we could achieve this in many ways, such as taking the absolute value. In sense, the choice of models and loss functions is the creative aspect of machine learning, and often a certain loss function is chosen simply because it produces satisfying results. Manipulating the loss function to achieve more satisfying results will be done in section 2.3.

### Optimizing the model

At this point, we have fully defined both our model:
\\[
    y'(x, a, b) = ax + b
\\]
and our loss function, into which we can substitute the model:
\\[
    L(a, b) = \\sum_{i=1}^m (y'(x_i, a, b) - y_i)^2 = \\sum_{i=1}^m (a x_i + b - y_i)^2
\\]
We crafted \\(L(a, b)\\) so that it is smallest exactly when \\(a\\) and \\(b\\) produce the line of best fit. Therefore, our goal is to find the values of \\(a\\) and \\(b\\) that minimize the function \\(L(a, b)\\). But what does \\(L\\) really look like? Well, it is essentially a 3D parabola which looks like:

![Minimum Plot][minimum]

The red dot marked on the plot of \\(L\\) shows where the desired minimum is. We need an algorithm to find this minimum. From calculus, we know that at the minimum \\(L\\) must be entirely flat, that is the derivatives are both \\(0\\):
\\[
    \\frac{\\partial L}{\\partial a} = \\sum_{i=1}^m 2(ax_i + b - y_i)x_i = 0 \\\\
    \\frac{\\partial L}{\\partial b} = \\sum_{i=1}^m 2(ax_i + b - y_i) = 0 \\
\\]
If you need to review this aspect of calculus, I would recommend [Khan Academy videos](https://www.khanacademy.org/math/differential-calculus/analyzing-func-with-calc-dc). Now, for this problem it is possible to solve for \\(a\\) and \\(b\\) using the equations above, like we would in a typical calculus course. But for more advanced machine learning this is impossible, so instead we will learn to use an algorithm called *[gradient descent](https://en.wikipedia.org/wiki/Gradient_descent)* to find the minimum. The idea is intuitive: place a ball at an arbitrary location on the surface of \\(L\\), and it will naturally roll downhill towards the flat valley of \\(L\\) and thus find the minimum. We know the direction of "downhill" at any location since we know the derivatives of \\(L\\): the derivatives are the direction of greatest upward slope, so the opposite (negative) derivatives are the most downhill direction. Therefore, if the ball is currently at location \\((a, b)\\), we can simulate it's motion by moving it to location \\((a', b')\\) like so:
\\[
    a' = a - \\alpha \\frac{\\partial L}{\\partial a} \\\\
    b' = b - \\alpha \\frac{\\partial L}{\\partial b} \\\\
\\]
where \\(\\alpha\\) is a constant called the **learning rate**, which we will talk about more later. If we repeat this process then the ball will continue to roll downhill into the minimum. An animation of this process looks like:

<video autoplay loop muted>
<source type="video/mp4" src="/books/tensorflow/book/ch2-linreg/line_fast.mp4">
</video>

When we run the gradient descent algorithm for long enough, then it will find the optimal location for \\((a, b)\\). Once we have the optimal values of \\(a\\) and \\(b\\), then that's it, we can just use them to predict a rate of homicide deaths given any age, using the model:
\\[
    y'(x) = ax + b
\\]

## Implementation

Let's quickly review what we did when defining the theory of linear regression:

1. Describe the data set
2. Define the model
3. Define the loss function
4. Run the gradient descent optimization algorithm
5. Use the optimal model to make predictions
6. Profit!

When coding this we will follow the exact same steps. So, create a new file `single_var_reg.py` in the text editor or IDE of your choice (or experiment in the Python REPL), and download the [homicide death rate data set][data] into the same directory.

### Importing the data

First, we need to import all the modules we will need:
```python
import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt
```

We use pandas to easily load the CSV homicide data:
```python
D = pd.read_csv("homicide.csv").values
x_data = 
```

[^fn1]: Centers for Disease Control and Prevention, National Center for Health Statistics. Underlying Cause of Death 1999-2015 on CDC WONDER Online Database, released December, 2016. Data are from the Multiple Cause of Death Files, 1999-2015, as compiled from data provided by the 57 vital statistics jurisdictions through the Vital Statistics Cooperative Program. Accessed at http://wonder.cdc.gov/ucd-icd10.html on Nov 22, 2017 2:18:46 PM.

[homicide]: /books/tensorflow/book/ch2-linreg/homicide.png
[homicide_fit]: /books/tensorflow/book/ch2-linreg/homicide_fit.png
[minimum]: /books/tensorflow/book/ch2-linreg/minimum.png
[data]: /books/tensorflow/book/ch2-linreg/homicide.csv
