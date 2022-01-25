import isTokenValid from "../helpers/validate.js";

const resolvers = {
	Query: {
		searchCompanies: async (parent, { query }, { dataSources, token }) => {
			const tickers = await dataSources.IEXCloudAPI.getTickers(query);

			console.log("staging");
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
		name: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getName(parent);
		},
		ticker: async (parent, {}, { dataSources }) => {
			return parent;
		},
		logo: async (parent, {}, { dataSources }) => {
			return await dataSources.IEXCloudAPI.getLogo(parent);

			// return dataSources.ClearbitAPI.getLogo(name);
		},
		description: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getDescription(parent);
		},
		price: async (parent, {}, { dataSources }) => {
			let data;
			try {
				data = await dataSources.IEXCloudAPI.getPrice(parent);
			} catch {
				return null;
			}

			return data;
		},
		dailyDelta: async (parent, {}, { dataSources }) => {
			let data;
			try {
				data = await dataSources.IEXCloudAPI.getDailyDelta(parent);
			} catch {
				return null;
			}
			return data;
		},
		revenue: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getRevenue(parent);
		},
		netIncome: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getNetIncome(parent);
		},
		grossProfit: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getGrossProfit(parent);
		},
		operatingIncome: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getOperatingIncome(parent);
		},
		peRatio: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getPERatio(parent);
		},
		reportingDates: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getReportingDates(parent);
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
