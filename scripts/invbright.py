#!/usr/bin/env python3

from sys import argv, exit, stdin, stdout, stderr, version_info
from functools import partial
eprint = partial(print, file=stderr)

import re

from colormath.color_objects import sRGBColor, LabColor, LCHabColor, LCHuvColor
from colormath.color_conversions import convert_color

XFORM_SPACE = LCHuvColor

def hex2rgb(s):
    if len(s) == 4:
        return (int(s[1], 16) * 17, int(s[2], 16) * 17, int(s[3], 16) * 17)
    elif len(s) == 7:
        return (int(s[1:3], 16), int(s[3:5], 16), int(s[5:7], 16))

fg_hex = argv[2] if len(argv) > 2 else '#ffffff'

fg = convert_color(sRGBColor(*map(lambda x: x / 255.0, hex2rgb(fg_hex))), XFORM_SPACE)

if XFORM_SPACE == LabColor:
    fg_light = fg.lab_l
else:
    fg_light = fg.lch_l

def repl(m):
    s = m.group(0)
    rgb = hex2rgb(s)

    # invert lightness
    srgb = sRGBColor(*map(lambda x: x / 255.0, rgb))

    p = convert_color(srgb, XFORM_SPACE)
    if XFORM_SPACE == LabColor:
        p.lab_l = fg_light - p.lab_l
    else:
        p.lch_l = fg_light - p.lch_l

    srgb = convert_color(p, sRGBColor)
    rgb = srgb.rgb_r, srgb.rgb_g, srgb.rgb_b
    rgb = tuple(map(lambda x: int(x*255.999999), rgb))
    if rgb[0] % 17 == 0 and rgb[1] % 17 == 0 and rgb[2] % 17 == 0:
        rgb = tuple(map(lambda x: x // 17, rgb))
        inv = f'#{rgb[0]:x}{rgb[1]:x}{rgb[2]:x}'
    else:
        inv = f'#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}'

    return inv + ' !important'

with open(argv[1]) as f:
    printing = True
    for line in map(str.strip, f):
        if line == '/*':
            printing = False
        elif line == '*/':
            printing = True
        elif printing:
            line = re.sub(r'#[0-9a-f]{3}([0-9a-f]{3})?', repl, line)
            print(line)
