import { findOne } from "./firestore.js";

var data = findOne("companies", "ticker", "==", "IBM");

console.log(data);
