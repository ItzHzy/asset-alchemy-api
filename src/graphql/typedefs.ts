import { gql } from "apollo-server";

const typedefs = gql`
	scalar SafeInt
	scalar JSON

	type Query {
		searchCompanies(query: String): [Company]

		getCompanyInfo(ticker: String): Company

		getNews(ticker: String, userId: String): [News]

		getHistoricalPrices(
			ticker: String
			range: String
			interval: Int
		): [HistoricalPriceResult]

		getFollowing(userId: String): [Company]

		isFollowing(userId: String, ticker: String): Boolean

		getFeed(userId: String): [News]
	}

	type Mutation {
		followCompany(userId: String, ticker: String): Boolean
		unfollowCompany(userId: String, ticker: String): Boolean
	}

	type News {
		datetime: SafeInt
		headline: String
		related: [Company]
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
		reportingDates: [String]
	}

	type User {
		userId: String
		following: [String]
		planType: String
		settings: JSON
		tags: [String]
	}

	type HistoricalPriceResult {
		date: String
		close: Float
	}
`;

export default typedefs;
