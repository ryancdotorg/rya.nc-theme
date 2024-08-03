#!/usr/bin/env python3

from sys import argv, exit, stdin, stdout, stderr, version_info
from functools import partial
eprint = partial(print, file=stderr)

# Python standard library imports
import os
import re
import sqlite3
import subprocess

from pathlib import Path
from hashlib import sha256
# End imports

def sha256_file(path):
    with open(path, 'rb') as f:
        return sha256(f.read()).hexdigest()

dbfile = Path(os.getenv('XDG_RUNTIME_DIR'), '.subset.db')
con = sqlite3.connect(dbfile)
with con:
    con.execute('CREATE TABLE IF NOT EXISTS subsets(cmdhash not null unique, inhash not null, outhash not null)')

#pyftsubset src/font/iosevka-ryanc-bolditalic.ttf --unicodes=U+0400-1DFF,U+2C00-2DFF,U+2E80-10FFFF --flavor=woff2 --output-file=static/font/iosevka-ryanc-bolditalic-other.woff2

cmd = argv[1:]
cmdhash = sha256(b'\0'.join(map(str.encode, cmd))).hexdigest()
infile = Path(cmd[1])
outfile, outhash = None, None
for arg in cmd:
    a, _, b = arg.partition('=')
    if a == '--output-file':
        outfile = Path(b)
        if outfile.exists():
            outhash = sha256_file(outfile)

inhash = None
inhash = sha256_file(infile)

with con:
    cur = con.execute('SELECT outhash FROM subsets WHERE cmdhash=? AND inhash=?', (cmdhash, inhash,))
    refhash = cur.fetchone()
    if refhash is not None and len(refhash) and refhash[0] == outhash:
        outfile.touch()
        exit(0)

print(*cmd)
result = subprocess.run(cmd, capture_output=True)
out = result.stdout.decode()
err = result.stderr.decode()

stdout.write(out)
stderr.write(err)
if result.returncode == 0:
    outhash = sha256_file(outfile)
    if outhash is not None:
        with con:
            con.execute(
                'INSERT OR REPLACE INTO subsets(cmdhash, inhash, outhash) VALUES(?,?,?)',
                (cmdhash, inhash, outhash,)
            )
    exit(0)
else:
    exit(result.returncode)
