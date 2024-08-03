#!/usr/bin/env python3

from sys import argv
from contextlib import contextmanager

@contextmanager
def selector(*args):
    print(', '.join(args), '{')
    try:
        def directive(key, value):
            print(f'    {key}: {value};')
        yield directive
    finally:
        print('}')

for icon in argv[1:]:
    if icon == 'Email':
        s = '#icons a[title=email]'
    elif icon == 'RSS':
        s = '#icons a[title$=Feed]'
    else:
        s = f'#{icon}'

    with selector(s) as directive:
        directive('background-image', f"url('/theme/img/icon-{icon}.png')")
