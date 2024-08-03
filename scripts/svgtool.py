#!/usr/bin/env python3

import re, os, sys

from io import StringIO, BytesIO

import xml.etree.ElementTree as ET
from xml.etree.ElementTree import Element, SubElement

from xml.dom import minidom
from lxml import etree

CSS_COLORS = {
    "#ffd700": "gold",
    "#808080": "grey",
    "#000080": "navy",
    "#cd853f": "peru",
    "#ffc0cb": "pink",
    "#dda0dd": "plum",
    "#ff0000": "red",
    "#fffafa": "snow",
    "#d2b48c": "tan",
    "#008080": "teal",
}

# https://github.com/edent/SuperTinyIcons
s = None
def s_get(*args, **kwargs):
    global s
    if s is None:
        import requests
        s = requests.Session()

    return s.get(*args, **kwargs)

BG = 'z'
NS = {'svg': 'http://www.w3.org/2000/svg'}
ET.register_namespace('', NS['svg'])

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
        dst.attrib['id'] = src.attrib['aria-label'].replace(' ', '')
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

    # background
    bg = Element(ns+'path')
    bg.attrib['id'] = BG
    bg.attrib['d'] = 'm0 0H512V512H0'
    defs.append(bg)

    for filename in filenames:
        (tree, root, _) = parse_ns(filename)

        # move any elements from <defs> into the new svg
        d = root.find(ns+'defs')
        if d:
            [defs.append(e) for e in d]
            root.remove(d)

        # convert hex colors to lowercase
        for attr in ('stroke', 'fill'):
            for e in root.findall(f'.//*[@{attr}]'):
                if e.attrib[attr][0] == '#':
                    e.attrib[attr] = e.attrib[attr].lower()

        # convert background rectangles to use references
        for r in root.findall(ns+'rect[@rx="15%"][@width="512"][@height="512"]'):
            del r.attrib['rx']
            if 'fill' in r.attrib:
                r.tag = ns+'use'
                del r.attrib['width']
                del r.attrib['height']
                r.attrib['href'] = '#' + BG
                # move any other attributes to the end
                for k in tuple(r.attrib.keys()):
                    if k == 'href': continue
                    r.attrib[k] = r.attrib.pop(k)

        # convert background paths to use references
        for r in root.findall(ns+'path[@d="m0 0H512V512H0"]'):
            if 'fill' in r.attrib:
                r.tag = ns+'use'
                del r.attrib['d']
                r.attrib['href'] = '#' + BG
                # move any other attributes to the end
                for k in tuple(r.attrib.keys()):
                    if k == 'href': continue
                    r.attrib[k] = r.attrib.pop(k)

        # move fill to the end
        for r in root.findall('.//*[@fill]'):
            r.attrib['fill'] = r.attrib.pop('fill')

        # add this file as a symbol
        symbol = Element(ns+'symbol')
        copy(symbol, root)
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
    elif cmd == 'supertiny' and narg > 2:
        supertiny(args[1:])
        print()
    elif cmd == 'supertiny':
        sys.stdout.write(supertiny(args[1]))
    else:
        abort('bad arguments')

if __name__ == "__main__":
    arg0 = sys.argv[0]
    argv = sys.argv[1:]
    main(arg0, len(argv), argv)
