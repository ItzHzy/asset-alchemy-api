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
	firestore.collection("users") as CollectionReference<UserDoc>;

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

	async getSettings(userId: string): Promise<Object> {
		const data = await this.findOneById(userId);
		return data ? data.settings : "Not a user";
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

	async updateUserPrimitiveField(
		userId: string,
		field: string,
		value: any
	): Promise<void> {
		let data: any = {};
		data[field] = value;
		await this.updateOnePartial(userId, data);
	}

	async addAlert(userId: string, alertId: string): Promise<void> {
		await this.updateOnePartial(userId, {
			alerts: FieldValue.arrayUnion(alertId),
		});
	}

	async removeAlert(userId: string, alertId: string): Promise<void> {
		await this.updateOnePartial(userId, {
			alerts: FieldValue.arrayRemove(alertId),
		});
	}

	async getUserField(userId: string, field: string): Promise<any> {
		return ((await this.findOneById(userId)) as any)[field];
	}
}
