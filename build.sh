#!/bin/bash

echo "🔥  Cleaning build directory"
rm -fr build

echo
echo "📚  Compiling source files"
npx tsc --project tsconfig.build.json

echo
echo "🆗  Build finished"
