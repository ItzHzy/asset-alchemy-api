import isTokenValid from "../helpers/validate.js";

const resolvers = {
	Query: {
		searchCompanies: async (parent, { query }, { dataSources, token }) => {
			const tickers = await dataSources.IEXCloudAPI.getTickers(query);

			console.log("staging1");
			const data = tickers.filter(function (ticker) {
				return !ticker.includes("-") && !ticker.match(".*\\d.*");
			});
			return data;
		},
		getCompanyInfo: async (parent, { ticker }, { token }) => {
			return ticker;
		},
		getNews: async (parent, { ticker }, { dataSources }) => {
			const data = await dataSources.IEXCloudAPI.getNews([ticker]);

			return data;
		},
		getHistoricalPrices: async (
			parent,
			{ ticker, range, interval },
			{ dataSources }
		) => {
			return dataSources.IEXCloudAPI.getHistoricalPrices(
				ticker,
				range,
				interval
			);
		},
		getFollowing: async (parent, { userId }, { dataSources }) => {
			return dataSources.UserDataSource.getFollowing(userId);
		},
		isFollowing: async (parent, { userId, ticker }, { dataSources }) => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			return dataSources.UserDataSource.isFollowing(userId, ticker);
		},
		getFeed: async (parent, { userId }, { dataSources }) => {
			const tickers = await dataSources.UserDataSource.getFollowing(userId);
			return dataSources.IEXCloudAPI.getNews(tickers);
		},
	},
	Mutation: {
		followCompany: async (parent, { userId, ticker }, { dataSources }) => {
			return dataSources.UserDataSource.followCompany(userId, ticker);
		},
		unfollowCompany: async (parent, { userId, ticker }, { dataSources }) => {
			return dataSources.UserDataSource.unfollowCompany(userId, ticker);
		},
	},
	Company: {
		ticker: async (parent, {}, { dataSources }) => {
			return parent;
		},
		name: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getBasicInfo(parent)).companyName;
		},
		logo: async (parent, {}, { dataSources }) => {
			return await dataSources.IEXCloudAPI.getLogo(parent);
		},
		description: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getBasicInfo(parent)).description;
		},
		price: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getQuote(parent)).latestPrice;
		},
		dailyDelta: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getQuote(parent)).changePercent;
		},
		revenue: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result) => result.totalRevenue
			);
		},
		netIncome: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result) => result.netIncome
			);
		},
		grossProfit: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result) => result.grossProfit
			);
		},
		operatingIncome: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result) => result.operatingIncome
			);
		},
		peRatio: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getBasicStats(parent)).peRatio;
		},
		reportingDates: async (parent, {}, { dataSources }) => {
			return (await dataSources.IEXCloudAPI.getIncomeStatement(parent)).map(
				(result) => result.reportDate
			);
		},
	},
	News: {
		datetime: async (parent, {}, { dataSources }) => {
			return parent.datetime;
		},
		headline: async (parent, {}, { dataSources }) => {
			return parent.headline;
		},
		related: async (parent, {}, { dataSources }) => {
			return parent.related
				.split(",")
				.filter((ticker) => !ticker.includes("-"));
		},
		sourceURL: async (parent, {}, { dataSources }) => {
			return parent.sourceURL;
		},
		summary: async (parent, {}, { dataSources }) => {
			return parent.summary;
		},
	},
};

export default resolvers;
