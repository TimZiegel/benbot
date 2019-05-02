import { db, FieldValue } from './database';
import { currencies } from './currency';

const defaultValues = {
  name: '',
  timestamp: 0
};

currencies.forEach(({ type }) => defaultValues[type] = 0);

export class Users {
  
  collection = db.collection('users');
  
  async set(user, data = {}, merge = true) {
    const newData = { ...data, timestamp: FieldValue.serverTimestamp() };
    return this.getRef(user).set(newData, { merge });
  }
  
  getRef(user) {
    return this.collection.doc(user.id);
  }
  
  async get(user) {
    const doc = await this.getRef(user.id).get();
    return doc.exists ? doc.data() : null;
  }
}

export const users = new Users();