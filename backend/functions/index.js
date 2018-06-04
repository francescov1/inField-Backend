const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.endpoint = functions.https.onRequest((request, response) => {
  response.send("Welcome to the inField Detection API!");
});
