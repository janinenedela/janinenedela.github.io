#!/bin/sh

`for file in ../assets/*/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
