#!/bin/bash

install_dir="`pwd`/lib/python"
PYVERSION="`python3 -c 'import sys; sys.stdout.write(sys.version[0:3])'`"
PYTHONPATH=`python3 -c "import sys; sys.stdout.write(':'.join(sys.path[1::]))"`
SITE_PATH="`pwd`/lib/python/lib/python$PYVERSION/site-packages"

mkdir -p $SITE_PATH

export PYTHONPATH=$SITE_PATH:$PYTHONPATH

git clone https://github.com/wmantly/sshuttle tmp/sshuttle

cd tmp/sshuttle

python3 setup.py install --prefix=$install_dir
