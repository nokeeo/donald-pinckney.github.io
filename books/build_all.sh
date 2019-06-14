#!/bin/bash

cd books

# First, if root sibling directory of mdbook exists, then rebuild mdbook if needed
if [ -d "../../mdBook/" ]; then
	pushd ../../mdBook/; ./install.sh; popd
fi

./build_book.sh tensorflow
./build_book.sh pytorch
# ./build_book.sh pl
