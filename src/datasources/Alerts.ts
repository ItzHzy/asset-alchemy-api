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

export interface RuleAlert {
	ruleId: string;
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
	async findAlertById(alertId: string): Promise<RuleAlert> {
		return this.findOneById(alertId) as any;
	}

	async findManyAlertsById(alertIds: Array<string>): Promise<Array<RuleAlert>> {
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
		this.createOne({
			id: ruleId,
			creator: userId,
			ruleName: ruleName,
			symbol: symbol,
			methods: methods,
			conditions: conditions,
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
		this.updateOnePartial(ruleId, {
			id: ruleId,
			creator: userId,
			ruleName: ruleName,
			symbol: symbol,
			methods: methods,
			conditions: conditions,
		});
	}

	async deleteAlert(ruleId: string): Promise<void> {
		this.deleteOne(ruleId);
	}
}
