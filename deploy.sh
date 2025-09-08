#!/bin/bash

# Build the project
cd CoinSecurities-main
npm run build

# Copy dist files to root for GitHub Pages
cd ..
cp -r CoinSecurities-main/dist/* .

# Add and commit changes
git add .
git commit -m "Deploy to GitHub Pages"

# Push to main branch
git push origin main
