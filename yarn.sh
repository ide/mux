#!/bin/bash
set -eo pipefail

while getopts v: option; do
  case "$option" in
    v)
      YARN_VERSION=$OPTARG
      ;;
    \?)
      print >&2 "Usage: $0 -v <version>"
      exit 1
      ;;
  esac
done

if [[ ! -e ~/.yarn/bin/yarn || $(yarn --version) != "${YARN_VERSION}" ]]; then
  curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version $YARN_VERSION
else
  echo "Yarn v${YARN_VERSION} is already installed."
fi
