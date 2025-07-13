#!/bin/bash

# Script to scaffold each React Native app using Expo.
# It will create the app only if the folder does not already exist.

set -e

# File containing the list of app directory names to create
APP_LIST_FILE="$(dirname "$0")/app_names.txt"

if [ ! -f "$APP_LIST_FILE" ]; then
  echo "App list file not found: $APP_LIST_FILE" >&2
  exit 1
fi

while IFS= read -r APP || [ -n "$APP" ]; do
  # Skip empty lines and comments
  if [ -z "$APP" ] || [[ $APP = \#* ]]; then
    continue
  fi

  if [ -d "$APP" ]; then
    echo "Skipping $APP (already exists)"
  else
    echo "Creating $APP..."
    npx create-expo-app "$APP" --template expo-template-blank-typescript
    echo "$APP created"
  fi
  echo
done < "$APP_LIST_FILE"


# End of script
