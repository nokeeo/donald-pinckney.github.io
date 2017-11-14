#!/bin/bash
# What file we will remove front matter from
file=$1

# Write everything to stdout
cat $file

# Search for the start and end of front matter
matchLines=$(cat $file | grep -n -e "---" | cut -f1 -d:)
set -- $matchLines
l1=$1
l2=$2

if [[ -z $l2 ]]; then
	echo ""
	exit 0
fi

# Grab the appropriate parts of the file
frontMatter=$(sed -n $l1,"$l2"p $file)
otherStuff=$(sed $l1,"$l2"d $file)

# Write other stuff to file
echo "$otherStuff" > $file

