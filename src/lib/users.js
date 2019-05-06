import { db } from './database';

export class Users {
  
  table = db.table('users');
  
  async set(user, data = {}, merge = true) {
    const id = this.getId(user);
    const newData = { ...data, name: user.username };
    return db.set(id, this.table, newData, merge);
  }

  async get(user) {
    const id = this.getId(user);
    return db.get(id, this.table);
  }
  
  getId(user) {
    if ('string' === typeof user) return user;
    const { username, discriminator } = user;
    return `${username}#${discriminator}`;
  }
}

export const users = new Users();