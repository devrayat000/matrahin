import "server-only";
import { unstable_cache } from "next/cache";
import {
  GetCalculatorCountQuery,
  GetCalculatorsQuery,
  GetCalculatorsQueryVariables,
} from "~/generated/graphql";
import { gql, gqlClient } from "~/lib/utils";

const CALCULATORS_QUERY = gql`
  query GetCalculators($width: Int = 320, $height: Int = 180) {
    products {
      id
      title: name
      to: slug
      img: coverImage {
        src: url(
          transformation: {
            image: { resize: { height: $height, width: $width, fit: crop } }
          }
        )
        width
        height
      }
    }
  }
`;

export const getCalculators = unstable_cache(
  (variables?: GetCalculatorsQueryVariables) => {
    return gqlClient.request<GetCalculatorsQuery, GetCalculatorsQueryVariables>(
      CALCULATORS_QUERY,
      variables
    );
  },
  ["calculators"],
  { tags: ["calculators"] }
);

const CALCULATOR_COUNT_QUERY = gql`
  query GetCalculatorCount {
    productsConnection {
      aggregate {
        count
      }
    }
  }
`;

export const getCalculatorCount = unstable_cache(
  async () => {
    const { productsConnection } =
      await gqlClient.request<GetCalculatorCountQuery>(CALCULATOR_COUNT_QUERY);
    return productsConnection.aggregate.count;
  },
  ["calculatorCount", "calculators"],
  { tags: ["calculatorCount", "calculators"] }
);
