import numpy as np
import matplotlib
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


n = 20
xr = np.linspace(0, 10, n)
yr = np.linspace(0, 10, n)
xs, ys = np.meshgrid(xr, yr)
xs = np.reshape(xs, 400)
ys = np.reshape(ys, 400)

fs = 2*xs + 1.3*ys + 4
rs = np.random.randn(400)
rfs = fs + 3*rs

D = np.column_stack((xs, ys, rfs))
print(D.shape)
np.savetxt('temp_data.csv', D, delimiter=',')
# print(D)

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.scatter(xs, ys, rfs)
plt.show()