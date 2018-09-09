#!/bin/bash

install_dir="`pwd`/lib/python"
PYVERSION="`python3 -c 'import sys; sys.stdout.write(sys.version[0:3])'`"
PYTHONPATH=`python3 -c "import sys; sys.stdout.write(':'.join(sys.path[1::]))"`
SITE_PATH="`pwd`/lib/python/lib/python$PYVERSION/site-packages"
CLONE_DIR="tmp/sshuttle"

export PYTHONPATH=$SITE_PATH:$PYTHONPATH

if [ -d "$CLONE_DIR" ]; then
  rm -rf "$CLONE_DIR"
fi

git clone https://github.com/wmantly/sshuttle $CLONE_DIR

if [ -d "$SITE_PATH" ]; then
  rm -rf "$SITE_PATH"
fi

mkdir -p "$SITE_PATH"

cd "$CLONE_DIR"

python3 setup.py install --prefix="$install_dir"
