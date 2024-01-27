import { gql } from "graphql-request";
import { unstable_cache } from "next/cache";
import { GetCountsQuery } from "~/generated/graphql";
import { gqlClient } from "~/lib/utils";

const COUNT_QUERY = gql`
  query GetCounts {
    studentsConnection {
      aggregate {
        count
      }
    }
    examplesConnection {
      aggregate {
        count
      }
    }
    productsConnection {
      aggregate {
        count
      }
    }
  }
`;

export const getCounts = unstable_cache(
  async () => {
    const { studentsConnection, examplesConnection, productsConnection } =
      await gqlClient.request<GetCountsQuery>(COUNT_QUERY);
    return {
      students: studentsConnection.aggregate.count,
      examples: examplesConnection.aggregate.count,
      calculators: productsConnection.aggregate.count,
    };
  },
  ["calculatorCount", "studentsCount", "exampleCount"],
  { tags: ["calculatorCount", "studentsCount", "exampleCount"] }
);
