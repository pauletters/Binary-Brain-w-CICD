import models from '../models/index.js';
import db from '../config/connection.js';
import { Model, Connection } from 'mongoose';
import { IQuestion } from '../models/Question.js';
import { Db } from 'mongodb';

type DatabaseModel = Model<IQuestion> & {
  db: Connection & {
    db: Db;  
  };
};

export default async (modelName: 'Question', collectionName: string) => {
  try {
    const model = models[modelName] as DatabaseModel;
   
    if (!model?.db?.db) {
      throw new Error(`Database connection not initialized for model ${modelName}`);
    }

    // Now TypeScript knows we have a valid database connection
    const collections = await model.db.db.listCollections({
      name: collectionName
    }).toArray();

    if (collections.length) {
      await db.dropCollection(collectionName);
    }
  } catch (err) {
    throw err;
  }
}
