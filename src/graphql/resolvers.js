//TODO: implement api and database calls with dataloaders
const resolvers = {
	Query: {
		searchTickers: async (parent, { query }, { dataSources }) => {
			return dataSources.IEXCloudAPI.getTickers(query);
		},
		company: async (parent, { ticker }, context) => {
			return {
				ticker: ticker,
			};
		},
		news: async (parent, { ticker, from, to }, { dataSources }) => {
			const data = await dataSources.IEXCloudAPI.getNews(ticker, from, to);

			return data.map((result) => ({
				datetime: result.datetime,
				headline: result.headline,
				tickers: result.related.split(","),
				sourceURL: result.qmUrl,
				summary: result.summary,
			}));
		},
		historicalPrices: async (parent, { ticker, range }, { dataSources }) => {
			return dataSources.IEXCloudAPI.getHistoricalPrices(ticker, range);
		},
	},
	Company: {
		name: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getName(parent.ticker);
		},
		ticker: async (parent, {}, { dataSources }) => {
			return parent.ticker;
		},
		logo: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getLogo(parent.ticker);
		},
		description: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getDescription(parent.ticker);
		},
		price: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getPrice(parent.ticker);
		},
		dailyDelta: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getDailyDelta(parent.ticker);
		},
		revenue: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getRevenue(parent.ticker);
		},
		netIncome: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getNetIncome(parent.ticker);
		},
		grossProfit: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getGrossProfit(parent.ticker);
		},
		operatingIncome: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getOperatingIncome(parent.ticker);
		},
		peRatio: async (parent, {}, { dataSources }) => {
			return dataSources.IEXCloudAPI.getPERatio(parent.ticker);
		},
	},
};

export default resolvers;
