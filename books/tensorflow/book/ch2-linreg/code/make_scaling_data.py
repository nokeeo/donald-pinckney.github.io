import numpy as np
import matplotlib
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


n = 20
xr = np.linspace(0, 10, n)
yr = np.linspace(0, 1000, n)
xs, ys = np.meshgrid(xr, yr)
xs = np.reshape(xs, n*n)
ys = np.reshape(ys, n*n)

fs = 2*xs + 0.013*ys
rs = np.random.randn(n*n)
rfs = fs + 0*rs

D = np.column_stack((xs, ys, rfs))
print(D.shape)
np.savetxt('linreg-scaling-synthetic.csv', D, delimiter=',')
print(D)

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.scatter(xs, ys, rfs)
plt.show()