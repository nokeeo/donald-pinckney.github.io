---
layout: bookpost
title: Python and TensorFlow Installation on macOS
date: 2017-11-21
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch1-setup/mac.md
published: false
---

# macOS Setup

Without a doubt, Python 3 is the future of Python, and thus we will use Python 3 with TensorFlow. While I summarize the instructions to install TensorFlow with Python 3 here, the [official TensorFlow documentation](https://www.tensorflow.org/install/install_mac) should always provide up-to-date and comprehensive instructions for installation as well. If you run into any installation problems, please file a bug [here](https://github.com/donald-pinckney/donald-pinckney.github.io/issues/new?labels=Installation%20problem,TensorFlow).

## Installing Python 3

macOS does not come installed with Python 3 (only Python 2.7), so we need to install it ourselves. The first step is to open terminal (Terminal.app on your Mac), and install the [Homebrew](https://brew.sh) package manager for macOS, if you haven't already installed it before. Just paste the appropriate command into terminal, and follow Homebrew's installation prompts:
```bash
# For bash, ksh, zsh, csh, and other shells:
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# For fish shell:
/usr/bin/ruby -e "(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Now that Homebrew is installed, we need to install Python 3:
```bash
brew install python3
```

You can test that `python3` installed correctly by running the command `python3`. You should see output similar to:
```
~ $ python3
Python 3.6.3 (default, Nov 20 2017, 14:17:35) 
[GCC 4.2.1 Compatible Apple LLVM 9.0.0 (clang-900.0.38)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```
The Python version should be 3.x.y instead of 2.x.y.

## Installing TensorFlow and friends

Installing Python 3 (`python3`) also installs the Python 3 package manager (`pip3`). We can use `pip3` to install a Python utility called `virtualenv`. Virtualenv is an extremely easy and convenient way to install Python packages in a local and contained manner. The recommended way to install TensorFlow is by using `virtualenv`, since this ensures that the installation will be self-contained, and will not affect the rest of your system. So, first we need to install `virtualenv`:
```bash
pip3 install --upgrade virtualenv
```

Now, create a new virtualenv:
```bash
# In this command, ~/tensorflow is the destination directory where the virtualenv will be created. 
# You can choose a different location if you prefer, but the rest of the installation tutorial will assume ~/tensorflow
virtualenv --system-site-packages -p python3 ~/tensorflow
```

Then, we need to activate the virtualenv so we can install things inside it:
```bash
source ~/tensorflow/bin/activate # If using bash, sh, ksh, zsh
source ~/tensorflow/bin/activate.csh # If using csh or tcsh
source ~/tensorflow/bin/activate.fish # If using fish
```

After activating the virtualenv, your command prompt should change to look like: `(tensorflow)$`. At this point, we are finally ready to install TensorFlow:
```bash
pip3 install --upgrade tensorflow 
```

In addition, we also install a few other Python packages that are useful for machine learning:
```bash
pip3 install --upgrade numpy # Used for linear algebra. Essential for using TensorFlow 
pip3 install --upgrade matplotlib # Used for plotting data, which is very useful for machine learning
pip3 install --upgrade pandas # Used for loading data sets
```

Once everything is installed, you can exit the virtualenv using the command `deactivate`.

## Testing the installation

Let's just quickly test the installation, to verify everything is installed and ready to go! If it isn't currently activated, activate your virtualenv with the appropriate activate command from above. Then, run the `python` command, and type the following code into Python:
```python
import tensorflow as tf
import numpy as np
import pandas
import matplotlib.pyplot as plt
hello = tf.constant('Hello, TensorFlow!')
sess = tf.Session()
print(sess.run(hello))
```
If everything is installed correctly, you should see the output:
```
Hello, TensorFlow!
```

If the above test produces errors, please see this list of [common TensorFlow installation problems](https://www.tensorflow.org/install/install_mac#common_installation_problems) or Google it, and file a bug [here](https://github.com/donald-pinckney/donald-pinckney.github.io/issues/new?labels=Installation%20problem,Duplicate&title=Installation%20error%20on%20macOS).

## Optional: Installing an IDE

At this point, everything we need for writing TensorFlow code is installed. We can write our Python code in a text editor of our choice, and run it using `python` from terminal. In the future I won't assume use of an IDE specifically, but rather assume that you can create new Python files and run them, either from terminal or an IDE. However, some people may prefer using an IDE, which can reduce the time spent in Terminal, and help provide better syntax and semantic checking of Python code. Personally, I use and recommend PyCharm, which you can download for free [here](https://www.jetbrains.com/pycharm/download/#section=mac). I won't provide specific installation instructions, but I found it very easy to install and configure to use the `~/tensorflow` virtualenv.
