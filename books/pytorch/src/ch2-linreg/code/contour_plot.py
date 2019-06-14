import numpy as np
import matplotlib.pyplot as plt

a0s = np.load('a0s_r2.npy')
a1s = np.load('a1s_r2.npy')
ls = np.load('ls_r2.npy').transpose()

trace = np.load('run2.npy')[:, 0:2]

levels = np.linspace(8.5, 1600)
c2 = plt.contour(a0s, a1s, ls, levels)
plt.scatter(2.0, 1.3, c='r', marker='x')
plt.scatter(trace[:,0], trace[:,1])
plt.title('Level sets of the loss function for D\'')
plt.xlabel('A[0]')
plt.ylabel('A[1]')
plt.xlim(-3, 3)
plt.ylim(-1, 5)
# plt.clabel(c2, inline=1, fontsize=10)
ns = np.arange(10)
for i, txt in enumerate(ns):
    plt.annotate(txt, (trace[i,0], trace[i,1]))
plt.show()



a0s = np.load('a0s_r1.npy')
a1s = np.load('a1s_r1.npy')
ls = np.load('ls_r1.npy').transpose()

trace = np.load('run1.npy')[:, 0:2]
# trace = trace[0:10, :]

levels = np.linspace(8.5, 5000)
c1 = plt.contour(a0s, a1s, ls, levels)
plt.scatter(2.0, 0.013, c='r', marker='x')
plt.scatter(trace[:,0], trace[:,1])
plt.title('Level sets of the loss function for D')
plt.xlabel('A[0]')
plt.ylabel('A[1]')
plt.xlim(1.4985, 1.5010)
plt.ylim(-0.05, 0.06)
# plt.clabel(c1, inline=1, fontsize=10)

ns = np.arange(10)
for i, txt in enumerate(ns):
    plt.annotate(txt, (trace[i,0], trace[i,1]))

plt.show()

