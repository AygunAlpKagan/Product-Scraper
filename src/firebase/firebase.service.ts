import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp();

const db = getFirestore();


@Injectable()
export class FirebaseService {
  public firestore: admin.firestore.Firestore;
  public database: admin.database.Database;
  public storage: admin.storage.Storage;


  constructor() {
    if(!admin.apps.length){
      admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: process.env.client_email,
          privateKey: process.env.private_key.replace(/\\n/g, '\n'),
          projectId: process.env.project_id
        }),
        databaseURL: 'https://deneme-f6b6c-default-rtdb.firebaseio.com/'
      })
    }
   
  }


}
