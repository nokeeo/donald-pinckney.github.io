---
layout: bookpost
title: Nonlinear Regression
date: 2019-07-19
categories: PyTorch
isEditable: true
editPath: books/pytorch/src/ch2-linreg/2019-07-19-nonlinear.md
subscribeName: PyTorch
---

<!-- <script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: { equationNumbers: { autoNumber: "AMS" } }
});
</script> -->

# Nonlinear Regression

In chapters [2.3](/books/pytorch/book/ch2-linreg/2018-03-21-multi-variable.html) and [2.4](/books/pytorch/book/ch2-linreg/2018-11-15-feature-scaling.html) we saw how to adapt linear regression to work with multiple variables, and then used feature scaling to greatly improve the performance of the algorithm. However, we are still pretty limited in what sorts of regressions we can do, as we can only make linear predictions (with multiple variables). While linear regression is a valuable tool to have as a data scientist, many problems are more complex than just a straight line. Let's see how we can extend our framework for linear regression to be able to do various nonlinear regressions, such as polynomials.

## Example Use Case of Nonlinear Regression

In the first chapter [2.1](/books/pytorch/book/ch2-linreg/2017-12-03-single-variable.html) we used single variable linear regression to draw a line of best fit relating homicide deaths in the US to the victim's age, for ages between 20 and 50. However, if we zoom out and consider all the ages, it certainly is *not linear*:

![Homicide Plot][homicide]

Clearly, fitting a straight line to this data set (and many others) would be an incorrect choice. A better idea might be to use a polynomial function to approximate the data. That is, rather than a model of \\(y' = ax + b\\), we could use a model like \\(y' = a_5 x^5 + a_4 x^4 + a_3 x^3 + a_2 x^2 + a_1 x + b \\).

## Theory

If the above mentioned model \\(y' = a_5 x^5 + a_4 x^4 + a_3 x^3 + a_2 x^2 + a_1 x + b \\) looks quite similar to the model used in multiple variable linear regression, you would be correct! Recall the standard multiple variable linear regression model:
\\[
    y'^{(i)} = A x^{(i)} + b
    = \\begin{bmatrix}
            a_1,
            a_2,
            \\cdots,
            a_j,
            \\cdots,
            a_n
    \\end{bmatrix} \\begin{bmatrix}
        x^{(i)}_1 \\\\
        x^{(i)}_2 \\\\
        \\vdots \\\\
        x^{(i)}_j \\\\
        \\vdots \\\\
        x^{(i)}_n
    \\end{bmatrix} + b
    = a_1 x^{(i)}_1 + a_2 x^{(i)}_2 + \\cdots + a_j x^{(i)}_j + \\cdots + a_n x^{(i)}_n + b
\\]

We want to now use essentially the same formula, but instead of having arbitrary different features \\(x_1, \\cdots, x_n\\), we just use \\(x\\), \\(x^2\\), \\(x^3\\) etc. as these features themselves. This is the same thing as remarking that while \\(y' = a_5 x^5 + a_4 x^4 + a_3 x^3 + a_2 x^2 + a_1 x + b \\) is *a polynomial in \\(x\\)*, it is also *linear in \\(x, x^2, x^3, x^4, x^5\\)*.

To more formally define the model, suppose that we have a single input feature \\(x_1^{(i)}\\). Let \\(d\\) be a fixed positive integer constant, known as the **degree** of the polynomial model. Then, we define the model function as the following, where \\(A\\) is a \\(1 \\times d\\) matrix of model parameters to be determined:

\\[
    y'^{(i)} = A
    \\begin{bmatrix}
        x^{(i)} \\\\
        (x^{(i)})^2 \\\\
        \\vdots \\\\
        (x^{(i)})^{d-1} \\\\
        (x^{(i)})^d
    \\end{bmatrix} + b
\\]

Note that \\(d\\) is a **hyperparameter**, as it is a parameter which determines what model will be used (how high the degree of the polynomial is), but it is not actively trained by gradient descent. Instead, a fixed value of \\(d\\) is set by you, before training the model.

> There is also a bit of generalization that is lacking here. If we have multiple input variables \\(x_1^{(i)}, x_2^{(i)}, \\cdots, x_n^{(i)}\\) then when we generate polynomial features up to degree \\(d\\), we would clearly need to generate simple terms of the form \\((x_1^{(i)})^p, (x_2^{(i)})^p, \\cdots\\) for various values of \\(p \\leq d\\), but we would also need to consider mixed terms such as \\(x_1^{(i)}x_2^{(i)}, (x_2^{(i)})^3(x_3^{(i)})^2, x_1^{(i)}x_2^{(i)}x_3^{(i)}, \\cdots\\). However, for this post we will stick to only a single input variable. See below for a challenge problem about this.

## Implementation

Let's try out this new model and see how it works in practice. First, you can download [the homicide rate data set for all age values here][full_data]. We start with loading and plotting the data set:

```python

```

[homicide]: /books/pytorch/book/ch2-linreg/assets/homicide_full.png
[full_data]: /books/pytorch/book/ch2-linreg/code/nonlinear/homicide_full.csv

