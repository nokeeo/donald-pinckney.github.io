import gudhi as gd
import numpy as np
import matplotlib.pyplot as plt

def circle_sample(n, r):
    angles = np.random.uniform(0, 2*np.pi, n)
    return r*np.cos(angles), r*np.sin(angles)

# First we sample 150 points from the unit circle and the radius 2 circle
xs1, ys1 = circle_sample(150, 1.0)
xs2, ys2 = circle_sample(150, 2.0)
xs, ys = np.concatenate((xs1, xs2), axis=None), np.concatenate((ys1, ys2), axis=None)

# Then we build a Vietoris-Rips complex (2 skeleton)
pts = list(zip(xs, ys))
rc = gd.RipsComplex(points=pts, max_edge_length=4.1)
# Then we build a simplex tree, which is a fast data structure encoding the simplex
# This is just an intermediate step
tr = rc.create_simplex_tree(max_dimension=2)
# Finally we compute the persistence, which is a list of the form [(k, (b, d))]
# where k is the homology level, b is the birth time and d is the death time.
diag = tr.persistence()

# Then we plot the persistence barcode and the original data side by side.
plt.subplot(1, 3, 2)
gd.plot_persistence_barcode(diag)
plt.subplot(1, 3, 3)
gd.plot_persistence_diagram(diag)
plt.subplot(1, 3, 1)
plt.title("Original data set")
plt.plot(xs, ys, "ro")
plt.show()