# Mobile Apps Collection

This repository contains multiple React Native projects built with Expo. Each folder is a separate mobile application that can be developed and run independently.

## Projects

- **DigitalDetoxApp** - A wellness timer focused on reducing screen time.
- **HabitSculptorApp** - AI-inspired habit tracking application.
- **StoryBuilderApp** - Creative multimedia story builder.
- **SurvivalGameApp** - Educational survival skills game.
- **TimeCapsuleApp** - Digital time capsule for memories.
- **SudokuPuzzleHub** - Offline puzzle collection
- **ARScavengerHunt** - Augmented reality treasure hunt
- **RetroArcadeRunner** - Endless runner with retro style


## Creating Projects Automatically

The `scripts/create_apps.sh` script reads app names from `scripts/app_names.txt` and
scaffolds each one using Expo. Existing folders are skipped.

```bash
# edit scripts/app_names.txt and add one app name per line
bash scripts/create_apps.sh
```

Each generated app will live in its own directory using the names from the list.

## Running an App

Navigate to a project folder and start Expo:

```bash
cd DigitalDetoxApp  # or any other app folder
yarn install        # install dependencies
expo start          # run the development server
```

Feel free to expand each app according to its README.
