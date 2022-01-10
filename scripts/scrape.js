const dotenv = require("dotenv");

dotenv.config();

const Firestore = require("@google-cloud/firestore");

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const data = require("../datasets/sp500.json");

// var collectionRef = db.collection("companies");

// collectionRef.listDocuments().then((documentRefs) => {
//   documentRefs.map((ref) => {
//     ref.update({
//       description: null,
//       quarterlyReports: null,
//       tags: null,
//       catalysts: null,
//     });
//   });
// });

var collectionRef = db.collection("users");
