# from cached_run import oscillations
# from cache_rgb import oscillations
from cache_rgb3 import oscillations
from matplotlib import pyplot
import numpy


fourier = numpy.real(
        numpy.fft.fftshift(
            numpy.fft.fft(oscillations[1])
            )
    )
frequencies = numpy.fft.fftshift(
    numpy.fft.fftfreq(len(oscillations[1]), 0.033)
    )
# print(fourier[:4])
# print(numpy.real(fourier[:4]))
# pyplot.plot(oscillations[256:])
# print(len(oscillations))
t = numpy.linspace(0, len(oscillations[0])*33, num = len(oscillations[0]))
print(t)
# pyplot.plot(t, oscillations[0], color='red')
# pyplot.plot(t, oscillations[1], color='green')
# pyplot.plot(t, oscillations[2], color='blue')
pyplot.plot(frequencies, fourier)
# pyplot.ylim(top=3*10**6)
# pyplot.ylim(bottom=-1*10**6)
pyplot.show()