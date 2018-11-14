---
layout: bookpost
title: Feature Scaling
date: 2018-06-22
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch2-linreg/feature-scaling.md
---

# Feature Scaling

In chapters [2.1](/books/tensorflow/book/ch2-linreg/2017-12-03-single-variable.html), [2.2](/books/tensorflow/book/ch2-linreg/2017-12-27-optimization.html), [2.3](/books/tensorflow/book/ch2-linreg/2018-03-21-multi-variable.html) we used the gradient descent algorithm (or variants of) to minimize a loss function, and thus achieve a line of best fit. However, it turns out that the optimization in chapter 2.3 was much, much slower than it needed to be. While this isn’t a big problem for these fairly simple linear regression models that we can train in seconds anyways, this inefficiency becomes a much more drastic problem when dealing with large data sets and models.

## Example of the Problem

First, let’s look at a concrete example of the problem, by again considering a synthetic data set. Like in chapter 2.3 I generated a simple [synthetic data set][synthetic-data] consisting of 2 independent variables \\(x_1\\) and \\(x_2\\), and one dependent variable \\(y = 2x_1 + 0.013x_2 + \\varepsilon \\), where \\(\\varepsilon\\) is some random noise. However, note that the range for \\(x_1\\) is 0 to 10, but the range for \\(x_2\\) is 0 to 1000. Let's call this data set \\(D\\). A few sample data points look like this:

| \\(x_1\\) | \\(x_2\\) | \\(y\\)
|-----|---------------------|-|
|7.36|	1000|		34.25|
|9.47|	0|			19.24|
|0.52|	315.78|		3.50|
|1.57|	315.78|		11.02|
|6.31|	263.15|		13.93|
|1.57|	526.31|		10.21|
|0.52|	105.26|		3.41|
|4.21|	842.10|		16.27|
|2.63|	894.73|		19.04|
|3.68|	210.52|		4.60|
| ... | ... | ... |

For simplification I have excluded a constant term from this synthetic data set, and when training models I "cheated" by not training the constant term \\(b\\) and just setting it to 0, so as to simplify visualization. The model that I used was simply:

```python
y_predicted = tf.matmul(A, x) # A is a 1x2 matrix
```

Since this is just a simple application of the ideas from chapter 2.3, one would expect this to work fairly easily. However, when using a `GradientDescentOptimizer`, training goes rather poorly. Here is a plot showing the training progress of `A[0]` and the loss function side-by-side:

![Training progress without scaling][plot1]

This optimization was performed with a learning rate of 0.0000025, which is about the largest before it would diverge. The loss function quickly decreases at first, but then quickly stalls, and decreases quite slowly. Meanwhile, \\(A_0\\) is increasing towards the expected value of approximately 2.0, but very slowly. Within 5000 iterations this model fails to finish training.

Now let's do something rather strange: take the data set \\(D\\), and create a new data set \\(D'\\) by dividing all the \\(x_2\\) values by 100. The resulting data set \\(D'\\) looks roughly like this:

| \\(x_1'\\) | \\(x_2'\\) | \\(y'\\)
|-----|---------------------|-|
|7.36|	10|		34.25|
|9.47|	0|			19.24|
|0.52|	3.1578|		3.50|
|1.57|	3.1578|		11.02|
|6.31|	2.6315|		13.93|
|1.57|	5.2631|		10.21|
|0.52|	1.0526|		3.41|
|4.21|	8.4210|		16.27|
|2.63|	8.9473|		19.04|
|3.68|	2.1052|		4.60|
| ... | ... | ... |

A crucial note is that while \\(D'\\) is technically different from \\(D\\), it contains exactly the same information: one can convert between them freely, by dividing or multiplying the second column by 100. In fact, since this transformation is linear, and we are using a linear model, we can train our model on \\(D'\\) instead. We would just expect to obtain a value of 1.3 for `A[1]` rather than 0.013. So let's give it a try!

The first interesting observation is that we can use a much larger learning rate. The largest learning rate we could use with \\(D\\) was 0.0000025, but with \\(D'\\) we can use a learning rate of 0.01. And when we plot `A[0]` and the loss function for both \\(D\\) and \\(D'\\) we see something pretty crazy:

![Training progress with scaling][plot2]

While training on \\(D\\) wasn't even close to done after 5000 iterations, training on \\(D'\\) seems to have completed nearly instantly. If we zoom in on the first 60 iterations, we can see the training more clearly:

![Training progress with scaling zoom][plot3]

So this incredibly simple data set transformation has changed a problem that was untrainable within 5000 iterations to one that can be trained practically instantly with 50 iterations. What is this black magic, and how does it work?

## Visualizing Gradient Descent with Level Sets

One of the best ways to gain insight in machine learning is by visualization. As seen in chapter 2.1 we can visualize loss functions using plots. Since we have 2 parameters `A[0]` and `A[1]` of the loss function, it would be a 3D plot. We used this for visualization in chapter 2.1, but frankly it's a bit messy looking. Instead, we will use [level sets][level_sets] (also called contour plots), which use lines to indicate where the loss function has a constant value. An example is easiest, so here is the contour plot for the loss function for \\(D'\\), the one that converges quickly:

