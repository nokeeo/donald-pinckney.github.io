---
layout: bookpost
title: Exploring Optimization Convergence
date: 2017-12-27
categories: PyTorch
isEditable: true
editPath: books/pytorch/src/ch2-linreg/2017-12-27-optimization.md
subscribeName: PyTorch
---

# Exploring Optimization Convergence

In the previous chapter we created a simple single variable linear regression model to fit a data set. While the Python code was actually fairly short and simple, I did gloss over some details related to the optimization, and I hope to use this short chapter to answer some dangling questions about it. Since this chapter doesn't introduce new models or concepts you can skip it (or come back later) if you prefer. However, getting a feel for optimization is useful for training just about any model, not just the single variable linear regression model, and this chapter should give you insight that is useful for the rest of this guide and just about any machine learning you do.

To explore optimization we are going to exactly copy the code from the previous chapter, and experiment with it. To review, let's look at the part of the code from before that performed the optimization (just look at the previous chapter if you need to review the entire thing):

```python
# Setup the optimizer object, so it optimizes a and b.
optimizer = optim.Adam([a, b], lr=0.2)

# Main optimization loop
for t in range(10000):
    # Set the gradients to 0.
    optimizer.zero_grad()
    # Compute the current predicted y's from x_dataset
    y_predicted = model(x_dataset)
    # See how far off the prediction is
    current_loss = loss(y_predicted, y_dataset)
    # Compute the gradient of the loss with respect to a and b.
    current_loss.backward()
    # Update a and b accordingly.
    optimizer.step()
    print(f"t = {t}, loss = {current_loss}, a = {a.item()}, b = {b.item()}")
```

The main unanswered questions to address are:

1. I said that the learning rate affects how large of steps the optimization algorithm takes in one unit of time. But how do we choose an appropriate value for the learning rate, such as `0.2`?
2. What is this `AdamOptimizer` exactly, are there other choices for optimizers, and how do they differ?
3. Currently this code runs for `10000` iterations, and that seems good enough to fully optimize `L`. But how do we choose this appropriate amount of time for training?

There aren't exact or easy answers to the above questions, but answering these questions is made even harder by the fact that we can not effectively visualize the training progress with the code we have.  Currently we have some `print(...)` statements, which is good enough to see that the training error is decreasing, but not much more than that. Let's start with learning how to visualize training, since this will help us address the other questions and give us a deeper intuition about optimization.

## How to visualize training progress

### Extracting hyperparameters

One of the simplest ways to visualize training progress is to plot the value of the loss function over time. We could certainly plot the value of the loss function using matplotlib, like we plotted the data set. But PyTorch actually lets us plot training progress conveniently in real time by communicating with a tool called TensorBoard. It's pretty handy, but first we need to do some work to refactor our current code.

The first thing I'd like to do is move **hyperparameters** to the top of the script. What exactly are **hyperparameters**? They are parameters that affect how the training of the model proceeds, but are not part of the model itself. For example, \\(a\\) and \\(b\\) are parameters, while the learning rate \\(\alpha\\) is a hyperparameter. The hyperparameters we have are:

1. The learning rate, currently `0.2`.
2. The number of training iterations, currently `10000`.
3. The choice of optimization routine, currently `tf.train.AdamOptimizer` (This isn't often thought of as a hyperparameter, but here we'll think of it as one).

So, we can just put these into constants at the top of the code. Also, we are going to change these values to give us a simpler starting point:

```python
import pandas as pd
import matplotlib.pyplot as plt
import torch
import torch.optim as optim

### Hyperparameters ###

LEARNING_RATE = 0.000001 # Much smaller training rate, to make sure the optimization is at least reliable.
NUM_ITERS = 20000 # Twice as many training iterations, just gives us more room to experiment later.
OPTIMIZER_CONSTRUCTOR = optim.SGD # This is the simplest optimization algorithm.

# .. all the rest of the code, hyperparameter constants properly substituted
```

### Installing TensorBoard

Next we need to actually install TensorBoard on our system. The following command should do it:

```bash
pip3 install tb-nightly future
```

