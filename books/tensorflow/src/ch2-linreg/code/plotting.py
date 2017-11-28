import sys
import math
import numpy as np
import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import axes3d, art3d
from matplotlib import cm
from matplotlib.animation import FuncAnimation

df = pd.read_csv("/Users/donaldpinckney/Xcode/donald-pinckney.github.io/books/tensorflow/src/ch2-linreg/homicide.csv")
X = df.values

x = X[:,0]
y = X[:,1]
x = x.reshape(1, 30)
y = y.reshape(1, 30)

x_ = tf.placeholder(tf.float32, shape=(1, None))
a_ = tf.get_variable("a", shape=(1), initializer=tf.constant_initializer(value=-20))
b_ = tf.get_variable("b", shape=(1), initializer=tf.constant_initializer(value=600))

y_ = a_ * x_ + b_
yC = tf.placeholder(tf.float32, shape=(1, None))
loss = tf.reduce_sum((yC - y_)**2)
# optim = tf.train.GradientDescentOptimizer(learning_rate=0.000003).minimize(loss)
optim = tf.train.AdamOptimizer(learning_rate=0.1).minimize(loss)
# optim = tf.train.MomentumOptimizer(learning_rate=0.0000001, momentum=0.99).minimize(loss)
# optim = tf.train.AdagradOptimizer(learning_rate=3).minimize(loss)

sess = tf.Session()
sess.run(tf.global_variables_initializer())

a_curr, b_curr, loss_curr = sess.run([a_, b_, loss], feed_dict={
    x_: x,
    yC: y
})

As = [a_curr]
Bs = [b_curr]
Ls = [loss_curr]

for i in range(10000):
    a_curr, b_curr, loss_curr, _ = sess.run([a_, b_, loss, optim], feed_dict={
        x_: x,
        yC: y
    })
    As.append(a_curr)
    Bs.append(b_curr)
    Ls.append(loss_curr)

    print("%g, %g, %g" % (a_curr, b_curr, loss_curr))

# indices = np.random.randint(len(As), size=100)
nDots = 10001
indices = np.arange(0, len(As), len(As) // nDots)
As = np.array(As)[indices]
Bs = np.array(Bs)[indices]
Ls = np.array(Ls)[indices]



A = np.arange(-30, 0, 0.3)
B = np.arange(400, 1200, 10.0)

Am, Bm = np.meshgrid(A, B)

Ac = len(B)
Ar = len(A)

L = np.zeros((Ac, Ar))

for c in range(Ac):
  for r in range(Ar):
    pred = Am[c,r] * x + Bm[c,r]
    errs = (pred - y)**2
    L[c, r] = np.sum(errs)



theCM = cm.get_cmap()
theCM._init()
alphas = np.abs(np.linspace(-1.0, 1.0, theCM.N))
theCM._lut[:-3,-1] = alphas

fig = plt.figure()
# plt.hold(True)
ax = fig.add_subplot(1, 1, 1, projection='3d')
ax.plot_surface(Am, Bm, L, cmap=cm.coolwarm)

ax.set_xlabel('a')
ax.set_ylabel('b')
ax.set_zlabel('L(a, b)')

dotsPlot,  = ax.plot3D(As[0], Bs[0], Ls[0], 'r.', alpha=0.8)

def update(step):
    i = step
    dotsPlot.set_xdata(As[i])
    dotsPlot.set_ydata(Bs[i])
    dotsPlot.set_3d_properties(zs=Ls[i])
    return dotsPlot

# s = ax.scatter([best_a], [best_b], [best_L], c='r', marker='o', depthshade=0, alpha=1)
# s = ax.plot3D(As[-1], Bs[-1], Ls[-1], 'r.', alpha=0.8)
# s = ax.plot3D([best_a], [best_b], [best_L], 'r^', alpha=0.8)

anim = FuncAnimation(fig, update, frames=np.arange(0, len(As)), interval=16)
anim.save('line.mp4')

plt.show()