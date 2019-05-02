import Firestore from '@google-cloud/firestore';

const { NODE_ENV, PROJECT_ID, GOOGLE_CREDENTIALS } = process.env;

const options = {};

if (NODE_ENV !== 'production') {
  options.projectId = PROJECT_ID;
  options.keyFilename = GOOGLE_CREDENTIALS;
}

export const db = new Firestore(options);

export const FieldValue = Firestore.FieldValue;
