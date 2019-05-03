import Firestore from '@google-cloud/firestore';
import { isTestBot } from './utils';

const { PROJECT_ID, GOOGLE_CREDENTIALS } = process.env;
const { FieldValue } = Firestore;

const options = {};

if (isTestBot()) {
  options.projectId = PROJECT_ID;
  options.keyFilename = GOOGLE_CREDENTIALS;
}

export const db = new Firestore(options);
export const increment = amount => FieldValue.increment(amount);
export const timestamp = () => FieldValue.serverTimestamp();
