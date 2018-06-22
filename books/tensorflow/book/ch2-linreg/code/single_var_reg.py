import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt

# Load the data, and convert to 1x30 vectors
D = pd.read_csv("homicide.csv")
x_data = np.matrix(D.age.values)
y_data = np.matrix(D.num_homicide_deaths.values)

# Plot the data
plt.plot(x_data.T, y_data.T, 'x')
plt.xlabel('Age')
plt.ylabel('US Homicide Deaths in 2015')
plt.title('Relationship between age and homicide deaths in the US')
plt.show()



### Model definition ###

# Define x (input data) placeholder
x = tf.placeholder(tf.float32, shape=(1, None))

# Define the trainable variables
a = tf.get_variable("a", shape=())
b = tf.get_variable("b", shape=())

# Define the prediction model
y_predicted = a*x + b


### Loss function definition ###

# Define y (correct data) placeholder
y = tf.placeholder(tf.float32, shape=(1, None))

# Define the loss function
L = tf.reduce_sum((y_predicted - y)**2)


### Training the model ###

# Define optimizer object
optimizer = tf.train.AdamOptimizer(learning_rate=0.2).minimize(L)

# Create a session and initialize variables
session = tf.Session()
session.run(tf.global_variables_initializer())

# Main optimization loop
for t in range(10000):
    _, current_loss, current_a, current_b = session.run([optimizer, L, a, b], feed_dict={
        x: x_data,
        y: y_data
    })
    print("t = %g, loss = %g, a = %g, b = %g" % (t, current_loss, current_a, current_b))


### Using the trained model to make predictions

# x_test_data has values similar to [20.0, 20.1, 20.2, ..., 79.9, 80.0]
x_test_data = np.matrix(np.linspace(20, 55))

# Predict the homicide rate for each age in x_test_data
y_test_data = session.run(y_predicted, feed_dict={
    x: x_test_data
})

# Plot the original data and the prediction line
plt.plot(x_data.T, y_data.T, 'x')
plt.plot(x_test_data.T, y_test_data.T)
plt.xlabel('Age')
plt.ylabel('US Homicide Deaths in 2015')
plt.title('Age and homicide death linear regression')
plt.show()
