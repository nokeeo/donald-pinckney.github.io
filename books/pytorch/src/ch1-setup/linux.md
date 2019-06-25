---
layout: bookpost
title: Python and PyTorch Installation on Linux
date: 2017-11-21
categories: PyTorch
isEditable: true
editPath: books/pytorch/src/ch1-setup/linux.md
published: false
---

# Linux (Ubuntu) Setup

Without a doubt, Python 3 is the future of Python, and thus we will use Python 3 with PyTorch. While I summarize the instructions to install PyTorch with Python 3 here, the [official PyTorch documentation](https://pytorch.org/get-started/locally/) should always provide up-to-date and comprehensive instructions for installation as well.

## Make sure Python 3 is installed

First, we need to make sure that Python 3 is installed. Your system might already have it installed. First, you can see if the `python` command is Python 3:

```bash
python --version
```

If the above is Python 3.x, then you can continue to the next section. Otherwise, you can see if `python3` works:

```bash
python3 --version
```

If this still doesn't work, then you need to follow your Linux distribution's method for installing Python 3. On Ubuntu this would be

```bash
sudo apt-get install python3-pip python3-dev
```

In the future, make sure you run the appropriate Python command for Python 3 (either `python` or `python3`), depending on your system.

## Installing PyTorch and friends

First, we install `numpy` (used for linear algebra computations), `matplotlib` (useful for plotting) and `pandas` (useful for loading data sets):

```bash
pip3 install --upgrade numpy
pip3 install --upgrade matplotlib
pip3 install --upgrade pandas
```

Finally we can install PyTorch:

```bash
pip3 install --upgrade torch torchvision
```

## Testing the installation

Let's just quickly test the installation, to verify everything is installed and ready to go! Run the `python` (or `python3` command), and type the following code into Python:

```python
import numpy as np
import pandas
import matplotlib.pyplot as plt
import torch
x = torch.rand(5, 3)
print(x)
```

If everything is installed correctly, you should see the output similar to:

```
tensor([[0.3380, 0.3845, 0.3217],
        [0.8337, 0.9050, 0.2650],
        [0.2979, 0.7141, 0.9069],
        [0.1449, 0.1132, 0.1375],
        [0.4675, 0.3947, 0.1426]])
```

If the above test produces errors, please carefully go through the [official PyTorch installation guide](https://pytorch.org/get-started/locally/) to try to troubleshoot your problems.

## Optional: Installing an IDE

At this point, everything we need for writing PyTorch code is installed. We can write our Python code in a text editor of our choice, and run it using `python` from terminal. In the future I won't assume use of an IDE specifically, but rather assume that you can create new Python files and run them, either from terminal or an IDE. However, some people may prefer using an IDE, which can reduce the time spent in terminal, and help provide better syntax and semantic checking of Python code. Personally, I use and recommend PyCharm, which you can download for free [here](https://www.jetbrains.com/pycharm/download/#section=linux). I won't provide specific installation instructions, but I found it very easy to install and configure.
