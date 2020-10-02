#!/bin/bash

echo "🔥  Cleaning build directory"
rm -fr build

echo
echo "📚  Compiling source files"
npm run -s babel -- --out-dir build --ignore __tests__  src

echo
echo "🆗  Build finished"
