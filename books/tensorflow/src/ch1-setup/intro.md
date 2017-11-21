---
layout: bookpost
title: Introduction to Machine Learning with TensorFlow
date: 2017-11-21
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch1-setup/intro.md
---

# Introduction

Welcome to *Machine Learning with TensorFlow*, an easy to follow book / blog about understanding machine learning concepts, and their implementation in [Python](https://www.python.org) and [TensorFlow](https://www.tensorflow.org). My goal is to create an intuitive explanation of machine learning methods, paired with practical knowledge of implementation with TensorFlow. This books does assume some small working knowledge of programming, but Python specific syntax will be briefly introduced as needed.  In addition, some mathematics background will be useful, in particular linear algebra and calculus, but is not needed to follow the intuition and implementation. Resources to review relevant math concepts will be provided as required.

## What exactly is machine learning?

Though the exact definition is up for debate, roughly "Machine learning is a field of computer science that gives computers the ability to learn without being explicitly programmed" (Wikipedia). Traditionally, programming has been used to great effect to solve problems which have explicit steps. For example, consider the problem of determining if a number \\(n\\) is prime. We can easily determine if \\(n\\) is prime using fairly simple steps: check if \\(n\\) is divisible by \\(2\\), check if \\(n\\) is divisible by \\(3\\), \\(\cdots\\), check if \\(n\\) is divisible by \\(n-1\\). If \\(n\\) is divisible by any of these, then \\(n\\) is not prime, and otherwise it is prime. With traditional programming we then need to write these specific steps (an **algorithm**) in a programming language that our computer can interpret, and we have a working program which can classify numbers as prime much faster than a human ever could.

However, some tasks seem difficult or impossible to solve using specific steps like above. Rather than classifying prime numbers, let us instead try to classify images of faces as male or female in appearance.

![Female Image][lenna]

Most people would easily identify the image above as female in appearance. But, can you explain *how* you came to this conclusion, in very specific steps? Perhaps, one might say that the hair seems female, but then one would need to explain how to determine that the hair seems female. Black colored pixels do not suffice: plenty of males also have black hair. Maybe, the shape of facial features such as lips are useful for determining female appearance, but it still seems nearly impossible to describe a precise algorithm that uses this data.

Qualitatively, humans do not seem to comprehend the apparent gender of a face by performing some precise algorithm, and this suggests that a computer program to solve this problem should not either. By using machine learning, we can use data to help the computer to learn to recognize a male or female face, without explicitly programming it.

## So, what is TensorFlow, and why do we need it?

Without diving into the details of various machine learning methods, I'll generally state that there *could* be a fairly significant amount of math involved. Not necessarily super difficult math, but some pretty cumbersome math. Roughly, TensorFlow takes care of the calculus grunt work for us: instead of spending a ton of time finding messy derivatives and many lines of code to compute them, TensorFlow lets us focus on the fairly elegant work of defining our machine learning methods, and the more important math necessary to obtain intuition.

So, without further ado, we can get started by installing Python, TensorFlow, and a few other useful tools. Just follow the appropriate directions for your operating system.

[lenna]: /books/tensorflow/book/ch1-setup/lenna.png