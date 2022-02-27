import { FirestoreDataSource } from "apollo-datasource-firestore";
import {
	Firestore,
	FieldValue,
	CollectionReference,
	DocumentData,
} from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

export interface AlertDoc extends DocumentData {
	readonly id: string;
	readonly collection: string;
}

export interface NotificationMethods {
	email: boolean;
}

export type Condition = Array<string>;

export interface Alert {
	alertId: string;
	ruleName: string;
	symbol: string;
	methods: NotificationMethods;
	conditions: Array<Condition>;
	creator: string;
}

const firestore = new Firestore({
	projectId: process.env.PROJECT_ID,
});

export const alertsCollection: CollectionReference<AlertDoc> =
	firestore.collection("alerts") as CollectionReference<AlertDoc>;

export class AlertDataSource extends FirestoreDataSource<AlertDoc, Object> {
	async findAlertById(alertId: string): Promise<Alert> {
		return this.findOneById(alertId) as any;
	}

	async findManyAlertsById(alertIds: Array<string>): Promise<Array<Alert>> {
		return this.findManyByIds(alertIds) as any;
	}

	async addAlert(
		userId: string,
		ruleId: string,
		ruleName: string,
		symbol: string,
		methods: NotificationMethods,
		conditions: Array<Condition>
	): Promise<void> {
		const unnestedConditions = conditions.map((condition) => ({
			metric: condition[0],
			operator: condition[1],
			value: condition[2],
		}));
		this.createOne({
			id: ruleId,
			alertId: ruleId,
			creator: userId,
			ruleName: ruleName,
			symbol: symbol,
			methods: methods,
			conditions: unnestedConditions,
		});
	}

	async updateAlert(
		userId: string,
		ruleId: string,
		ruleName: string,
		symbol: string,
		methods: NotificationMethods,
		conditions: Array<Condition>
	): Promise<void> {
		const unnestedConditions = conditions.map((condition) => ({
			metric: condition[0],
			operator: condition[1],
			value: condition[2],
		}));

		this.updateOnePartial(ruleId, {
			id: ruleId,
			creator: userId,
			ruleName: ruleName,
			symbol: symbol,
			methods: methods,
			conditions: unnestedConditions,
		});
	}

	async deleteAlert(ruleId: string): Promise<void> {
		this.deleteOne(ruleId);
	}
}
