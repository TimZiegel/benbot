import { db } from './database';

export class Users {
  
  table = db.table('users');
  
  async set(user, data = {}, merge = true) {
    const id = this.getId(user);
    const name = user.username;
    const newData = { ...data, name };
    return db.set(id, this.table, newData, merge);
  }

  async get(user) {
    const id = this.getId(user);
    return db.get(id, this.table);
  }
  
  async getAll() {
    return db.getAll(this.table);
  }
  
  getId(user) {
    if ('string' === typeof user) return user;
    const { username, discriminator } = user;
    return `${username}#${discriminator}`;
  }
}

export const users = new Users();