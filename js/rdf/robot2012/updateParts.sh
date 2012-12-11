#!/bin/bash/


CONVERTER=~/mrdoob-three.js/utils/exporters/obj/convert_obj_three.py
BASEDIR=~/Webpage/js/rdf/robot2012/bodies


cd ~/Webpage/blender

for OBJ in *.obj
do
    JSFILE="$BASEDIR/${OBJ%.obj}.js"
    /usr/bin/python $CONVERTER -i $OBJ -o $JSFILE
done
