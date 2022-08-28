#!/bin/bash
set -euo pipefail
trap 's=$?; echo "$0:$LINENO: \`$BASH_COMMAND\` returned $s"; exit $s' ERR
IFS=$'\n\t'

SCRIPTNAME=$(basename "$0")
TMPDIR="${TMPDIR:-$(dirname $(mktemp))}"
WORKDIR=$(mktemp -d "$TMPDIR/$SCRIPTNAME.XXXXXXXXXX")
trap "rm -rf \"$WORKDIR\"" EXIT

#set -x

PX_WIDTH=184
PX_HEIGHT=122

for t in `seq 1 25`;do
	echo "Building hex mask..."
	convert canvas:black -background black -extent ${PX_WIDTH}x${PX_HEIGHT} $WORKDIR/hex.png
	for i in `seq 2 12 $(($PX_HEIGHT-1))`;do
		RANDHEX=`head -c $(($(($PX_WIDTH-2))/8)) /dev/urandom | xxd -p -u -c 256`
		echo "$RANDHEX"
		convert -background black -fill '#FFFFFF' \
			-font /home/ryanc/fonts/pzim3x5.ttf -pointsize 20 -kerning -2 \
			label:"$RANDHEX" -crop ${PX_WIDTH}x12+0+0 $WORKDIR/row.png
		composite -compose atop -geometry +2+$i $WORKDIR/row.png $WORKDIR/hex.png $WORKDIR/tmp.png
		rm $WORKDIR/row.png
		mv $WORKDIR/tmp.png $WORKDIR/hex.png
	done
	convert $WORKDIR/hex.png -transparent white -depth 1 -define png:bit-depth=1 $WORKDIR/tmp.png
	rm $WORKDIR/hex.png
	echo "Packing image..."
	zopflipng --iterations=25 --filters=01234mepb --lossy_8bit --lossy_transparent \
		$WORKDIR/tmp.png $WORKDIR/hex.png
	if [ -e ../../static/img/hex_mask_gen.png ]; then
		if [ $(stat -c%s $WORKDIR/hex.png) -lt $(stat -c%s ../../static/img/hex_mask_gen.png) ]; then
			echo SMALLER
			cp $WORKDIR/hex.png ../../static/img/hex_mask_gen.png
			ls -al ../../static/img/hex_mask_*.png
		fi
	else
		cp $WORKDIR/hex.png ../../static/img/hex_mask_gen.png
	fi
done
