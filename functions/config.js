const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/*
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const headers = firebaseConfig.backend.reqheader;
*/

module.exports = {
  firebase: {
    admin: admin,
    db: admin.database()
  },
  env: functions.config().env,
  watson: functions.config().watson
};
