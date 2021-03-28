#!/bin/bash

for n in 20 16 15 14 13 12 11 10 09 08;do
	echo Colors: $n
	for space in LAB YIQ YUV;do
		convert pixelated2.png -quantize $space -dither None -colors $n tmp3.png
		zopflipng --iterations=10 --filters=01234meb --lossy_8bit --lossy_transparent tmp3.png hdr-760-px-${space}${n}.png
	done
done
rm tmp*.png
rm crop-760-120.pnm
