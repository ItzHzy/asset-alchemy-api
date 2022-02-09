import { FirestoreDataSource } from "apollo-datasource-firestore";
import {
	Firestore,
	FieldValue,
	CollectionReference,
	DocumentData,
} from "@google-cloud/firestore";
import dotenv from "dotenv";
import { IncomingHttpHeaders } from "http";

export interface UserDoc extends DocumentData {
	readonly id: string;
	readonly collection: string;
}

export interface Context {
	headers: IncomingHttpHeaders;
	req: Request;
	res: Response;
	dataSources: Object;
}

dotenv.config();

const firestore = new Firestore({
	projectId: process.env.PROJECT_ID,
});

export const usersCollection: CollectionReference<UserDoc> =
	firestore.collection(
		process.env.USER_COLLECTION as string
	) as CollectionReference<UserDoc>;

export class UserDataSource extends FirestoreDataSource<UserDoc, Object> {
	async findUserById(userId: string) {
		return this.findOneById(userId);
	}

	async getFollowing(userId: string): Promise<string[]> {
		const data = await this.findOneById(userId);
		return data ? data.following : [];
	}

	async isFollowing(userId: string, ticker: string): Promise<boolean> {
		const data = await this.findOneById(userId, {
			ttl: 0,
		});
		return data ? data.following.includes(ticker) : false;
	}

	async getPlanType(userId: string): Promise<string> {
		const data = await this.findOneById(userId);
		return data ? data.planType : "Not a user";
	}

	async getSettings(userId: string): Promise<Object> {
		const data = await this.findOneById(userId);
		return data ? data.settings : "Not a user";
	}

	async getTags(userId: string): Promise<string[]> {
		const data = await this.findOneById(userId);
		return data ? data.tags : "Not a user";
	}

	async hasTag(userId: string, tag: string): Promise<boolean> {
		const data = await this.findOneById(userId);
		return data ? data.tags.includes(tag) : false;
	}

	async addTag(userId: string, tag: string): Promise<void> {
		const data: Array<string> = await this.getTags(userId);
		data.push(tag);
		this.updateOnePartial(userId, { tags: data });
	}

	async followCompany(userId: string, ticker: string): Promise<void> {
		await this.updateOnePartial(userId, {
			following: FieldValue.arrayUnion(ticker),
		});
	}

	async unfollowCompany(userId: string, ticker: string): Promise<void> {
		await this.updateOnePartial(userId, {
			following: FieldValue.arrayRemove(ticker),
		});
	}
}
