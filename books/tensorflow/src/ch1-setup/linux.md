---
layout: bookpost
title: Python and TensorFlow Installation on Linux
date: 2017-11-21
categories: TensorFlow
isEditable: true
editPath: books/tensorflow/src/ch1-setup/linux.md
published: false
---

# Linux (Ubuntu) Setup
Without a doubt, Python 3 is the future of Python, and thus we will use Python 3 with TensorFlow. While I summarize the instructions to install TensorFlow with Python 3 here, the [official TensorFlow documentation](https://www.tensorflow.org/install/install_linux) should always provide up-to-date and comprehensive instructions for installation as well. If you run into any installation problems, please file a bug [here](https://github.com/donald-pinckney/donald-pinckney.github.io/issues/new?labels=Installation%20problem,TensorFlow). Note that Ubuntu is the only officially supported Linux distribution for TensorFlow, but with a bit of effort TensorFlow can likely be installed on other distributions as well.

## Optional: Install GPU Support
On Linux TensorFlow has the ability to run your machine learning models on a GPU, which can make computation significantly faster. However, the speed difference is negligible until we start building extremely large models with massive amounts of data. So if you have a supported GPU, you could choose to install GPU support now, or just wait until later. To see if your GPU is supported and instructions for installing GPU support, see [here](https://www.tensorflow.org/install/install_linux#nvidia_requirements_to_run_tensorflow_with_gpu_support).

## Installing Pip and Virtualenv
First, we need to install `pip`, and `virtualenv`. This should be easy using `apt-get`:
```bash
sudo apt-get install python3-pip python3-dev python-virtualenv
```

## Installing TensorFlow and friends
Now that we
Virtualenv is an extremely easy and convenient way to install Python packages in a local and contained manner. The recommended way to install TensorFlow is by using `virtualenv`, since this ensures that the installation will be self-contained, and will not affect the rest of your system. Now, we need to create a new virtualenv:
```bash
# In this command, ~/tensorflow is the destination directory where the virtualenv will be created. 
# You can choose a different location if you prefer, but the rest of the installation tutorial will assume ~/tensorflow
virtualenv --system-site-packages -p python3 ~/tensorflow
```

Then, we need to *activate* the virtualenv so we can install things inside it:
```bash
source ~/tensorflow/bin/activate # If using bash, sh, ksh, zsh
source ~/tensorflow/bin/activate.csh # If using csh or tcsh
source ~/tensorflow/bin/activate.fish # If using fish
```

After activating the virtualenv, your command prompt should change to look like: `(tensorflow)$`. At this point, we are finally ready to install TensorFlow:
```bash
pip3 install --upgrade tensorflow # If installing WITHOUT GPU support
pip3 install --upgrade tensorflow-gpu # If installing WITH GPU support
```

In addition, we also install a few other Python packages that are useful for machine learning:
```bash
pip3 install --upgrade numpy # Used for linear algebra. Essential for using TensorFlow 
pip3 install --upgrade matplotlib # Used for plotting data, which is very useful for machine learning
pip3 install --upgrade pandas # Used for loading datasets
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

If the above test produces errors, please see this list of [common TensorFlow installation problems](https://www.tensorflow.org/install/install_linux#common_installation_problems) or Google it, and file a bug [here](https://github.com/donald-pinckney/donald-pinckney.github.io/issues/new?labels=Installation%20problem,Duplicate&title=Installation%20error%20on%20Linux).

## Optional: Installing an IDE
At this point, everything we need for writing TensorFlow code is installed. We can write our Python code in a text editor of our choice, and run it using `python` from terminal. In the future I won't assume use of an IDE specifically, but rather assume that you can create new Python files and run them, either from terminal or an IDE. However, some people may prefer using an IDE, which can reduce the time spent in terminal, and help provide better syntax and semantic checking of Python code. Personally, I use and recommend PyCharm, which you can download for free [here](https://www.jetbrains.com/pycharm/download/#section=linux). I won't provide specific installation instructions, but I found it very easy to install and configure to use the `~/tensorflow` virtualenv.
