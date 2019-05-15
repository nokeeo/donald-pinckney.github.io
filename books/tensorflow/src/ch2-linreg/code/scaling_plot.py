import numpy as np
import matplotlib.pyplot as plt

r1 = np.load('run1.npy')
r2 = np.load('run2.npy')

start_idx1 = 0
end_idx1 = 60

start_idx2 = 10
end_idx2 = 60
# end_idx = 200

plt.figure(num=None, figsize=(10, 4), dpi=80)
plt.rc('text', usetex=True)
plt.rc('font', family='serif')

plt.subplot(1, 2, 1)
plt.plot(np.arange(start_idx1, end_idx1), r1[start_idx1:end_idx1,0])
plt.plot(np.arange(start_idx1, end_idx1), r2[start_idx1:end_idx1,0])
plt.title('Value of $A_0$')
plt.xlabel('Iteration')
plt.ylabel('$A_0$')
plt.ylim(1.0, 2.0)


plt.subplot(1, 2, 2)
plt.plot(np.arange(start_idx2, end_idx2), r1[start_idx2:end_idx2,2])
plt.plot(np.arange(start_idx2, end_idx2), r2[start_idx2:end_idx2,2])
plt.title('Value of the loss function')
plt.xlabel('Iteration')
plt.ylabel('Loss function')
plt.ylim(8.5, 15.5)

plt.show()