### Setting up TensorBoard

Now, we need to add some code to configure TensorBoard for our model. We will need to add a new import:

```python
from torch.utils.tensorboard import SummaryWriter
```

We want to tell PyTorch where to save a log of all the parameter and loss values. We setup the log location based on the values of the hyperparameters:

```python
# ... above this is where loss is defined

### TensorBoard Writer Setup ###

log_name = f"{LEARNING_RATE}, {OPTIMIZER_CONSTRUCTOR.__name__}"
writer = SummaryWriter(log_dir=f"runs/{log_name}")
print("To see tensorboard, run: tensorboard --logdir=runs/")

# ... below this is where we create the optimizer and session
```

The point of basing the log location names on the hyperparameter values is so that we can later compare logs that used different hyperparameters.

The last thing we need to do is make PyTorch actually write the values of `a`, `b` and the loss to the log as training progresses. In our training code before we had a `print` statement that showed how training was going, but now we can replace it (or keep it, you choose):

```python
# Main optimization loop
for t in range(NUM_ITERS):
    # Set the gradients to 0.
    optimizer.zero_grad()
    # Compute the current predicted y's from x_dataset
    y_predicted = model(x_dataset)
    # See how far off the prediction is
    current_loss = loss(y_predicted, y_dataset)
    # Compute the gradient of the loss with respect to a and b.
    current_loss.backward()
    # Update a and b accordingly.
    optimizer.step()

    # This is where we write the current values of a, b, and loss to the log.
    # global_step=t tells tensorboard at what step of the training this is.
    writer.add_scalar('a', a, global_step=t)
    writer.add_scalar('b', b, global_step=t)
    writer.add_scalar('L', current_loss, global_step=t)

# After we are done with the writer, we should close the log file.
writer.close()
```

And as a final touch, we can also delete or comment out the code that plots the data set, since it reduces the amount of clicking we have to do when trying different hyperparameters. The complete modified code should look something like this:

```python
import pandas as pd
import matplotlib.pyplot as plt
import torch
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter

### Hyperparameters ###

LEARNING_RATE = 0.000001 # Much smaller training rate, to make sure the optimization is at least reliable.
NUM_ITERS = 20000 # Twice as many training iterations, just gives us more room to experiment later.
OPTIMIZER_CONSTRUCTOR = optim.SGD # This is the simplest optimization algorithm.

# Load the data
D = pd.read_csv("homicide.csv")
x_dataset = torch.tensor(D.age.values, dtype=torch.float)
y_dataset = torch.tensor(D.num_homicide_deaths.values, dtype=torch.float)


### Model definition ###

# First we define the trainable parameters a and b 
a = torch.randn(1, requires_grad=True) # requires_grad means it is trainable
b = torch.randn(1, requires_grad=True)

# Then we define the prediction model
def model(x_input):
    return a * x_input + b


### Loss function definition ###

def loss(y_predicted, y_target):
    return ((y_predicted - y_target)**2).sum()


### TensorBoard Writer Setup ###

log_name = f"{LEARNING_RATE}, {OPTIMIZER_CONSTRUCTOR.__name__}"
writer = SummaryWriter(log_dir=f"runs/{log_name}")
print("To see tensorboard, run: tensorboard --logdir=runs/")


### Training the model ###

# Setup the optimizer object, so it optimizes a and b.
optimizer = OPTIMIZER_CONSTRUCTOR([a, b], lr=LEARNING_RATE)

# Main optimization loop
for t in range(NUM_ITERS):
    # Set the gradients to 0.
    optimizer.zero_grad()
    # Compute the current predicted y's from x_dataset
    y_predicted = model(x_dataset)
    # See how far off the prediction is
    current_loss = loss(y_predicted, y_dataset)
    # Compute the gradient of the loss with respect to a and b.
    current_loss.backward()
    # Update a and b accordingly.
    optimizer.step()

    writer.add_scalar('a', a, global_step=t)
    writer.add_scalar('b', b, global_step=t)
    writer.add_scalar('L', current_loss, global_step=t)

writer.close()
```

