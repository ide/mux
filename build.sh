#!/bin/bash

echo "🔥  Cleaning build directory"
rm -fr build

echo
echo "📚  Compiling source files"
npm run tsc

echo
echo "🆗  Build finished"
