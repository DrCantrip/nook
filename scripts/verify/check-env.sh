#!/bin/bash
# Cornr environment security checks
PASS=0
FAIL=0

echo "Running environment security checks..."
echo ""

# Check .env is gitignored
if git check-ignore .env > /dev/null 2>&1; then
  echo "PASS: .env is gitignored"
  ((PASS++))
else
  echo "FAIL: .env is NOT gitignored — add it to .gitignore immediately"
  ((FAIL++))
fi

# Check for hardcoded secrets in tracked files
echo ""
echo "Checking for hardcoded secrets in tracked files..."
SECRETS_FOUND=$(git grep -l -i "sk-\|supabase_service_role\|api_secret\|private_key" -- ':(exclude)*.lock' ':(exclude)*.sh' 2>/dev/null)
if [ -z "$SECRETS_FOUND" ]; then
  echo "PASS: No hardcoded secrets found in tracked files"
  ((PASS++))
else
  echo "FAIL: Potential secrets found in:"
  echo "$SECRETS_FOUND"
  ((FAIL++))
fi

# Check no camera permission in app.json
echo ""
if [ -f "app.json" ]; then
  if grep -q "NSCameraUsageDescription" app.json; then
    echo "FAIL: Camera permission found in app.json — remove for v1"
    ((FAIL++))
  else
    echo "PASS: No camera permission in app.json"
    ((PASS++))
  fi
else
  echo "SKIP: app.json not found"
fi

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [ $FAIL -gt 0 ]; then
  exit 1
else
  exit 0
fi