### Using TensorBoard

With the Python code prepared, we can now run it and use TensorBoard to visualize the training. First, run the Python code as usual, using Terminal, or your IDE. This will write logs to `runs/{log_name}` (relative to the directory from where you run the code). Now, we can open this up with TensorBoard, by running this command in Terminal in the same directory as you run your Python code from:

```bash
# Make sure you cd first to the directory that contains runs/ (probably where you .py file is)
tensorboard --logdir=runs/
```

Once you run that command, go to [http://localhost:6006](http://localhost:6006) in your web browser, and you should see plots of `L`, `a`, and `b` as the training progressed. With the hyperparameter choices from above, the plots should look like:

![TensorBoard 1][tensorboard_1]

## Interpreting the TensorBoard plots

Ok, so now we have some plots showing the progression of `L`, `a`, and `b`. What can these plots tell us? Well, with the current choice of `LEARNING_RATE = 0.000001`, the plot for `L` clearly continues to decrease continually during training. This is good, since this means that the `optim.SGD` is doing it's job of decreasing the value of the loss function. However, the loss function continues to decrease quickly even towards the end of training: it is reasonable to expect that the loss function would continue to decrease substantially if we continued to train for more iterations. Therefore, we have not found the minimum of the loss function.

To remedy this, we could do one of 3 things: run the training for more iterations, increase the learning rate, or experiment with another optimization algorithm. We don't want to train for more iterations unless we have to, since that just takes more time, so we will start with increasing the learning rate.

## Increasing the learning rate

Currently the learning rate is `0.000001`, and is too small. A pretty easy way to try new learning rates is to go roughly by powers of 10. For now, we can try `0.000001`, `0.000005`, `0.00001`. For each of these, you can just tweak the `LEARNING_RATE` constant, and re-run the code. You don't need to re-run the TensorBoard command (but you can), but make sure to reload the [http://localhost:6006](http://localhost:6006) page once you do all the runs. You should get plots that look like:

![TensorBoard 2][tensorboard_2]

We can clearly see the improvement by increasing the learning rate. The final loss obtained with a learning rate of `0.00001` is much smaller than our original loss obtained with a learning rate of `0.000001`. In addition, we can see that the loss is decreasing more slowly at the end of training. However, the loss function still hasn't converged, as it is still decreasing significantly. Again, to fix this we could train for longer, but as before we can try increasing the learning rate even more. We can try a learning rate of `0.00005`, and we get this:

![TensorBoard 3][tensorboard_3]

Huh? No plot!?!?? If you mouse over the `L` plot, TensorBoard will say that the value of `L` is NaN (not a number). What gives? Well, if the learning rate is too big then `optim.SGD` can explode: `a` and `b` (and consequently `L`) increase to infinity and become NaN. What "too big" is depends on the specific problem.

At this point there isn't a lot more that we can do by just tweaking the learning rate: it's either too big and causes the optimization to explode, or is too small to achieve convergence in `20000` iterations. We can certainly try more learning rates between `0.00001` and `0.00005`, but it won't be a ton better than what we already have.

## Using different optimization algorithms

So far we have been using `optim.SGD`. It is the simplest, classic way to iteratively train machine learning models. As discussed in the previous chapter, it is like moving a ball downhill, according to the current slope (aka the derivative). Generally, gradient descent is part of a class of optimization algorithms called **first-order methods**, since it uses only information from the first derivative of the loss function, and not higher-order derivatives. First-order methods are currently the dominant way to train most machine learning models.

In fact, there are many first order methods, other than simple gradient descent. Most of them are designed to offer an advantage over other first-order methods via speed to find convergence, reliability, ease of use, etc. For a fairly in-depth exploration, see [this blog post](http://ruder.io/optimizing-gradient-descent/index.html). To see the different optimization algorithms that are built-in to PyTorch, see [the documentation here](https://pytorch.org/docs/stable/optim.html#algorithms). In this list, you can see the `optim.Adam` that we used before, and the classic `optim.SGD` that we just tried.

We can experiment with any number of these. Here, I'll demonstrate experimenting with `optim.Adagrad`, but feel free to play around with any of them. To use `optim.Adagrad` we just need to change `OPTIMIZER_CONSTRUCTOR`, and set `LEARNING_RATE` back to `0.000001` for good measure:

```python
LEARNING_RATE = 0.000001
OPTIMIZER_CONSTRUCTOR = optim.Adagrad
```

Running this we see:

![TensorBoard 4][tensorboard_4]

Well, this is disappointing: `L` did not seem to decrease at all during training. The problem is that the learning rate used by gradient descent is really an entirely different learning rate from the Adagrad one: conceptually they are similar, but are on entirely different scales numerically. So, we just need to try different learning rates for Adagrad now. Since the value of `L` stayed constant with this very small learning rate, we expect that we need to try much larger learning rates for Adagrad. In fact, by trying learning rates of 0.5, 1, and 5, we get these plots:

![TensorBoard 5][tensorboard_5]

Now this is looking like progress! For the first time we start to get a sense of the loss rapidly decreasing, and then slowing down substantially. In addition, the final value of `a` is now negative (which we know is correct) compared to previous runs which ended either positive or close to zero. However, by looking at the plots for `a` and `b` (and to a lesser degree `L`) we can see that we still haven't achieved convergence: `a` and `b` haven't stopped changing substantially at the end of training. So, time to increase the learning rate even more! Before doing so, I am going to delete the logs of previous runs, except for the Adagrad run with a learning rate of 5, so that we can read the plots more clearly:

```bash
# This will delete logs of all the runs
rm -rf runs/
# Or, you can delete a specific run, for example:
rm -rf runs/10,\ Adagrad/
```

By trying learning rates of 10 and 50, we finally achieve convergence:

![TensorBoard 6][tensorboard_6]

Qualitatively, this looks like convergence (with a learning rate of 10, and certainly with a learning rate of 50) since the progress that Adagrad is making on decreasing `L` (and adjusting `a` and `b`) has hit a brick wall: no matter how long we run Adagrad, we can't seem to get a loss function value lower than about \\(3.9296 \\cdot 10^4 \\), and similarly for the values of `a` and `b`. We've finally trained our model completely.

Unfortunately, I don't know of an easy way to intuitively understand the differences between Adagrad, Adam, and other first-order methods. [This blog post](http://ruder.io/optimizing-gradient-descent/index.html) does give some mathematical analysis that explains what each algorithm tries to improve upon, and some reasoning for choosing an algorithm, but it can be tricky to apply to real problems. In general, you can always start with the simplest algorithm (gradient descent), and if it isn't converging quickly enough for you, then you can switch to a more sophisticated algorithm, such as Adagrad, Adam, or others.

# Concluding Remarks

The experimental nature of this chapter should illustrate the practicalities of machine learning: a lot of cutting-edge machine learning currently involves running multiple experiments to try to find the best combination of hyperparameters. There isn't a golden rule for choosing the optimization algorithm and hyperparameters, but hopefully this chapter demonstrates how to alter the algorithm and hyperparameters in PyTorch and monitor convergence using TensorBoard. The most important takeaways are:

1. Learning how to use TensorBoard
2. Recognizing convergence
3. Recognizing the symptoms of too small of a learning rate
4. Recognizing the symptoms of too large of a learning rate

In future chapters I won't include the code specifically for TensorBoard (unless it is important to that chapter) since I don't want it to get in the way of actual models, but *I would highly encourage you to insert your own TensorBoard summary code*, and monitor plots of convergence in TensorBoard, since it is useful both educationally and practically.

# Challenge Problems

1. Experiment on your own with a few other built-in PyTorch optimization algorithms, and try different learning rates. If you prefer a more focused goal, try to beat my configuration of an Adagrad optimizer with a learning rate of 50, and converge faster. Also note that some optimization algorithms have additional hyperparameters other than the learning rate. See the PyTorch documentation for information about these.
2. One other cause of slow convergence for the homicide rate linear regression is the somewhat extreme scaling of the problem. The \\(y\\) variable is a whole order of magnitude greater than the \\(x\\) variable, and this affects optimization. We will actually look at this problem specifically in chapter 2.4, but for now you can experiment on your own with one solution: instead of using the \\(x\\) and \\(y\\) data directly from the data set, modify them first to rescale them. A quick, hacky way is to modify the code that loads the data, so that \\(x\\) and \\(y\\) vary between 0 and 1:

```python
# Load the data, and convert to 1x30 vectors
D = pd.read_csv("homicide.csv")
# 21 and 50 are the min and max of x_data
x_data = (torch.tensor(D.age.values, dtype=torch.float) - 21.0) / (50.0 - 21.0)
# 196 and 653 are the min and max of y_data
y_data = (torch.tensor(D.num_homicide_deaths.values, dtype=torch.float) - 196.0) / (653.0 - 196.0)
```

On your own, add this code and see if you can achieve convergence using only gradient descent. You can also see how quickly you can achieve convergence using a more advanced algorithm such as Adam.

# Complete Code

The complete code including TensorBoard summaries, and using Adagrad is [available on GitHub](https://github.com/donald-pinckney/donald-pinckney.github.io/blob/src/books/pytorch/src/ch2-linreg/code/optimization/single_var_reg_optim.py) and directly below. Note that this code lacks the plotting of the data and the linear regression line:

```python
import pandas as pd
import matplotlib.pyplot as plt
import torch
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter

### Hyperparameters ###

LEARNING_RATE = 50 # Much smaller training rate, to make sure the optimization is at least reliable.
NUM_ITERS = 20000 # Twice as many training iterations, just gives us more room to experiment later.
OPTIMIZER_CONSTRUCTOR = optim.Adagrad # This is the simplest optimization algorithm.

# Load the data
D = pd.read_csv("homicide.csv")
x_dataset = torch.tensor(D.age.values, dtype=torch.float)
y_dataset = torch.tensor(D.num_homicide_deaths.values, dtype=torch.float)


### Model definition ###

# First we define the trainable parameters a and b 
a = torch.randn(1, requires_grad=True) # requires_grad means it is trainable
b = torch.randn(1, requires_grad=True)

# Then we define the prediction model
def model(x_input):
    return a * x_input + b


### Loss function definition ###

def loss(y_predicted, y_target):
    return ((y_predicted - y_target)**2).sum()


### TensorBoard Writer Setup ###
log_name = f"{LEARNING_RATE}, {OPTIMIZER_CONSTRUCTOR.__name__}"
writer = SummaryWriter(log_dir=f"runs/{log_name}")
print("To see tensorboard, run: tensorboard --logdir=runs/")


### Training the model ###

# Setup the optimizer object, so it optimizes a and b.
optimizer = OPTIMIZER_CONSTRUCTOR([a, b], lr=LEARNING_RATE)

# Main optimization loop
for t in range(NUM_ITERS):
    # Set the gradients to 0.
    optimizer.zero_grad()
    # Compute the current predicted y's from x_dataset
    y_predicted = model(x_dataset)
    # See how far off the prediction is
    current_loss = loss(y_predicted, y_dataset)
    # Compute the gradient of the loss with respect to a and b.
    current_loss.backward()
    # Update a and b accordingly.
    optimizer.step()

    writer.add_scalar('a', a, global_step=t)
    writer.add_scalar('b', b, global_step=t)
    writer.add_scalar('L', current_loss, global_step=t)

writer.close()
```

[tensorboard_1]: /books/pytorch/book/ch2-linreg/assets/tensorboard_1.png
[tensorboard_2]: /books/pytorch/book/ch2-linreg/assets/tensorboard_2.png
[tensorboard_3]: /books/pytorch/book/ch2-linreg/assets/tensorboard_3.png
[tensorboard_4]: /books/pytorch/book/ch2-linreg/assets/tensorboard_4.png
[tensorboard_5]: /books/pytorch/book/ch2-linreg/assets/tensorboard_5.png
[tensorboard_6]: /books/pytorch/book/ch2-linreg/assets/tensorboard_6.png
