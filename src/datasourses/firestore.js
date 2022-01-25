import { FirestoreDataSource } from "apollo-datasource-firestore";
import Firestore, { FieldValue } from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

const firestore = new Firestore({
	projectId: process.env.PROJECT_ID,
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const usersCollection = firestore.collection("users");

export class UserDataSource extends FirestoreDataSource {
	async findUserById(userId) {
		return this.findOneById(userId);
	}

	async getFollowing(userId) {
		const data = await this.findOneById(userId);
		return data.following;
	}

	async isFollowing(userId, ticker) {
		const data = await this.findOneById(userId, {
			ttl: 0,
		});
		return data.following.includes(ticker);
	}

	async getPlanType(userId) {
		const data = await this.findOneById(userId);
		return data.planType;
	}

	async getSettings(userId) {
		const data = await this.findOneById(userId);
		return data.settings;
	}

	async getTags(userId) {
		const data = await this.findOneById(userId);
		return data.tags;
	}

	async hasTag(userId, tag) {
		const data = await this.findOneById(userId);
		return data.tags.includes(tag);
	}

	async addTag(userId, tag) {
		const data = await this.getTags(userId);
		this.updateOnePartial(userId, { tags: data.append(tag) });
	}

	async followCompany(userId, ticker) {
		await this.updateOnePartial(userId, {
			following: FieldValue.arrayUnion(ticker),
		});
		return true;
	}

	async unfollowCompany(userId, ticker) {
		await this.updateOnePartial(userId, {
			following: FieldValue.arrayRemove(ticker),
		});
		return true;
	}
}
