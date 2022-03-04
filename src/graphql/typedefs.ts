import { gql } from "apollo-server";
import { GraphQLScalarType } from "graphql";

const Any = new GraphQLScalarType({
	name: "Any",
	description: "String, Int, or Float",
	serialize(value) {
		return value;
	},
	parseValue(value) {
		return value;
	},
	parseLiteral(value) {
		return value;
	},
});

const typedefs = gql`
	scalar SafeInt
	scalar JSON
	scalar Any

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

		getAlert(alertId: String): Alert

		listAlerts: [Alert]
	}

	type Mutation {
		followCompany(userId: String, ticker: String): Boolean

		unfollowCompany(userId: String, ticker: String): Boolean

		createAlert(
			ruleName: String
			symbol: String
			methods: JSON
			conditions: [[Any]]
		): String

		updateAlert(
			alertId: String
			ruleName: String
			symbol: String
			methods: JSON
			conditions: [[Any]]
		): Boolean

		deleteAlert(alertId: String): Boolean
	}

	type News {
		datetime: SafeInt
		headline: String
		related: [Company]
		sourceURL: String
		summary: String
		source: String
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

	type Alert {
		creator: String
		name: String
		alertId: String
		symbol: Company
		methods: JSON
		conditions: [[Any]]
	}
`;

export default typedefs;
