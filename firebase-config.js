import * as dotenv from 'dotenv';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore} from 'firebase-admin/firestore'

let config =dotenv.config().parsed;

initializeApp({
  credential:applicationDefault()
});

const db = getFirestore();

export {db};
