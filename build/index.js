import dotenv from "dotenv";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer, AuthenticationError } from "apollo-server";
import resolvers from "./graphql/resolvers.js";
import typeDefs from "./graphql/typedefs.js";
import IEXCloudAPI from "./datasources/IEX.js";
import ClearbitAPI from "./datasources/Clearbit.js";
import { UserDataSource, usersCollection } from "./datasources/Firestore.js";
import isTokenValid from "./helpers/validate.js";
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
        ClearbitAPI: new ClearbitAPI(),
    }),
    context: ({ req }) => {
        const token = req.headers.authorization;
        const isValid = isTokenValid(token);
        if (!isValid) {
            throw new AuthenticationError("Invalid Access Token");
        }
        return {
            IEX_API_KEY: process.env.IEX_API_KEY,
            CLEARBIT_API_KEY: process.env.CLEARBIT_API_KEY,
            token: token,
        };
    },
});
apolloServer.listen(process.env.PORT).then(({ url }) => {
    console.log(`🚀  GraphQL server running at port: ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map