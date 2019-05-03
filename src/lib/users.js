import { db, timestamp } from './database';

export class Users {
  
  collection = db.collection('users');
  
  async set(user, data = {}, merge = true) {
    const name = user.username || '';
    const newData = { ...data, name, timestamp: timestamp() };
    return this.getRef(user).set(newData, { merge });
  }

  async get(user) {
    const doc = await this.getRef(user).get();
    return doc.exists ? doc.data() : null;
  }
  
  getRef(user) {
    const { username, discriminator } = user;
    return this.collection.doc(`${username}#${discriminator}`);
  }
}

export const users = new Users();