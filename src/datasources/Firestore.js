import { FirestoreDataSource } from "apollo-datasource-firestore";
import Firestore, { FieldValue } from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

const firestore = new Firestore({
	projectId: process.env.PROJECT_ID,
});

export const usersCollection = firestore.collection(
	process.env.USER_COLLECTION
);

export class UserDataSource extends FirestoreDataSource {
	async findUserById(userId) {
		return this.findOneById(userId);
	}

	async getFollowing(userId) {
		const data = await this.findOneById(userId);
		return data ? data.following : [];
	}

	async isFollowing(userId, ticker) {
		const data = await this.findOneById(userId, {
			ttl: 0,
		});
		return data ? data.following.includes(ticker) : [];
	}

	async getPlanType(userId) {
		const data = await this.findOneById(userId);
		return data ? data.planType : "Not a user";
	}

	async getSettings(userId) {
		const data = await this.findOneById(userId);
		return data ? data.settings : "Not a user";
	}

	async getTags(userId) {
		const data = await this.findOneById(userId);
		return data ? data.tags : "Not a user";
	}

	async hasTag(userId, tag) {
		const data = await this.findOneById(userId);
		return data ? data.tags.includes(tag) : false;
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
