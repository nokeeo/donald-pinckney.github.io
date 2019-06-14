import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt

### Hyperparameters ###

# fs = 2*xs + 0.013*ys + 4

LEARNING_RATE = 0.0000025 # 0.01 0.0000025
OPTIMIZER_CONSTRUCTOR = tf.train.GradientDescentOptimizer
NUM_ITERS = 5000
DIV_Y = 1 # 1
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

# run_data = np.empty((0, 3))

# Main optimization loop
# for t in range(NUM_ITERS):
#     _, current_loss, current_A = session.run([optimizer, L, A], feed_dict={
#         x: X_data,
#         y: y_data
#     })
#     row = np.array([current_A[0,0], current_A[0,1], current_loss])
#     run_data = np.append(run_data, [row], axis=0)
#     # summary_writer.add_summary(summary, t)
#     # print("t = %g, loss = %g" % (t, current_loss))


def lossEval(a0, a1):
    # global session
    l = session.run([L], feed_dict={
        x: X_data,
        y: y_data,
        A: np.matrix([a0, a1])
    })
    return l[0]

a0s = np.linspace(-3, 3, num=100)
a1s = np.linspace(-1, 5, num=100)
ls = np.zeros((len(a0s), len(a1s)))



for i, a0 in np.ndenumerate(a0s):
    for j, a1 in np.ndenumerate(a1s):
        ls[i,j] = lossEval(a0, a1)

np.save('a0s_r1', a0s)
np.save('a1s_r1', a1s)
np.save('ls_r1', ls)

ls = ls.transpose()

levels = np.linspace(8.5, 700)
plt.contour(a0s, a1s, ls, 20)
# plt.scatter(1.3, 2.0, c='r')
plt.title('Level sets of the loss function')
plt.xlabel('A[0]')
plt.ylabel('A[1]')
plt.show()