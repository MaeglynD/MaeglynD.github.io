export const basicFFTSpectrum = String.raw`import numpy as np
import matplotlib.pyplot as plt

def fft_spec():
    n = 256
    img = np.ones((n,n))
    img[(n//2)-3, n//2] = 0

    f = np.fft.fftshift(np.fft.fft2(img))
    mod,phase = np.abs(f), np.angle(f)

    plt.figure(figsize=(12, 5), layout='constrained')
    plt.subplot(1, 2, 1)
    plt.title("Modulus")
    plt.imshow(mod, cmap='gray')
    
    plt.subplot(1, 2, 2)
    plt.title("Phase")
    plt.imshow(phase, cmap='binary')
    plt.setp(plt.gcf().get_axes(), xticks=[], yticks=[])

    plt.show()

fft_spec()`;

export const inverseFFT = String.raw`import numpy as np
import cv2
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

def fft_image(image_path):
    fig = plt.figure(figsize=(16,7))
    gs = GridSpec(2, 4, width_ratios=[1, 1, 1, 1], height_ratios=[1, 1])

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img_color = cv2.imread(image_path, cv2.IMREAD_COLOR_RGB)

    ax1 = fig.add_subplot(gs[:, 0])
    ax1.imshow(img_color)

    fft_img = np.fft.fftshift(np.fft.fft2(img))

    ax2 = fig.add_subplot(gs[0, 1])
    ax2.imshow(np.log1p(np.abs(fft_img)), cmap='binary')

    ax3 = fig.add_subplot(gs[1, 1])
    ax3.imshow(np.log1p(np.angle(fft_img)), cmap='binary')

    M, N = fft_img.shape
    y, x = np.ogrid[:M, :N]
    fft_img[np.sqrt((y-(M//2))**2 + (x-(N//2))**2) < 35] = 0

    ax4 = fig.add_subplot(gs[0, 2])
    ax4.imshow(np.log1p(np.abs(fft_img)), cmap='binary')

    ax5 = fig.add_subplot(gs[1, 2])
    ax5.imshow(np.log1p(np.angle(fft_img)), cmap='binary')

    fft_img = np.fft.ifft2(np.fft.ifftshift(fft_img))

    ax6 = fig.add_subplot(gs[:, 3])
    ax6.imshow(np.real(fft_img), cmap='binary')

    plt.setp(plt.gcf().get_axes(), xticks=[], yticks=[])
    plt.tight_layout(pad=1.0)

    plt.savefig('stepbystep.png', transparent=True, bbox_inches='tight')
    plt.show()

fft_image('img.png')`;
