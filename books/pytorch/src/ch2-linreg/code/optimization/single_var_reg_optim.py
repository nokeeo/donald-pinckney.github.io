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