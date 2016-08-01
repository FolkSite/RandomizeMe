#!/bin/bash

./node_modules/jsdoc/jsdoc.js --verbose --private --configure ./jsdoc.json --template ./node_modules/ink-docstrap/template --destination ./docs --readme README.md index.js