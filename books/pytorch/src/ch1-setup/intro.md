---
layout: bookpost
title: Introduction to Machine Learning with PyTorch
date: 2017-11-21
categories: PyTorch
isEditable: true
editPath: books/pytorch/src/ch1-setup/intro.md
subscribeName: PyTorch
---

# Introduction

Welcome to *Machine Learning with PyTorch*, an easy to follow guide / blog about understanding machine learning concepts and their implementation in [Python](https://www.python.org) and [PyTorch](https://pytorch.org). My goal is to create an intuitive explanation of machine learning methods, paired with practical knowledge of implementation. This guide does assume some small working knowledge of programming, but Python specific syntax will be briefly introduced as needed.  In addition, some mathematics background will be useful, in particular linear algebra and calculus, but is not needed to follow the intuition and implementation. Resources to review relevant math concepts will be provided as required. Finally, this guide is [open source on GitHub](https://github.com/donald-pinckney/donald-pinckney.github.io/tree/src/books/pytorch/src), and I would be happy to consider edits, both tiny and large. Feel free to open pull requests with changes to improve this guide!

## What exactly is machine learning?

Though the exact definition of machine learning is up for debate, we can roughly define machine learning as "a field of computer science that gives computers the ability to learn without being explicitly programmed" (Wikipedia). Traditionally, programming has been used to great effect to solve problems which have explicit steps. For example, consider the problem of determining if a number \\(n\\) is prime. We can easily determine if \\(n\\) is prime using fairly simple steps: check if \\(n\\) is divisible by \\(2\\), check if \\(n\\) is divisible by \\(3\\), \\(\cdots\\), check if \\(n\\) is divisible by \\(n-1\\). If \\(n\\) is divisible by any of these, then \\(n\\) is not prime, and otherwise it is prime. With traditional programming we then need to write these specific steps (an **algorithm**) in a programming language that our computer can interpret, and we have a working program which can classify numbers as prime much faster than a human ever could.

However, some tasks seem difficult or impossible to solve using specific steps like above. Rather than classifying prime numbers, let us instead try to classify images of dogs as either a Golden Retriever or Poodle.

Golden Retriever                |  Poodle
:------------------------------:|:-------------------------:
![Golden Retriever Image][gold] | ![Poodle Image][poodle]

Most people would easily be able to differentiate the two breeds above, and accurately dogs of those breeds. But, can you explain *how* you came to this conclusion, in very specific steps? Perhaps, one might say that the hair of the Golden Retriever seems less curly, but then one would need to explain how to determine that the hair is less curly. There does not seem to exist a natural way to describe the curliness of hair in specific steps. Maybe, the shape of facial features such as nose shape are useful for determining dog breed, but it still seems nearly impossible to describe a precise algorithm that uses this data.

Qualitatively, humans do not seem to comprehend the breed of a dog by performing some precise algorithm, and this suggests that a computer program to solve this problem should not either. By using machine learning, we can use data to help the computer learn to recognize a dog breed, objects in general, human speech, etc., without explicitly programming it.

## So what can machine learning accomplish?

Lots! Machine learning is finding applications nearly everywhere, and it's still growing. Machine learning is full of constantly evolving research with new and exciting results, such as:

1. Image Synthesis with Semantic Manipulation of Images: <iframe width="340" height="315" src="https://www.youtube-nocookie.com/embed/3AIpPlzM_qs?rel=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
2. [Natural Language Translation](https://research.googleblog.com/2016/09/a-neural-network-for-machine.html)
3. [Magically Enhancing Image Resolution](https://blog.deepsense.ai/using-deep-learning-for-single-image-super-resolution/)

For more, there is no shortage of inspiration and useful information on [Reddit](https://www.reddit.com/r/MachineLearning/).

## So, what is PyTorch, and why do we need it?

Without diving into the details of various machine learning methods, I'll generally state that there *could* be a fairly significant amount of math involved. Not necessarily super difficult math, but some pretty cumbersome math. Roughly, PyTorch takes care of the calculus grunt work for us: instead of spending a ton of time finding messy derivatives and many lines of code to compute them, PyTorch lets us focus on the fairly elegant work of defining our machine learning methods, and the more important math necessary to obtain intuition.

So, without further ado, we can get started by installing Python, PyTorch, and a few other useful tools. Just follow the appropriate directions for your operating system.

[gold]: /books/pytorch/book/ch1-setup/assets/gold.jpg
[poodle]: /books/pytorch/book/ch1-setup/assets/poodle.jpg
