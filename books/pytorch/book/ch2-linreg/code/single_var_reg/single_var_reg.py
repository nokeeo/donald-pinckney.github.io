import pandas as pd
import matplotlib.pyplot as plt
import torch
import torch.optim as optim

# Load the data
D = pd.read_csv("homicide.csv")
x_dataset = torch.tensor(D.age.values, dtype=torch.float)
y_dataset = torch.tensor(D.num_homicide_deaths.values, dtype=torch.float)

# Plot the data
plt.plot(x_dataset.numpy(), y_dataset.numpy(), 'x') # The 'x' means that data points will be marked with an x
plt.xlabel('Age')
plt.ylabel('US Homicide Deaths in 2015')
plt.title('Relationship between age and homicide deaths in the US')
plt.show()



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

### Training the model ###

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


### Using the trained model to make predictions ###

# x_test_data has values similar to [20.0, 20.1, 20.2, ..., 54.9, 55.0]
x_test_data = torch.linspace(20, 55)
# Predict the homicide rate for each age in x_test_data
# .detach() tells PyTorch to not find gradients for this computation.
y_test_prediction = model(x_test_data).detach()

# Plot the original data and the prediction line
plt.plot(x_dataset.numpy(), y_dataset.numpy(), 'x')
plt.plot(x_test_data.numpy(), y_test_prediction.numpy())
plt.xlabel('Age')
plt.ylabel('US Homicide Deaths in 2015')
plt.title('Age and homicide death linear regression')
plt.show()
