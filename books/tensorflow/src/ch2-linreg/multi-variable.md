---
layout: bookpost
title: Multi Variable Linear Regression
date: 2018-02-25
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch2-linreg/2017-02-25-multi-variable.md
---

# Multi Variable Regression

In the [first chapter](/books/tensorflow/book/ch2-linreg/2017-12-03-single-variable.html) we learned the basics of TensorFlow by creating a single variable linear regression model. In this chapter we expand this model to handle multiple variables. Note that less time will be spent explaining the basics of TensorFlow: only new concepts will be explained, so feel free to refer to previous chapters as needed.

## Motivation

Recall that a single variable linear regression model can learn to predict an output variable \\(y\\) under these conditions:
1. There is only one input variable, \\(x\\)
2. There is a linear relationship between \\(y\\) and \\(x\\), that is, \\(y \\approx ax + b\\)

In practice, the above conditions are very limiting: if you have a simple data set then by all means you should try using single variable linear regression, but in most cases we have significantly more complex data. For example, in the following data we have 2 input variables:

#### ------ FIND DATA SET HERE ------

One approach to handling multiple variables would be to reduce the number of input variables to only 1 variable, and then training a single variable linear regression model using that. In fact, an important area of research in machine learning (and one that will be covered later) called **[dimensionality reduction](https://en.wikipedia.org/wiki/dimensionality_reduction)** deals with this problem of reducing the number of variables. However, it's important to realize that the number of variables can only be reduced so far, and its extremely rare that you can reduce a data set to only 1 variable. For now you need to take this statement on faith, but in later chapters we will investigate it more thoroughly.

So, it seems that we will have to deal with training models that can handle multiple variables. In this chapter we learn how to allow multiple input variables in our linear regression model. Such a model is called multi variable linear regression, or just linear regression.

## Theory

Most of the theory is similar to the theory for single variable linear regression, but we will need to augment and generalize it to handle multiple variables.

### Data set format

Previously we defined our data set \\(D\\) as consisting of many example pairs of \\(x\\) and \\(y\\), where \\(m\\) is the number of examples:
\\[
    D = \\{ (x^{(1)}, y^{(1)}), (x^{(2)}, y^{(2)}), \\cdots, (x^{(m)}, y^{(m))} \\}
\\]

Note that I have changed the notation compared to before. The notation \\(x^{(i)}\\) refers to the \\(i\\)'th \\(x\\) training example, it does *NOT* mean \\(x\\) to the \\(i\\)'th power, which would be written as \\(x^i\\). I promise the notation change will be useful shortly.

Alternatively, we can write \\(D\\) as 2 vectors of shape 1 x \\(m\\):
\\[
    D_x = \\begin{bmatrix}
            x^{(1)}, 
            x^{(2)}, 
            \\dots, 
            x^{(m)}
    \\end{bmatrix} \\\\
    D_y = \\begin{bmatrix}
            y^{(1)},
            y^{(2)},
            \\dots,
            y^{(m)}
         \\end{bmatrix}
\\]

But now, we need each \\(x^{(i)}\\) example to contain multiple numbers, one for each input variable.  Let \\(n\\) be the number of input variables. Then the easiest way to write this is to let each \\(x^{(i)}\\) be a vector of shape \\(n\\) x 1. That is,
\\[
    x^{(i)} = \\begin{bmatrix}
        x^{(i)}_1 \\\\ 
        x^{(i)}_2 \\\\
        \\vdots \\\\
        x^{(i)}_j \\\\
        \\vdots \\\\
        x^{(i)}_n
    \\end{bmatrix}
\\]
Note that the notation \\(x^{(i)}_j\\) denotes the \\(j\\)'th input variable in the \\(i\\)'th example data.

Since each \\(x^{(i)}\\) has \\(n\\) rows, and \\(D_x\\) has \\(m\\) columns, each of which is an \\(x^{(i)}\\), we can write \\(D_x\\) as a massive \\(n \\times m\\) matrix:
\\[
    D_x = \\begin{bmatrix}
            x^{(1)}, 
            x^{(2)}, 
            \\dots, 
            x^{(m)} \\end{bmatrix}
        = \\begin{bmatrix}
            x^{(1)}_1 & x^{(2)}_1  & \\dots & x^{(i)}_1 & \\dots & x^{(m)}_1 \\\\
            x^{(1)}_2 & x^{(2)}_2  & \\dots & x^{(i)}_2 & \\dots & x^{(m)}_2 \\\\
            \\vdots & \\vdots  & \\ddots & \\vdots & \\ddots & \\vdots \\\\
            x^{(1)}_j & x^{(2)}_j  & \\dots & x^{(i)}_j & \\dots & x^{(m)}_j \\\\
            \\vdots & \\vdots  & \\ddots & \\vdots & \\ddots & \\vdots \\\\
            x^{(1)}_n & x^{(2)}_n  & \\dots & x^{(i)}_n & \\dots & x^{(m)}_n \\\\
        \\end{bmatrix}
\\]
So, each column of \\(D_x\\) represents a single input data example. We don't need to change the 1 x \\(m\\) vector \\(D_y\\), since we still only have 1 output variable.

### Model concept

So, we now have an input data matrix \\(D_x\\) with each column vector representing a single input data example, and we have the corresponding \\(D_y\\) row vector, each entry of which is an output data example. How do we define a model which can linearly estimate the output \\(y'^{(i)}\\) given the input data vector \\(x^{(i)}\\)? Let's build it up from simple concepts, and build towards more complex linear algebra.

Since we want \\(y'^{(i)}\\) to depend linearly on each \\(x^{(i)}_j\\) for \\(1 \\leq j \\leq n\\), we can write:
\\[
    y'^{(i)} = a_1 x^{(i)}_1 + a_2 x^{(i)}_2 + \\cdots + a_j x^{(i)}_j + \\cdots + a_n x^{(i)}_n + b
\\]

This is fine mathematically, but it's not very general. Suppose \\(n = 100\\): then we would have to literally write out 100 terms in our TensorFlow code. We can generalize this using linear algebra. Let \\(A\\) be a row vector of shape 1 x \\(n\\), containing each \\(a_j\\):
\\[
    A = \\begin{bmatrix}
            a_1, 
            a_2, 
            \\cdots, 
            a_j,
            \\cdots,
            a_n
    \\end{bmatrix}
\\]

Now, let's see what happens if we compute \\(A x^{(i)}\\), as matrix multiplication. Note that \\(A\\) has shape 1 x \\(n\\) and \\(x^{(i)}\\) has shape \\(n\\) x 1. This is perfect! When performing matrix multiplication, the inner dimensions (in this case \\(n\\) and \\(n\\)) have to match, and the outer dimensions (in this case \\(1\\) and \\(1\\)) determine the output shape of the multiplication. So \\(A x^{(i)}\\) will have shape 1 x 1, or in other words, just a single number, in fact it is exactly \\(y'^{(i)}\\). How does this matrix multiplication exactly work? I'll refer you to [this video by Khan Academy](https://www.khanacademy.org/math/precalculus/precalc-matrices/multiplying-matrices-by-matrices/v/matrix-multiplication-intro), and explain it briefly in this case. Here, it is easier since \\(A\\) is a row vector, and \\(x^{(i)}\\) is a column vector. We simply multiply each corresponding entry, and add it all up:
\\[
    A x^{(i)} + b
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
    = y'^{(i)}
\\]

This matrix equation, \\(y'(x, A, b) = Ax + b\\) is exactly what we want as our model. As one final note, recall that in the actual implementation, we don't want \\(x\\) and \\(y'\\) to represent just one input data / predicted output, we want them to represent several. Since \\(x\\) is a column vector, the natural way to represent multiple input data points is with a matrix, very similar to the matrix \\(D_x\\), just not necessarily with *all* the columns of \\(D_x\\), and \\(y'\\) should be a row vector. Specifically, \\(A\\) has shape 1 x \\(n\\), \\(x\\) has shape \\(n\\) x `None`, and \\(y\\) has shape 1 x `None`, using the TensorFlow convention that `None` represents a yet-to-be-determined matrix size.

Now defining the loss function is pretty much the same as before, just using the new model:
\\[
     L(A, b) = \\sum_{i=1}^m (y'(x^{(i)}, A, b) - y^{(i)})^2 = \\sum_{i=1}^m (A x^{(i)} + b - y^{(i)})^2
\\]

To minimize the loss function, we use the same process as before, gradient descent. However, previously the gradient descent was altering 2 variables (\\(a\\) and \\(b\\)) so as to minimize the loss function, and so we could plot the loss function and gradient descent progress in terms of \\(a\\) and \\(b\\). However, now the optimization needs to alter many more variables, since \\(A\\) actually contains \\(n\\) variables, the gradient descent must be performed in \\(n+1\\) dimensional space, and we don't have an easy way to visualize this.

With the more general linear algebra formulation of linear regression under our belts, let's move on to actually coding stuff!

## Implementation
