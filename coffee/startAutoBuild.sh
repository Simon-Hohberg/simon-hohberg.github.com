#!/bin/bash/

files=""

for file in *.coffee
do
    files="$files $file"
done

coffee -b -w -c -o ../js/ $files
