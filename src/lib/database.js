import Firestore from '@google-cloud/firestore';
import { FieldValue, CollectionReference, Query } from '@google-cloud/firestore';
import { isTestBot } from './utils';

const { PROJECT_ID, GOOGLE_CREDENTIALS } = process.env;

const options = {};

if (isTestBot()) {
  options.projectId = PROJECT_ID;
  options.keyFilename = GOOGLE_CREDENTIALS;
}

const database = new Firestore(options);
export const increment = amount => FieldValue.increment(amount);
export const timestamp = () => FieldValue.serverTimestamp();

export class Database {
  
  async get(id, table) {
    const doc = await this.table(table).doc(id).get();
    return doc.exists ? doc.data() : null;
  }
  
  async set(id, table, data = {}, merge = true) {
    const newData = { ...data, timestamp: timestamp() };
    const doc = await this.table(table).doc(id);
    return doc.set(newData, { merge });
  }
  
  async getAll(table) {
    const { docs } = await this.table(table).get();
    return docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  table(id) {
    if (id instanceof CollectionReference || id instanceof Query) return id;
    if (isTestBot()) id = `staging-${id}`;
    return database.collection(id);
  }
  
  orderBy(table, order, direction = 'asc') {
    return this.table(table).orderBy(order, direction);
  }
  
  where(table, field, comparator, value) {
    return this.table(table).where(field, comparator, value);
  }
  
  select(table, ...fields) {
    return this.table(table).select(...fields);
  }
}

export const db = new Database();
