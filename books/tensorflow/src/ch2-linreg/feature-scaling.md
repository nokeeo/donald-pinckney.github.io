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

And the learned line of best fit is approximately \\(y' = -17.2711x + 997.285\\). We are interested in how long it takes to train this model, that is, how long it takes gradient descent to converge. For a ballpark estimate, let's consider the model "converged" when the loss value achieves 4 digits of precision (the highest 4 digits match the final value). This is a very naive way to consider a model converged, but the point is just to have a consistent comparison across models, which this provides. Using this metric, the code from chapter 2.1 which used the `tf.train.AdamOptimizer` gradient descent variant achieved convergence at around \\(t = 9069\\) as evidenced by the log output:

```text
...
t = 9068, loss = 39300, a = -17.2324, b = 995.831
t = 9069, loss = 39299.9, a = -17.2326, b = 995.835
t = 9070, loss = 39299.9, a = -17.2327, b = 995.84
...
```

In chapter 2.2 we also experimented with other gradient descent variants. We tried using vanilla gradient descent via `tf.train.GradientDescentOptimizer`, and could not get the problem to converge within \\(t \\leq 20000\\). Finally, we tried `tf.train.AdagradOptimizer` which gave us an improvement to convergence time to \\(t = 4199\\).

However, something strange happens if we massage our data set in a peculiar way. If we (arbitrarily) divide the `num_homicide_deaths` by 30 so it looks like this:

| age | num_homicide_deaths |
|-----|---------------------|
| 21  | 652 / 30 = 21.7333  |
| 22  | 633 / 30 = 21.1     |
| 23  | 653 / 30 = 21.7667  |
| ... | ... |

and then train the model, we find convergence using `tf.train.AdamOptimizer` in 602 iterations, 

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
