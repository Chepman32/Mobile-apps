#!/bin/bash

# Script to scaffold each React Native app using Expo.
# It will create the app only if the folder does not already exist.

set -e

APPS=(
  "DigitalDetoxApp"
  "HabitSculptorApp"
  "StoryBuilderApp"
  "SurvivalGameApp"
  "TimeCapsuleApp"
)

for APP in "${APPS[@]}"; do
  if [ -d "$APP" ]; then
    echo "Skipping $APP (already exists)"
  else
    echo "Creating $APP..."
    npx create-expo-app "$APP" --template expo-template-blank-typescript
    echo "$APP created"
  fi
  echo
done

# End of script
