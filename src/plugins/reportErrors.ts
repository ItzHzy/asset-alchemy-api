import { GraphQLRequestContext } from "apollo-server-types";
import Sentry from "@sentry/node";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
import {
	ApolloServerPlugin,
	GraphQLRequestListener,
} from "apollo-server-plugin-base";

dotenv.config();

Sentry.init({
	dsn: process.env.NODE_ENV == "production" ? process.env.SENTRY_DSN : "",
});

const reportErrors = {
	async requestDidStart(_: GraphQLRequestContext) {
		return {
			async didEncounterErrors(requestContext: GraphQLRequestContext) {
				// If operation can't be parsed, just return
				if (!requestContext.operation) return;
				if (process.env.NODE_ENV == "development") {
					console.log(requestContext.errors);
				}

				for (const error of requestContext.errors as GraphQLError[]) {
					Sentry.withScope((scope) => {
						// Annotate whether failing operation was query/mutation/subscription
						scope.setTag("kind", requestContext.operation?.operation);
						// Log query and variables as extras
						// (make sure to strip out sensitive data!)
						scope.setExtra("query", requestContext.request.query);
						scope.setExtra("variables", requestContext.request.variables);
						if (error.path) {
							// We can also add the path as breadcrumb
							scope.addBreadcrumb({
								category: "query-path",
								message: error.path?.join(" > "),
								level: Sentry.Severity.Debug,
							});
						}
						Sentry.captureException(error);
					});
				}
			},
		};
	},
};

export default reportErrors;
