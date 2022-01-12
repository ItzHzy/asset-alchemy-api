import dotenv from "dotenv";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import resolvers from "./graphql/resolvers.js";
import typeDefs from "./graphql/typedefs.js";
import IEXCloudAPI from "./datasourses/IEX.js";

dotenv.config();

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const apolloServer = new ApolloServer({
	schema,
	playground: process.env.NODE_ENV === "development",
	dataSources: () => ({
		IEXCloudAPI: new IEXCloudAPI(),
	}),
	context: ({ req }) => ({
		IEX_API_KEY: process.env.IEX_API_KEY,
	}),
});

apolloServer.listen(process.env.PORT).then(({ url }) => {
	console.log(`🚀  GraphQL server running at port: ${process.env.PORT}`);
});
