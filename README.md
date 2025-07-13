# Mobile Apps Collection

This repository contains multiple React Native projects built with Expo. Each folder is a separate mobile application that can be developed and run independently.

## Projects

- **DigitalDetoxApp** - A wellness timer with challenges, meditation, and a community leaderboard.
- **HabitSculptorApp** - AI-inspired habit tracking application.
- **StoryBuilderApp** - Creative multimedia story builder.
- **SurvivalGameApp** - Educational survival skills game.
- **TimeCapsuleApp** - Digital time capsule for memories.

## Future App Ideas

The repository may be expanded with additional offline-friendly apps:

1. Grocery List & Pantry Manager
2. Offline Book Tracker & Reading Log
3. Offline Resume Builder
4. Offline Home Workout Generator
5. Offline Pet Care Organizer
6. Offline Chore Chart for Families
7. Offline Gratitude Journal
8. Offline Sudoku & Puzzle Hub
9. Offline Recipe Ingredient Substitution Finder
10. Offline Car Maintenance Log
11. Offline Plant Identifier & Diary
12. Offline DIY Project Planner
13. Offline Baby Milestone Tracker
14. Offline Personal Safety Checklist
15. Offline Gift Planner & Tracker
16. Offline Medication Reminder & Tracker
17. Offline Craft Pattern Organizer
18. Offline Learning Tracker for Kids
19. Offline Home Inventory for Insurance
20. Offline Journal with Mood & Weather Logging
21. Offline Board Game Companion
22. Offline Language Phrasebook
23. Offline Home Energy Usage Tracker
24. Offline Personal Budget Envelope System
25. Offline Event Countdown & Planner

## Creating Projects Automatically

A helper script is available to scaffold all apps in one go using Expo. It checks if a project folder already exists before attempting to create it.
The script uses the Expo blank TypeScript template so that each project starts with a consistent TypeScript setup.

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
