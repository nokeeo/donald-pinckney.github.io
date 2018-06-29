---
layout: bookpost
title: Feature Scaling
date: 2018-06-22
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch2-linreg/feature-scaling.md
---

# Feature Scaling

In chapters [2.1](/books/tensorflow/book/ch2-linreg/2017-12-03-single-variable.html), [2.2](/books/tensorflow/book/ch2-linreg/2017-12-27-optimization.html), [2.3](/books/tensorflow/book/ch2-linreg/2018-03-21-multi-variable.html) we used the gradient descent algorithm (or variants of) to minimize a loss function, and thus achieve a line of best fit. However, it turns out that the optimization was much, much slower than it needed to be. While this isn’t big problem for these fairly simple linear regression models that we can train in seconds anyways, this inefficiency becomes a much more drastic problem when dealing with large datasets and models.

## Example of the Problem
First, let’s look at a concrete example of the problem. In chapter [2.1](/books/tensorflow/book/ch2-linreg/2017-12-03-single-variable.html) we used the 2015 US homicide deaths per age, and found the line of best fit. As a reminder, the data set looks like:
| age | num_homicide_deaths | 
|-----|---------------------| 
| 21  | 652                 | 
| 22  | 633                 | 
| 23  | 653                 | 
| 24  | 644                 | 
| 25  | 610                 | 
| 26  | 565                 | 
| 27  | 486                 | 
| 28  | 529                 | 
| 29  | 482                 |
| ... | ... |
And the learned line of best fit is approximately \\(y' = -17.2711x + 997.285\\). 

## Visualizing Gradient Descent with Level Sets

## Theory of Condition Numbers

## How to Fix Poor Conditioning

## Implementation and Experiments

# Concluding Remarks


# Exercises



# Complete Code

The [complete example code is available on GitHub](https://github.com/donald-pinckney/donald-pinckney.github.io/blob/src/books/tensorflow/src/ch2-linreg/code/feature_scaling.py), as well as directly here:

```python

``` 

# References
