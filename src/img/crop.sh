#!/bin/bash

#convert 4250721014_d8d9abde29_k.jpg -crop 760x122+0+396 -evaluate multiply 0.40 -evaluate add 10% test.png
#for i in `seq 0 16`; do for j in `seq 0.1 .1 8`; do
#	if [ $i -eq 0 -o $i -ge $(echo "($j*2)/1" | bc) ] ; then
#		convert 4250721014_enhanced.png -blur ${i}x${j} -crop 760x122+0+396 -evaluate multiply 0.40 -evaluate add 10% crop-760-120.pnm
#		cwebp-1.1.0 -sharp_yuv -m 6 -q 0 -pass 10 -segments 1 -af crop-760-120.pnm -o `printf hdr-760-blured-%02u%02u.webp $i $(echo "($j*10)/1" | bc)`
#	fi
#done;done
convert 4250721014_enhanced.png \
	-blur 7x2 \
	-crop 760x122+0+396 \
	+repage \
	-evaluate multiply 0.40 \
	-evaluate add 10% \
	pnm:- | \
cwebp-1.1.0 \
	-sharp_yuv \
	-m 6 \
	-q 0 \
	-pass 10 \
	-segments 1 \
	-af \
	-o hdr-760-zq.webp \
	-- -
convert 4250721014_enhanced.png \
	-crop 760x122+0+396 \
	+repage \
	-evaluate multiply 0.40 \
	-evaluate add 10% \
	crop-760-120.pnm
cjpeg -quality 90 -optimize -progressive crop-760-120.pnm > hdr-760.jpg
~/code/jpeg/jpgcrush hdr-760.jpg
cwebp-1.1.0 \
	-pass 10 \
	-m 6 \
	-size 15000 \
	-af \
	-o hdr-760.webp \
	crop-760-120.pnm
#convert 4250721014_enhanced.png \
#	-crop 768x144+0+396 \
#	-evaluate multiply 0.40 \
#	-evaluate add 10% \
#	-scale 4.1666667% \
#	-scale 2400% \
#	+repage \
#	-crop 760x122+0+0 \
#	tmp1.png
#convert tmp1.png \
#	-crop 760x2+0+118 \
#	+repage \
#	tmp2.png
#convert tmp1.png tmp2.png \
#	-geometry +0+120 \
#	-compose over \
#	-composite \
#	hdr-760-px.png
#for n in 80 64 48 40 32 24 20 16 15 14 13 12 11 10 09 08 07 06 05 04 03;do
#	echo Colors: $n
#	for space in LAB YIQ YUV;do
#		convert hdr-760-px.png -quantize $space -dither None -colors $n tmp3.png
#		zopflipng --iterations=10 --filters=01234meb --lossy_8bit --lossy_transparent tmp3.png hdr-760-px-${space}${n}.png
#	done
#done
rm tmp*.png
rm crop-760-120.pnm
