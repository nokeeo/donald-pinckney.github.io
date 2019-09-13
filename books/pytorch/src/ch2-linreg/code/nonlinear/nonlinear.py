import pandas as pd
import matplotlib.pyplot as plt
import torch
import torch.optim as optim

# Load the data
D = pd.read_csv("homicide_full.csv")

# We use unsqueeze so that we load that data as a 1xm matrix rather than a vector of length m
x_dataset = torch.tensor(D.age.values, dtype=torch.float).unsqueeze(0)
y_dataset = torch.tensor(D.num_homicide_deaths.values, dtype=torch.float).unsqueeze(0)

# # Plot the data
# plt.plot(x_dataset.t().numpy(), y_dataset.t().numpy(), 'x') # The 'x' means that data points will be marked with an x
# plt.xlabel('Age')
# plt.ylabel('US Homicide Deaths in 2015')
# plt.title('Relationship between age and homicide deaths in the US')
# plt.show()

DEGREE = 7

A = torch.randn((1, DEGREE), requires_grad=True)
b = torch.randn(1, requires_grad=True)

def gen_poly_features(x):
    x_rescale = x / 100.0
    return torch.cat([x_rescale ** i for i in range(1, DEGREE+1)], 0)

means = gen_poly_features(x_dataset).mean(1, keepdim=True)
deviations = gen_poly_features(x_dataset).std(1, keepdim=True)



# Then we define the prediction model
def model(x_input):
    x_poly = gen_poly_features(x_input)
    x_poly_transformed = (x_poly - means) / deviations
    return A.mm(x_poly_transformed) + b


### Loss function definition ###

Lambda = 1.0

def loss(y_predicted, y_target, A):
    return ((y_predicted - y_target)**2).sum() #+ Lambda*(A**2).sum()

### Training the model ###

# Setup the optimizer object, so it optimizes a and b.
optimizer = optim.Adam([A, b], lr=10.0)

# Main optimization loop
for t in range(300000):
    # Set the gradients to 0.
    optimizer.zero_grad()
    # Compute the current predicted y's from x_dataset
    y_predicted = model(x_dataset)
    # See how far off the prediction is
    current_loss = loss(y_predicted, y_dataset, A)
    # Compute the gradient of the loss with respect to A and b.
    current_loss.backward()
    # Update A and b accordingly.
    optimizer.step()
    print(f"t = {t}, loss = {current_loss}, A = {A.detach().numpy()}, b = {b.item()}")


x_test_data = torch.linspace(0, 100).unsqueeze(0)
y_test_prediction = model(x_test_data).detach()

# Plot the original data and the prediction line
# plt.plot(x_dataset.numpy(), y_dataset.numpy(), 'x')
plt.plot(x_dataset.t().numpy(), y_dataset.t().numpy(), 'x') # The 'x' means that data points will be marked with an x
plt.plot(x_test_data.t().numpy(), y_test_prediction.t().numpy())
plt.xlabel('Age')
plt.ylabel('US Homicide Deaths in 2015')
plt.title('Age and homicide death linear regression')
plt.show()