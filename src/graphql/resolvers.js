import { SuperAgent } from "superagent";
import { findOne } from "../datasourses/firestore.js";

//TODO: implement api and database calls with dataloaders
const resolvers = {
  Query: {
    company: async (parent, args, context) => {
      const data = await findOne(
        context.database,
        "companies",
        "ticker",
        "==",
        args.ticker
      );

      if (data.description === null) {
        var v = await SuperAgent.get("https://www.alphavantage.co/query")
          .query({
            apikey: process.env.ALPHA_VANTAGE_API_KEY,
            function: "OVERVIEW",
            symbol: args.ticker,
          })
          .then((res) => {});
      }

      return {
        name: data.name,
        ticker: data.ticker,
        description: "a really long description",
        price: 100.0,
        change: 24.0,
        catalysts: [],
      };
    },
    catalyst: async (parent, args, context) => {
      return {};
    },
    catalysts: async (parent, args, context) => {
      return [];
    },
  },
};

export default resolvers;
