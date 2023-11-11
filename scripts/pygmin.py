#!/usr/bin/env python3

from sys import argv, exit, stdin, stdout, stderr, version_info
from functools import partial
eprint = partial(print, file=stderr)

import re

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
    #eprint(token)
    s = NotAString()
    try:
        if isinstance(token, HashToken):
            s = '#' + token.value
        elif isinstance(token, StringToken):
            s = f'"{token.value}"'
        elif isinstance(token, FunctionBlock):
            s = token.serialize()
        elif isinstance(token, URLToken):
            s = str(token.value)
        elif isinstance(token, NumberToken):
            n = token.value
            i = int(n)
            s = str(i if n == i else n)
        elif isinstance(token, SquareBracketsBlock):
            s  = '['
            for sub in token.content:
                s += tokenstr(sub)
            s += ']'
        else:
            s = str(token.value)
    except AttributeError as e:
        eprint('oops', token, dir(token))

    return s

mapping = {}

rules = tinycss2.parse_stylesheet(data)
for rule in rules:
    if isinstance(rule, QualifiedRule):
        selectors = ['']
        for t in rule.prelude:
            if isinstance(t, LiteralToken) and t.value == ',':
                selectors.append('')
            else:
                selectors[-1] += tokenstr(t)

        if selectors[-1] == '': selectors.pop()

        #selector = selector.replace('.pgcss', '.')

        properties = ['']
        for t in rule.content:
            if isinstance(t, LiteralToken) and t.value == ';':
                properties.append('')
            else:
                properties[-1] += tokenstr(t)

        for p in properties:
            if p == 'color:inherit': continue
            p = re.sub(r'^([a-z-]+:)\s*', r'\1', p.strip())
            if p:
                sel_list = mapping.setdefault(p, [])
                for s in map(str.strip, selectors):
                    if s: sel_list.append(s)

    elif isinstance(rule, AtRule):
        print(rule.serialize())

for p, selectors in mapping.items():
    for s in selectors:
        print(f'{s} {{{p}}}')
    #selector = ','.join(map(lambda s: s.replace('.', '.pgcss'), sorted(selectors)))
    #selector = ', '.join(sorted(selectors))
    #print(f'{selector} {{{properties}}}')
