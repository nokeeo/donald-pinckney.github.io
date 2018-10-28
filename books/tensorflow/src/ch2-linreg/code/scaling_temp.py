import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt

### Hyperparameters ###

# fs = 2*xs + 0.013*ys + 4

LEARNING_RATE = 0.01 # 0.0000025
OPTIMIZER_CONSTRUCTOR = tf.train.GradientDescentOptimizer
NUM_ITERS = 5000
DIV_Y = 100 # 1
# DIV_X_1 = 1
# SUB_Y = 13

# First we load the entire CSV file into an m x 3
D = np.matrix(pd.read_csv("linreg-scaling-synthetic.csv", header=None).values)

# We extract all rows and the first 2 columns into X_data
# Then we flip it
X_data = D[:, 0:2].transpose()
X_data[1, :] = X_data[1, :] / DIV_Y


# We extract all rows and the last column into y_data
# Then we flip it
y_data = D[:, 2].transpose()

# And make a convenient variable to remember the number of input columns
n = 2

# Define data placeholders
x = tf.placeholder(tf.float32, shape=(n, None))
y = tf.placeholder(tf.float32, shape=(1, None))

# Define trainable variables
A = tf.get_variable("A", initializer=tf.constant([1.5, 0.1 * DIV_Y], shape=(1, n)))
# b = tf.get_variable("b", initializer=tf.constant(1, dtype=tf.float32))

# Define model output
y_predicted = tf.matmul(A, x)

# Define the loss function
L = tf.reduce_mean((y_predicted - y)**2)


# log_name = "%g; %g, %s" % (DIV_Y, LEARNING_RATE, OPTIMIZER_CONSTRUCTOR.__name__)
# tf.summary.scalar('A_0', A[0,0])
# tf.summary.scalar('A_1', A[0,1] / DIV_Y)
# # tf.summary.scalar('b', b)
# tf.summary.scalar('L', L)
# summary_node = tf.summary.merge_all()
# summary_writer = tf.summary.FileWriter('/tmp/tensorflow/scaling_temp/' + log_name)
# print("Open /tmp/tensorflow/scaling_temp/ with tensorboard")


# Define optimizer object
optimizer = OPTIMIZER_CONSTRUCTOR(learning_rate=LEARNING_RATE).minimize(L)

# Create a session and initialize variables
session = tf.Session()
session.run(tf.global_variables_initializer())

run_data = np.empty((0, 3))

# Main optimization loop
for t in range(NUM_ITERS):
    _, current_loss, current_A = session.run([optimizer, L, A], feed_dict={
        x: X_data,
        y: y_data
    })
    row = np.array([current_A[0,0], current_A[0,1], current_loss])
    run_data = np.append(run_data, [row], axis=0)
    # summary_writer.add_summary(summary, t)
    # print("t = %g, loss = %g" % (t, current_loss))


start_idx = 20
end_idx = run_data.shape[0]

print(run_data)

old_data = np.load('run1.npy')

plt.figure(num=None, figsize=(10, 4), dpi=80)
plt.rc('text', usetex=True)
plt.rc('font', family='serif')

plt.subplot(1, 2, 1)
plt.plot(np.arange(start_idx, end_idx), old_data[start_idx:,0])
plt.plot(np.arange(start_idx, end_idx), run_data[start_idx:,0])
plt.title('Value of $A_0$')
plt.xlabel('Iteration')
plt.ylabel('$A_0$')


plt.subplot(1, 2, 2)
plt.plot(np.arange(start_idx, end_idx), old_data[start_idx:,2])
plt.plot(np.arange(start_idx, end_idx), run_data[start_idx:,2])
plt.title('Value of the loss function')
plt.xlabel('Iteration')
plt.ylabel('Loss function')

plt.show()