![Contour plot of D'][contour2]

Each ellipse border is where the loss function has a particular constant value (the innermost ones are labeled), and the red X marks the spot of the optimal values of `A[0]` and `A[1]`. By convention the particular constant values of the loss function are evenly spaced, which means that contour lines that are closer together indicate a "steeper" slope. In this plot, the center near the X is quite shallow, while far away is pretty steep. In addition, one diagonal axis of the ellipses is steeper than the other diagonal axis.

We can also plot how `A[0]` and `A[1]` evolve during training on the contour plot, to get a feel for how gradient descent is working:

![Contour plot of D' with training][contour2_dots]

Here, we can see that the initial values for `A[0]` and `A[1]` start pretty far off, but gradient descent quickly zeros in towards the X. As a side note, the line connecting each pair of dots is perpendicular to the line of the level set: see if you can figure out why.

So if that is what the contour plot looks like for the "good" case of \\(D'\\), how does it look for \\(D\\)? Well, it looks rather strange:

![Contour plot of D][contour1]

Don't be fooled: like the previous plot the level sets also form ellipses, but they are so stretched that they are nearly straight lines at this scale. This means that vertically (`A[0]` is constant and we vary `A[1]`) there is substantial gradient, but horizontally (`A[1]` is constant and we vary `A[0]`) there is practically no slope. Put another way, gradient descent only knows to vary `A[1]`, and (almost) doesn't vary `A[0]`.  We can test this hypothesis by plotting how gradient descent updates `A[0]` and `A[1]`, like above. Since gradient descent makes such little progress though, we have to zoom in a lot to see what is going on:

![Contour plot of D][contour1_dots]

We can clearly see that gradient descent applies large updates to `A[1]` (a bit too large, a smaller learning rate would have been a bit better) due to the large gradient in the `A[1]` direction. But due to the (comparatively) tiny gradient in the `A[0]` direction very small updates are done to `A[0]`. Gradient descent quickly converges on the optimal value of `A[1]`, but is very very far away from finding the optimal value of `A[0]`.

Let's take a quick look at what is going on mathematically to see why this happens. The model we are using is:
\\[
    y'(x, A) = Ax = a_1 x_1 + a_2 x_2 
\\]
Here, \\(a_1\\) is in the role of `A[0]` and \\(a_2\\) is `A[1]`. We substitute this into the loss function to get:
\\[
    L(a_1, a_2) = \\sum_{i=1}^m (a_1 x_1^{(i)} + a_2 x_2^{(i)} - y^{(i)})^2
\\]
Now if we differentiate \\(L\\) in the direction of \\(a_1\\) and \\(a_2\\) separately, we get:
\\[
    \\frac{\\partial L}{\\partial a_1} = \\sum_{i=1}^m 2(a_1 x_1^{(i)} + a_2 x_2^{(i)} - y^{(i)})x_1^{(i)} \\\\
    \\frac{\\partial L}{\\partial a_2} = \\sum_{i=1}^m 2(a_1 x_1^{(i)} + a_2 x_2^{(i)} - y^{(i)})x_2^{(i)}
\\]
Here we can see the problem: the inner terms of the derivatives are the same, except one is multiplied by \\(x_1^{(i)}\\) and the other by \\(x_2^{(i)}\\). If \\(x_2\\) is on average 100 times bigger than \\(x_1\\) (which it is in the original data set), then we would expect \\(\\frac{\\partial L}{\\partial a_2}\\) to be roughly 100 times bigger than \\(\\frac{\\partial L}{\\partial a_1}\\). It isn't exactly 100 times larger, but with any reasonable data set it should be close. Since the derivatives in the directions of \\(a_1\\) and \\(a_2\\) are scaled completely differently, gradient descent fails to update both of them adequately.

The solution is simple: we need to rescale the input features before training. This is exactly what happened when we mysteriously divided by 100: we rescaled \\(x_2\\) to be comparable to \\(x_1\\). But we should work out a more methodical way of rescaling, rather than randomly dividing by 100.

## Rescaling Features

This wasn't explored above, but there are really two ways that we potentially need to rescale features. Consider an example where \\(x_1\\) ranges between -1 and 1, but \\x_2\\) ranges between 99 and 101: both of these features have (at least approximately) the same [standard deviation][std_wiki], but \\(x_2\\) has a much larger [mean][mean_wiki]. On the other hand, consider an example where \\(x_1\\) still ranges between -1 and 1, but \\(x_2\\) ranges between -100 and 100. This time, they have the same mean, but \\(x_2\\) has a much larger standard deviation. Both of these situations can make gradient descent and related algorithms slower and less reliable. So, our goal is to ensure that all features have the same mean and standard deviation.

> **Note:** There are other methods to measure how different features are, and then subsequently rescale them. For a look at more of them, feel free to consult the [Wikipedia article][scaling_wiki]. However, after implementing the technique presented here, any other technique is fairly similar and easy to implement if needed.

Wihtout digressing too far into statistics, let's quickly review how to calculate the mean \\(\\mu\\) and standard deviation \\(\\sigma\\). Suppose we have already read in our data set in Python into a Numpy vector / matrix, and have all the values for the feature \\(x_j\\), for each \\(j\\). Mathematically, the mean for feature \\(x_j\\) is just the average:
\\[
    \\mu_j = \\frac{\\sum_{i=1}^m x_j^{(i)}}{m}
\\]
In Numpy there is a convenient `np.mean()` function we will use.

The standard deviation \\(\\sigma\\) is a bit more tricky. We measure how far each point \\(x_j^{(i)}\\) is from the mean \\(\\mu_j\\), square this, then take the mean of all of this, and finally square root it:
\\[
    \\sigma_j = \\sqrt{\\frac{\\sum_{i=1}^m (x_j^{(i)} - \\mu_j)^2 }{m}}
\\]
Again, Numpy provides a convenient `np.std()` function.

> **Note:** Statistics nerds might point out that in the above equation we should divide by \\(m - 1\\) instead of \\(m\\) to obtain an unbiased estimate of the standard deviation. This might well be true, but in this usage it does not matter since we are only using this to rescale features relative to each other, and not make a rigorous statistical inference. To be more precise, doing so would involve multiplying each scaled feature by only a constant factor, and will not change any of their standard deviations or means relative to each other.

Once we have every mean \\(\\mu_j\\) and standard devation \\(\\sigma_j\\), rescaling is easy: we simply rescale every feature like so:

\\[
    x_j' = \\frac{x_j - \\mu_j}{\\sigma_j}
\\]

This will force every feature to have a mean of 0 and a standard deviation of 1, and thus be scaled well relative to each other.

> **Note:** Be careful to make sure to perform the rescaling at both training time and prediction time. That is, we first have to perform the rescaling on the whole training data set, and then train the model so as to achieve good training performance. Once the model is trained and we have a new, never before seen input \\(x\\), we also need to rescale its features to \\(x'\\) because the trained model only understands inputs that have already been rescaled (because we trained it that way).

## Implementation and Experiments

# Concluding Remarks


# Exercises



# Complete Code

The [complete example code is available on GitHub](https://github.com/donald-pinckney/donald-pinckney.github.io/blob/src/books/tensorflow/src/ch2-linreg/code/feature_scaling.py), as well as directly here:

```python

``` 

# References

[synthetic-data]: /books/tensorflow/book/ch2-linreg/code/linreg-scaling-synthetic.csv
[plot1]: /books/tensorflow/book/ch2-linreg/assets/scaling_plot1.png
[plot2]: /books/tensorflow/book/ch2-linreg/assets/scaling_plot2.png
[plot3]: /books/tensorflow/book/ch2-linreg/assets/scaling_plot3.png
[contour1]: /books/tensorflow/book/ch2-linreg/assets/contour1.png
[contour2]: /books/tensorflow/book/ch2-linreg/assets/contour2.png
[contour1_dots]: /books/tensorflow/book/ch2-linreg/assets/contour1_dots.png
[contour2_dots]: /books/tensorflow/book/ch2-linreg/assets/contour2_dots.png
[level_sets]: https://en.wikipedia.org/wiki/Level_set
[mean_wiki]: https://en.wikipedia.org/wiki/Expected_value
[std_wiki]: https://en.wikipedia.org/wiki/Standard_deviation
[scaling_wiki]: https://en.wikipedia.org/wiki/Feature_scaling
