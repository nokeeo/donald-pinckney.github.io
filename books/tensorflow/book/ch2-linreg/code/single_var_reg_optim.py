import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt

### Hyperparameters ###

LEARNING_RATE = 50.0
OPTIMIZER_CONSTRUCTOR = tf.train.AdagradOptimizer
NUM_ITERS = 20000

# Load the data, and convert to 1x30 vectors
D = pd.read_csv("homicide.csv")
x_data = np.matrix(D.age.values)
y_data = np.matrix(D.num_homicide_deaths.values)


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


### Summary setup ###

log_name = "%g, %s" % (LEARNING_RATE, OPTIMIZER_CONSTRUCTOR.__name__)
tf.summary.scalar('a', a)
tf.summary.scalar('b', b)
tf.summary.scalar('L', L)
summary_node = tf.summary.merge_all()
summary_writer = tf.summary.FileWriter('/tmp/tensorflow/single_var_reg/' + log_name)
print("Open /tmp/tensorflow/single_var_reg/ with tensorboard")


### Training the model ###

# Define optimizer object
optimizer = OPTIMIZER_CONSTRUCTOR(learning_rate=LEARNING_RATE).minimize(L)

# Create a session and initialize variables
session = tf.Session()
session.run(tf.global_variables_initializer())

# Main optimization loop
for t in range(NUM_ITERS):
    _, summary = session.run([optimizer, summary_node], feed_dict={
        x: x_data,
        y: y_data
    })
    summary_writer.add_summary(summary, t)
    # print("t = %g, loss = %g, a = %g, b = %g" % (t, current_loss, current_a, current_b))

