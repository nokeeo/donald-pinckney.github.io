import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt

# First we load the entire CSV file into an m x 3
D = np.matrix(pd.read_csv("linreg-multi-synthetic-2.csv").values)

# We extract all rows and the first 2 columns into X_data
# Then we flip it
X_data = D[:, 0:2].transpose()

# We extract all rows and the last column into y_data
# Then we flip it
y_data = D[:, 2].transpose()

# And make a convenient variable to remember the number of input columns
n = 2

# Define data placeholders
x = tf.placeholder(tf.float32, shape=(n, None))
y = tf.placeholder(tf.float32, shape=(1, None))

# Define trainable variables
A = tf.get_variable("A", shape=(1, n))
b = tf.get_variable("b", shape=())

# Define model output
y_predicted = tf.matmul(A, x) + b

# Define the loss function
L = tf.reduce_sum((y_predicted - y)**2)

# Define optimizer object
optimizer = tf.train.AdamOptimizer(learning_rate=0.1).minimize(L)

# Create a session and initialize variables
session = tf.Session()
session.run(tf.global_variables_initializer())

# Main optimization loop
for t in range(2000):
    _, current_loss, current_A, current_b = session.run([optimizer, L, A, b], feed_dict={
        x: X_data,
        y: y_data
    })
    print("t = %g, loss = %g, A = %s, b = %g" % (t, current_loss, str(current_A), current_b))
