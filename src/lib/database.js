import Firestore from "@google-cloud/firestore";
import {
  FieldValue,
  CollectionReference,
  Query,
  Timestamp
} from "@google-cloud/firestore";
import env from "../lib/env";
import { isTestBot } from "./utils";

const { PROJECT_ID, GOOGLE_CREDENTIALS } = env;
const options = {};

if (isTestBot()) {
  options.projectId = PROJECT_ID;
  options.keyFilename = GOOGLE_CREDENTIALS;
}

const database = new Firestore(options);
export const increment = amount => FieldValue.increment(amount);
export const timestamp = date => {
  const stamp = date ? Timestamp.fromDate(date) : Timestamp.now();
  return stamp.toMillis();
};

export class Database {
  async get(id, table) {
    const doc = await this.table(table)
      .doc(id)
      .get();
    return doc.exists ? doc.data() : null;
  }

  async set(id, table, data = {}, merge = true) {
    const newData = { ...data, timestamp: timestamp() };
    const doc = await this.table(table).doc(id);
    return doc.set(newData, { merge });
  }

  async add(table, data) {
    const newData = { ...data, timestamp: timestamp() };
    return this.table(table).add(newData);
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

  orderBy(table, order, direction = "asc") {
    return this.table(table).orderBy(order, direction);
  }

  orderBy$(order, direction = "asc") {
    return query => query.orderBy(order, direction);
  }

  startAt(table, value) {
    return this.table(table).startAt(value);
  }

  startAt$(value) {
    return query => query.startAt(value);
  }

  where(table, field, comparator, value) {
    return this.table(table).where(field, comparator, value);
  }

  where$(field, comparator, value) {
    return query => query.where(field, comparator, value);
  }

  whereAll(table, ...comparators) {
    const query = this.table(table);
    return comparators.reduce(
      (acc, [field, comparator, value]) =>
        this.whereChain(acc, field, comparator, value),
      query
    );
  }

  whereAll$(...comparators) {
    return query =>
      comparators.reduce(
        (acc, [field, comparator, value]) =>
          this.whereChain(acc, field, comparator, value),
        query
      );
  }

  select(table, ...fields) {
    return this.table(table).select(...fields);
  }

  select$(...fields) {
    return query => query.select(...fields);
  }

  pipe(query, ...chains) {
    return chains.reduce((acc, curr) => curr(acc), query);
  }
}

export const db = new Database();
