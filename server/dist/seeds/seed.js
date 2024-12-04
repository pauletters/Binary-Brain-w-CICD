import db from "../config/connection.js";
import Question from "../models/Question.js";
import cleanDB from "./cleanDb.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Go up to src directory and then into seeds
const jsonPath = join(dirname(dirname(__dirname)), 'src', 'seeds', 'pythonQuestions.json');
// Read and parse the JSON file
const pythonQuestions = JSON.parse(await readFile(jsonPath, 'utf-8'));
db.once('open', async () => {
    await cleanDB('Question', 'questions');
    await Question.insertMany(pythonQuestions);
    console.log('Questions seeded!');
    process.exit(0);
});
