#!/bin/bash

srcDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

bookDir="$1"
cd "$bookDir"

# Get list of all markdown files in book
files=$(find src -name "*.md")

# Remove front matter for each file, and back it up
for f in $files; do
	backupF="$f".mdbak
	../remove_front.sh $f > $backupF
done


# Build book with mdbook
# mdbook build
../../../mdBook/target/debug/mdbook build

# Delete buggy output of mdbook
rm -rf src/http:/
rm -rf book/http:/
rm -rf src/https:/
rm -rf book/https:/

# Change FontAwesome directory name because Jekyll sucks
mv book/_FontAwesome book/FontAwesome
find . -type f -name "*.html" -print -exec sed -e 's/_FontAwesome/FontAwesome/g' -i "" {} \;

# Restore files with original front matter
for f in $files; do
	backupF="$f".mdbak
	mv $backupF $f
done


# Copy the book to _drafts and _posts
bookName=$(basename "$bookDir")

currDir=$(pwd)
echo "In directory: $currDir"

# echo "Copying src/ to $srcDir/../_drafts/$bookName"
# rm -rf "$srcDir/../_drafts/$bookName/"
# mkdir "$srcDir/../_drafts/$bookName"
# cp -R src/* "$srcDir/../_drafts/$bookName/"

echo "Copying src/ to $srcDir/../_posts/$bookName"

rm -rf "$srcDir/../_posts/$bookName/"
mkdir "$srcDir/../_posts/$bookName"
cp -R src/* "$srcDir/../_posts/$bookName/"

# rm "$srcDir/../_drafts/$bookName/SUMMARY.md"
rm "$srcDir/../_posts/$bookName/SUMMARY.md"
