#!/bin/bash

# Create clean repository structure
mkdir -p ../solspace-alpha-clean/src
mkdir -p ../solspace-alpha-clean/public
mkdir -p ../solspace-alpha-clean/prisma
mkdir -p ../solspace-alpha-clean/program/src
mkdir -p ../solspace-alpha-clean/scripts
mkdir -p ../solspace-alpha-clean/free
mkdir -p ../solspace-alpha-clean/tests
mkdir -p ../solspace-alpha-clean/target/idl
mkdir -p ../solspace-alpha-clean/target/types

# Copy essential files
cp -r .gitignore README.md package.json package-lock.json tsconfig.json next.config.ts postcss.config.cjs tailwind.config.js components.json ../solspace-alpha-clean/
cp -r Anchor.toml deploy-keypair.json solspace-keypair.json workspace.json netlify.toml ../solspace-alpha-clean/
cp -r *.md *.sh *.js ../solspace-alpha-clean/

# Copy source code
cp -r src/* ../solspace-alpha-clean/src/
cp -r public/* ../solspace-alpha-clean/public/
cp -r prisma/*.prisma ../solspace-alpha-clean/prisma/
cp -r program/src/* ../solspace-alpha-clean/program/src/
cp -r program/*.json program/*.toml ../solspace-alpha-clean/program/
cp -r scripts/* ../solspace-alpha-clean/scripts/
cp -r free/* ../solspace-alpha-clean/free/
cp -r tests/* ../solspace-alpha-clean/tests/
cp -r target/idl/* ../solspace-alpha-clean/target/idl/
[ -d "target/types" ] && cp -r target/types/* ../solspace-alpha-clean/target/types/

# Create fresh Git repository
cd ../solspace-alpha-clean
git init
git add .
git commit -m "Initial commit - clean repository"
git remote add origin https://github.com/ScotianOG/solspace-alpha-submit.git

echo "Clean repository created at ../solspace-alpha-clean"
echo "Now you can push with: cd ../solspace-alpha-clean && git push -u origin main"
