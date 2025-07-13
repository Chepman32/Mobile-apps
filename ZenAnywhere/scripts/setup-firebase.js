#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Main function
const main = async () => {
  console.log(chalk.blue('\n🚀 ZenAnywhere Firebase Setup 🚀\n'));
  console.log(chalk.yellow('This script will help you set up Firebase for your ZenAnywhere app.\n'));

  // Check if Firebase CLI is installed
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    console.log(chalk.green('✓ Firebase CLI is installed'));
  } catch (error) {
    console.error(chalk.red('❌ Firebase CLI is not installed. Please install it first:'));
    console.log(chalk.cyan('\n  npm install -g firebase-tools\n'));
    console.log('Then run this script again.');
    process.exit(1);
  }

  // Check if user is logged in to Firebase
  try {
    execSync('firebase login', { stdio: 'inherit' });
  } catch (error) {
    console.error(chalk.red('❌ Failed to log in to Firebase. Please try again.'));
    process.exit(1);
  }

  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log(chalk.yellow('\nCreating .env file from .env.example...'));
    try {
      fs.copyFileSync(path.join(__dirname, '..', '.env.example'), envPath);
      console.log(chalk.green('✓ Created .env file'));
    } catch (error) {
      console.error(chalk.red('❌ Failed to create .env file:', error.message));
      process.exit(1);
    }
  } else {
    console.log(chalk.green('✓ .env file already exists'));
  }

  // Check if Firebase is already initialized
  const firebaseRCPath = path.join(__dirname, '..', '.firebaserc');
  const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
  
  if (fs.existsSync(firebaseRCPath) && fs.existsSync(firebaseJsonPath)) {
    console.log(chalk.green('✓ Firebase is already initialized'));
    process.exit(0);
  }

  // Initialize Firebase
  console.log('\nInitializing Firebase...');
  try {
    execSync('firebase init', { stdio: 'inherit' });
    console.log(chalk.green('✓ Firebase initialized successfully'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to initialize Firebase:', error.message));
    process.exit(1);
  }

  // Set up Firebase emulators
  const useEmulators = await askQuestion(
    '\nDo you want to set up Firebase Emulators? (y/N) '
  );

  if (useEmulators.toLowerCase() === 'y') {
    console.log('\nSetting up Firebase Emulators...');
    try {
      execSync('firebase init emulators', { stdio: 'inherit' });
      console.log(chalk.green('✓ Firebase Emulators set up successfully'));
    } catch (error) {
      console.error(chalk.red('❌ Failed to set up Firebase Emulators:', error.message));
    }
  }

  console.log('\n🎉 Firebase setup complete! 🎉\n');
  console.log(chalk.yellow('Next steps:'));
  console.log('1. Update your .env file with your Firebase configuration');
  console.log('2. Start the development server with: npm start');
  console.log('3. If using emulators, start them with: firebase emulators:start\n');

  rl.close();
};

// Run the script
main().catch((error) => {
  console.error(chalk.red('❌ An error occurred:'), error);
  process.exit(1);
});
