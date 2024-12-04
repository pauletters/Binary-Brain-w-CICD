import db from "../config/connection.js";
import Question from "../models/Question.js";
import cleanDB from "./cleanDb.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';

console.log("Starting seed process...");

const runSeed = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const jsonPath = join(dirname(dirname(__dirname)), 'src', 'seeds', 'pythonQuestions.json');

    console.log("Reading JSON file from:", jsonPath);
    
    const pythonQuestions = JSON.parse(
      await readFile(jsonPath, 'utf-8')
    );

    console.log("Successfully parsed JSON data");

    // Handle database connection
    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });

    // Use a Promise to handle the database operations
    await new Promise<void>((resolve, reject) => {
      db.once('open', async () => {
        try {
          console.log("MongoDB connection established");
          console.log("Cleaning database...");
          await cleanDB('Question', 'questions');
          console.log("Database cleaned");

          console.log("Inserting questions...");
          await Question.insertMany(pythonQuestions);
          console.log('Questions seeded successfully!');
          
          await db.close();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error in seed file:', error);
    process.exit(1);
  }
};

// Run the seed function
runSeed();