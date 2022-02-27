import {
	ChartRange,
	CompanyStatsResult,
	IncomeStatementResult,
	NewsResult,
} from "../datasources/IEX.js";
import {
	NotificationMethods,
	Condition,
	Alert,
} from "../datasources/Alerts.js";

interface ApolloContext {
	dataSources: any;
	userId: string;
}

interface Params {
	userId: string;
	query?: string;
	ticker?: string;
	range?: ChartRange;
	interval?: number;
	alertId?: string;
	ruleName?: string;
	symbol?: string;
	methods?: NotificationMethods;
	conditions?: Array<Condition>;
}

const resolvers = {
	Query: {
		searchCompanies: async (
			parent: string,
			{ query }: Params,
			{ dataSources }: ApolloContext
		) => {
			try {
				const tickers = await dataSources.IEXCloudAPI.getTickers(query);

				const data = tickers.filter(function (ticker: string) {
					return !ticker.includes("-") && !ticker.match(".*\\d.*");
				});
				return data;
			} catch (error) {}
		},
		getCompanyInfo: async (
			parent: string,
			{ ticker }: Params,
			ctx: ApolloContext
		) => {
			return ticker;
		},
		getNews: async (
			parent: string,
			{ ticker, userId }: Params,
			{ dataSources }: ApolloContext
		) => {
			const tickers = await dataSources.UserDataSource.getFollowing(userId);
			const data = await dataSources.IEXCloudAPI.getNews([ticker], tickers);

			return data;
		},
		getHistoricalPrices: async (
			parent: string,
			{ ticker, range, interval }: Params,
			{ dataSources }: ApolloContext
		) => {
			return dataSources.IEXCloudAPI.getHistoricalPrices(
				ticker,
				range,
				interval
			);
		},
		getFollowing: async (
			parent: string,
			{ userId }: { userId: string },
			{ dataSources }: ApolloContext
		) => {
			return dataSources.UserDataSource.getFollowing(userId);
		},
		isFollowing: async (
			parent: string,
			{ userId, ticker }: Params,
			{ dataSources }: ApolloContext
		) => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			return dataSources.UserDataSource.isFollowing(userId, ticker);
		},
		getFeed: async (parent: string, params: Params, ctx: ApolloContext) => {
			const tickers = await ctx.dataSources.UserDataSource.getFollowing(
				params.userId
			);
			return ctx.dataSources.IEXCloudAPI.getNews(tickers, tickers);
		},
		getAlert: async (_: any, params: Params, ctx: ApolloContext) => {
			if (params.alertId == "new") return;

			const data = await ctx.dataSources.AlertDataSource.findAlertById(
				params.alertId
			);
			return data;
		},
		listAlerts: async (_: any, params: Params, ctx: ApolloContext) => {
			const alerts = await ctx.dataSources.UserDataSource.getUserField(
				ctx.userId,
				"alerts"
			);
			return await ctx.dataSources.AlertDataSource.findManyAlertsById(alerts);
		},
	},
	Mutation: {
		followCompany: async (
			parent: string,
			{ userId, ticker }: Params,
			{ dataSources }: ApolloContext
		) => {
			return dataSources.UserDataSource.followCompany(userId, ticker);
		},
		unfollowCompany: async (
			parent: string,
			{ userId, ticker }: Params,
			{ dataSources }: ApolloContext
		) => {
			return dataSources.UserDataSource.unfollowCompany(userId, ticker);
		},
		createAlert: async (_: any, params: Params, ctx: ApolloContext) => {
			const ruleId = (
				await ctx.dataSources.IEXCloudAPI.createRule(
					params.ruleName,
					params.symbol,
					params.conditions
				)
			).id;

			await ctx.dataSources.UserDataSource.addAlert(ctx.userId, ruleId);

			await ctx.dataSources.AlertDataSource.addAlert(
				ctx.userId,
				ruleId,
				params.ruleName,
				params.symbol,
				params.methods,
				params.conditions
			);

			return true;
		},
		updateAlert: async (_: any, params: Params, ctx: ApolloContext) => {
			await ctx.dataSources.IEXCloudAPI.updateRule(
				params.alertId,
				params.ruleName,
				params.symbol,
				params.conditions
			);

			await ctx.dataSources.AlertDataSource.updateAlert(
				ctx.userId,
				params.alertId,
				params.ruleName,
				params.symbol,
				params.methods,
				params.conditions
			);

			return true;
		},
		deleteAlert: async (_: any, params: Params, ctx: ApolloContext) => {
			await ctx.dataSources.IEXCloudAPI.deleteRule(params.alertId);
			await ctx.dataSources.UserDataSource.removeAlert(params.alertId);
			await ctx.dataSources.AlertDataSource.deleteAlert(params.alertId);
			return true;
		},
	},
	Company: {
		ticker: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return parent;
		},
		name: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getBasicInfo(parent)).companyName;
		},
		logo: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return await dataSources.IEXCloudAPI.getLogo(parent);
		},
		description: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getBasicInfo(parent)).description;
		},
		price: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getQuote(parent)).latestPrice;
		},
		dailyDelta: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getQuote(parent)).changePercent;
		},
		revenue: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result: IncomeStatementResult) => result.totalRevenue
			);
		},
		netIncome: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result: IncomeStatementResult) => result.netIncome
			);
		},
		grossProfit: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result: IncomeStatementResult) => result.grossProfit
			);
		},
		operatingIncome: async (
			parent: string,
			{},
			{ dataSources }: ApolloContext
		) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result: IncomeStatementResult) => result.operatingIncome
			);
		},
		peRatio: async (parent: string, {}, { dataSources }: ApolloContext) => {
			return (
				(await dataSources.IEXCloudAPI.getBasicStats(
					parent
				)) as CompanyStatsResult
			).peRatio;
		},
		reportingDates: async (
			parent: string,
			{},
			{ dataSources }: ApolloContext
		) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result: IncomeStatementResult) => result.reportDate
			);
		},
	},
	News: {
		datetime: async (parent: NewsResult, {}, {}: ApolloContext) => {
			return parent.datetime;
		},
		headline: async (parent: NewsResult, {}, {}: ApolloContext) => {
			return parent.headline;
		},
		related: async (parent: NewsResult, {}, {}: ApolloContext) => {
			return parent.related
				.split(",")
				.filter((ticker) => !ticker.includes("-") && ticker != "");
		},
		sourceURL: async (parent: NewsResult, {}, {}: ApolloContext) => {
			return parent.url;
		},
		summary: async (parent: NewsResult, {}, {}: ApolloContext) => {
			return parent.summary;
		},
		source: async (parent: NewsResult, {}, {}: ApolloContext) => {
			return parent.source;
		},
	},
	Alert: {
		creator: async (parent: Alert, {}, {}: ApolloContext) => {
			return parent.creator;
		},
		name: async (parent: Alert, {}, {}: ApolloContext) => {
			return parent.ruleName;
		},
		alertId: async (parent: Alert, {}, {}: ApolloContext) => {
			return parent.alertId;
		},
		symbol: async (parent: Alert, {}, {}: ApolloContext) => {
			return parent.symbol;
		},
		methods: async (parent: Alert, {}, {}: ApolloContext) => {
			return parent.methods;
		},
		conditions: async (parent: Alert, {}, {}: ApolloContext) => {
			const data = parent.conditions.map((condition: any) => [
				condition.metric,
				condition.operator,
				condition.value,
			]);

			return data;
		},
	},
};

export default resolvers;
