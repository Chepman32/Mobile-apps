# Mobile Apps Collection

This repository contains multiple React Native projects built with Expo. Each folder is a separate mobile application that can be developed and run independently.

## Projects

- **DigitalDetoxApp** - A wellness timer focused on reducing screen time.
- **HabitSculptorApp** - AI-inspired habit tracking application.
- **StoryBuilderApp** - Creative multimedia story builder.
- **SurvivalGameApp** - Educational survival skills game.
- **TimeCapsuleApp** - Digital time capsule for memories.

## Creating Projects Automatically

A helper script is available to scaffold all apps in one go using Expo. It checks if a project folder already exists before attempting to create it.

```bash
bash scripts/create_apps.sh
```

Each generated app will live in its own directory as listed above.

## Running an App

Navigate to a project folder and start Expo:

```bash
cd DigitalDetoxApp  # or any other app folder
yarn install        # install dependencies
expo start          # run the development server
```

Feel free to expand each app according to its README.
