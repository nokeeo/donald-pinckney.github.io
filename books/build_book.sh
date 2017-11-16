#!/bin/bash

srcDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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


# Copy the book to _drafts and _posts
bookName=$(basename $bookDir)

currDir=$(pwd)
echo "In directory: $currDir"

echo "Copying src/ to $srcDir/../_drafts/$bookName"
tree $srcDir/..
rm -rf $srcDir/../_drafts/$bookName/
mkdir $srcDir/../_drafts/$bookName
cp -R src/* $srcDir/../_drafts/$bookName/
tree $srcDir/..

echo "Copying src/ to $srcDir/../_posts/$bookName"

rm -rf $srcDir/../_posts/$bookName/
mkdir $srcDir/../_posts/$bookName
cp -R src/* $srcDir/../_posts/$bookName/
tree $srcDir/..

rm $srcDir/../_drafts/$bookName/SUMMARY.md
rm $srcDir/../_posts/$bookName/SUMMARY.md



