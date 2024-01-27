import { gql } from "graphql-request";
import { unstable_cache } from "next/cache";
import {
  GetExampleCountQuery,
  GetExamplesQuery,
  GetExamplesQueryVariables,
} from "~/generated/graphql";
import { gqlClient } from "~/lib/utils";

const EXAMPLES_QUERY = gql`
  query GetExamples($slug: String!) {
    product(where: { slug: $slug }) {
      name
      tutorial
      examples {
        id
        source
        question {
          src: url
        }
        answers {
          src: url
        }
      }
    }
  }
`;

export const getExamples = unstable_cache(
  (variables: { slug: string }) => {
    return gqlClient.request<GetExamplesQuery, GetExamplesQueryVariables>(
      EXAMPLES_QUERY,
      variables
    );
  },
  ["examples"],
  { tags: ["examples"] }
);

const EXAMPLE_COUNT_QUERY = gql`
  query GetExampleCount {
    examplesConnection {
      aggregate {
        count
      }
    }
  }
`;

export const getExampleCount = unstable_cache(
  async () => {
    const { examplesConnection } =
      await gqlClient.request<GetExampleCountQuery>(EXAMPLE_COUNT_QUERY);
    return examplesConnection.aggregate.count;
  },
  ["exampleCount", "examples"],
  { tags: ["exampleCount", "examples"] }
);
