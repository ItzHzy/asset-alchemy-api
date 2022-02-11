import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import {
	ChartRange,
	CompanyStatsResult,
	IncomeStatementResult,
	NewsResult,
} from "../datasources/IEX.js";

interface ApolloContext {
	dataSources: any;
	token?: string;
}

interface QueryArgs {
	userId: string;
	query?: string;
	ticker?: string;
	range?: ChartRange;
	interval?: number;
}

const resolvers = {
	Query: {
		searchCompanies: async (
			parent: string,
			{ query }: QueryArgs,
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
			{ ticker }: QueryArgs,
			{ token }: ApolloContext
		) => {
			return ticker;
		},
		getNews: async (
			parent: string,
			{ ticker, userId }: QueryArgs,
			{ dataSources }: ApolloContext
		) => {
			const tickers = await dataSources.UserDataSource.getFollowing(userId);
			const data = await dataSources.IEXCloudAPI.getNews([ticker], tickers);

			return data;
		},
		getHistoricalPrices: async (
			parent: string,
			{ ticker, range, interval }: QueryArgs,
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
			{ userId, ticker }: QueryArgs,
			{ dataSources }: ApolloContext
		) => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			return dataSources.UserDataSource.isFollowing(userId, ticker);
		},
		getFeed: async (
			parent: string,
			{ userId }: QueryArgs,
			{ dataSources }: ApolloContext
		) => {
			const tickers = await dataSources.UserDataSource.getFollowing(userId);
			return dataSources.IEXCloudAPI.getNews(tickers, tickers);
		},
	},
	Mutation: {
		followCompany: async (
			parent: string,
			{ userId, ticker }: QueryArgs,
			{ dataSources }: ApolloContext
		) => {
			return dataSources.UserDataSource.followCompany(userId, ticker);
		},
		unfollowCompany: async (
			parent: string,
			{ userId, ticker }: QueryArgs,
			{ dataSources }: ApolloContext
		) => {
			return dataSources.UserDataSource.unfollowCompany(userId, ticker);
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
	},
};

export default resolvers;
