#!/usr/bin/env python3

from sys import argv, exit, stdin, stdout, stderr, version_info
from functools import partial
eprint = partial(print, file=stderr)

# Python standard library imports
import os
import json
from time import time_ns
from pathlib import Path
# End imports

JSON_FILE = Path('unicode-ranges.json')
TEXT_FILE = Path('unicode-ranges.txt')

if not TEXT_FILE.exists() or JSON_FILE.exists() and JSON_FILE.stat().st_mtime > TEXT_FILE.stat().st_mtime:
    with open(JSON_FILE) as j:
        with open(TEXT_FILE, 'w') as t:
            for r in json.load(j):
                cat = r['category']
                a, b = r['range']
                print(f'{cat+":":52} U+{a:04X}-{b:04X}', file=t)

    os.utime(TEXT_FILE.resolve(), ns=(
        TEXT_FILE.stat().st_atime_ns,
        JSON_FILE.stat().st_mtime_ns
    ))
elif not JSON_FILE.exists() or TEXT_FILE.exists() and TEXT_FILE.stat().st_mtime > JSON_FILE.stat().st_mtime:
    with open(TEXT_FILE) as t:
        ranges = []
        for cat, data in map(lambda x: x.split(':'), t):
            data = data.strip()
            prefix, sep, data = data.partition('+')
            if prefix != 'U' or sep != '+': continue
            xa, xb = data.split('-')
            a, b = map(lambda x: int(x, 16), (xa, xb))
            ranges.append({'category': cat, 'hexrange': [xa, xb], 'range': [a, b]})

        print(json.dumps(ranges, indent=2))
