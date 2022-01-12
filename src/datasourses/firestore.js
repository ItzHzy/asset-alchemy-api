import { FirestoreDataSource } from "apollo-datasource-firestore";
import Firestore from "@google-cloud/firestore";

const firestore = new Firestore({
	projectId: process.env.PROJECT_ID,
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const usersCollection = firestore.collection("users");

export class UserDataSource extends FirestoreDataSource {
	async findUserById(userId) {}
}
