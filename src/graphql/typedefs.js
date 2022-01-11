import { gql } from "apollo-server-express";

// TODO: change all to accept null values
const typedefs = gql`
	scalar SafeInt
	scalar JSON

	type News {
		datetime: SafeInt
		headline: String
		tickers: [String]
		sourceURL: String
		summary: String
	}

	type Company {
		name: String
		ticker: String
		logo: String
		description: String
		price: Float
		dailyDelta: Float
		revenue: [SafeInt]
		netIncome: SafeInt
		grossProfit: SafeInt
		operatingIncome: SafeInt
		peRatio: Float
	}

	type Query {
		searchTickers(query: String): [JSON]

		company(ticker: String): Company

		news(ticker: String, from: String, to: String): [News]

		historicalPrices(ticker: String, range: String): [Float]
	}
`;

export default typedefs;
