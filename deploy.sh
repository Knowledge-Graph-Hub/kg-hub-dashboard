#!/usr/bin/env sh

set -e

REMOTENAME=${1:-origin}
REMOTE=`git remote get-url --push ${REMOTENAME}`

# build
npm run build

cd dist

# If deploying to custom domain
# echo 'my.domain.org' > CNAME

git init
git add -A
git commit -m 'Deploy to gh-pages'

git remote add ${REMOTENAME} ${REMOTE}
git push --force ${REMOTENAME} main:gh-pages

cd -
