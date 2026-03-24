#!/bin/bash
# Cornr type check script
echo "Running TypeScript type check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "PASS: No type errors found."
  exit 0
else
  echo "FAIL: Type errors detected. Fix before proceeding."
  exit 1
fi
