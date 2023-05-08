#!/usr/bin/env python3

from sys import argv, exit, stdin, stdout, stderr, version_info
from functools import partial
eprint = partial(print, file=stderr)

import tinycss2
from tinycss2.ast import *

data = stdin.read()

class NotAString(object):
    def __str__(self):
        raise TypeError('Object cannot be stringified!')

    def __repr__(self):
        raise TypeError('Object cannot be represented!')

def notwsp(token):
    return not isinstance(token, WhitespaceToken)

def tokenstr(token, prev=None, next=None):
    s = NotAString()
    if isinstance(token, HashToken):
        s = '#' + token.value
    elif isinstance(token, StringToken):
        s = f'"{token.value}"'
    elif isinstance(token, SquareBracketsBlock):
        s  = '['
        for sub in token.content:
            s += tokenstr(sub)
        s += ']'
    else:
        s = str(token.value)

    return s

mapping = {}

rules = tinycss2.parse_stylesheet(data)
for rule in rules:
    if isinstance(rule, QualifiedRule):
        selector = ''.join(map(tokenstr, filter(notwsp, rule.prelude)))
        selector = selector.replace('.pgcss', '.')
        properties = ''.join(map(str.strip, map(tokenstr, rule.content))).strip('; ')
        for p in properties.split(';'):
            if p == 'color:inherit': continue
            selectors = mapping.setdefault(p, [])
            selectors.append(selector)

for properties, selectors in mapping.items():
    selector = ','.join(map(lambda s: s.replace('.', '.pgcss'), sorted(selectors)))
    print(f'{selector}{{{properties}}}')
