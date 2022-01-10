import { gql } from "apollo-server-express";

// TODO: change all to accept null values
const typedefs = gql`
  scalar Date

  enum CatalystType {
    LEGAL
    RUMOR
    FINANCIAL
    ANNOUNCEMENT
    REGULATORY
  }

  type Delta {
    ticker: String!
    change: Float!
  }

  type Catalyst {
    timestamp: Date!
    type: CatalystType!
    title: String!
    deltas: [Delta!]!
  }

  type Company {
    name: String!
    ticker: String!
    description: String
    price: Float!
    change: Float!
    catalysts: [Catalyst]
  }

  type Query {
    # Queries on Companies
    company(ticker: String): Company

    # Queries on Catalysts
    catalyst(id: ID): Catalyst
    catalysts(ticker: String): [Catalyst]
  }
`;

export default typedefs;
