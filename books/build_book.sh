#!/bin/bash

bookDir=$1
cd $bookDir

# Get list of all markdown files in book
files=$(find src -name "*.md")

# Remove front matter for each file, and back it up
for f in $files; do
	backupF="$f".mdbak
	../remove_front.sh $f > $backupF
done


# Build book with mdbook
mdbook build

# Restore files with original front matter
for f in $files; do
	backupF="$f".mdbak
	mv $backupF $f
done


