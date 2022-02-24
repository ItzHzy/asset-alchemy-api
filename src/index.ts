import dotenv from "dotenv";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloError, ApolloServer, AuthenticationError } from "apollo-server";
import resolvers from "./graphql/resolvers.js";
import typeDefs from "./graphql/typedefs.js";
import IEXCloudAPI from "./datasources/IEX.js";
import { UserDataSource, usersCollection } from "./datasources/UserStore.js";
import validateToken, { getUserId } from "./plugins/validateToken.js";
import reportErrors from "./plugins/reportErrors.js";
import { AlertDataSource, alertsCollection } from "./datasources/Alerts.js";

dotenv.config();

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const apolloServer = new ApolloServer({
	schema,
	dataSources: () => ({
		IEXCloudAPI: new IEXCloudAPI(),
		UserDataSource: new UserDataSource(usersCollection),
		AlertDataSource: new AlertDataSource(alertsCollection),
	}),
	context: async ({ req }) => ({
		IEX_API_KEY: process.env.IEX_API_KEY,
		CLEARBIT_API_KEY: process.env.CLEARBIT_API_KEY,
		userId: getUserId(req.headers.authorization as string),
	}),
	plugins: [validateToken, reportErrors],
});

apolloServer.listen(process.env.PORT).then(({ url }) => {
	console.log(`🚀  GraphQL server running at port: ${process.env.PORT}`);
});
