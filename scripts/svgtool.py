#!/usr/bin/env python3

import re, os, sys

from io import StringIO, BytesIO

import xml.etree.ElementTree as ET
from xml.etree.ElementTree import Element, SubElement

from xml.dom import minidom
from lxml import etree

# https://github.com/edent/SuperTinyIcons
s = None
def s_get(*args, **kwargs):
    global s
    if s is None:
        import requests
        s = requests.Session()

    return s.get(*args, **kwargs)

NS = {'svg': 'http://www.w3.org/2000/svg'}
ET.register_namespace('',NS['svg'])

def pretty(element):
    parser = etree.XMLParser(remove_blank_text=True)
    tree = etree.parse(StringIO(ET.tostring(element).decode()), parser)
    return etree.tostring(tree.getroot(), pretty_print=True).decode()

def terse(element):
    parser = etree.XMLParser(remove_blank_text=True)
    tree = etree.parse(StringIO(ET.tostring(element).decode()), parser)
    return etree.tostring(tree.getroot()).decode()

def parse_ns(filename):
    if filename.startswith('http'):
        r = s_get(filename)
        filename = StringIO(r.content.decode())
    elif '<svg' in filename:
        filename = StringIO(filename)

    tree = ET.parse(filename)
    root = tree.getroot()

    m = re.match(r'^({[^}]+})?(.*)', root.tag)
    if m:
        ns = m.group(1) if m.group(1) else ''

    return (tree, root, ns)

def copy(dst, src):
    dst.attrib['viewBox'] = src.attrib['viewBox']
    if 'aria-label' in src.attrib:
        dst.attrib['id'] = src.attrib['aria-label'].replace(' ','')
    else:
        dst.attrib['id'] = src.attrib['id']

    for child in src:
        dst.append(child)

    return dst

def format(filename):
    (tree, root, ns) = parse_ns(filename)
    svg = Element(ns+'svg')
    copy(svg, root)
    return pretty(svg)

def merge(filenames):
    ns = '{'+NS['svg']+'}'
    svg = Element(ns+'svg')
    defs = Element(ns+'defs')
    svg.append(defs)
    for filename in filenames:
        (tree, root, _) = parse_ns(filename)

        d = root.find(ns+'defs') or []
        for e in d: defs.append(e)

        symbol = Element(ns+'symbol')
        copy(symbol, root)
        d = symbol.find(ns+'defs')
        if d: symbol.remove(d)

        defs.append(symbol)

    sys.stdout.write(terse(svg))

def symbols(filename):
    (tree, root, ns) = parse_ns(filename)

    symbols = []
    for symbol in root.iter(ns+'symbol'):
        symbols.append(symbol.attrib['id'])

    return symbols

def extract(filename, id):
    (tree, root, ns) = parse_ns(filename)

    for symbol in root.iter(ns+'symbol'):
        if symbol.attrib['id'] == id:
            svg = Element(ns+'svg', {
                'id': id,
                'viewBox': symbol.attrib['viewBox']
            })

            for child in symbol:
                svg.append(child)
            sys.stdout.write(pretty(svg))

def supertiny(name):
    if isinstance(name, str):
        res = s_get(f'https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/{name}.svg')
        if res.status_code == 200:
            xml = res.content.decode()
            return format(xml)
    else:
        icons = []
        for n in name:
            xml = supertiny(n)
            icons.append(xml)

        return merge(icons)

def abort(msg):
    sys.stderr.write(msg+'\n')
    sys.exit(1)

def main(arg0, narg, args):
    if narg == 0:
        abort('need arguments')

    cmd = args[0]

    if cmd == 'format' and narg == 2:
        sys.stdout.write(format(args[1]))
    elif cmd == 'symbols' and narg == 2:
        print('\n'.join(symbols(args[1])))
    elif cmd == 'extract' and narg == 3:
        extract(args[1], args[2])
    elif cmd == 'merge' and narg > 1:
        merge(args[1:])
    elif cmd == 'supertiny' and narg > 1:
        supertiny(args[1:])
    else:
        abort('bad arguments')

if __name__ == "__main__":
    arg0 = sys.argv[0]
    argv = sys.argv[1:]
    main(arg0, len(argv), argv)
