import {
  GetAccessCodesQuery,
  GetAccessCodesQueryVariables,
} from "~/generated/graphql";
import { gql, gqlClient } from "~/lib/utils";

const ACCESS_CODE_QUERY = gql`
  query GetAccessCodes {
    accessCodes {
      code
    }
  }
`;

function getAccessCodes() {
  return gqlClient.request<GetAccessCodesQuery, GetAccessCodesQueryVariables>(
    ACCESS_CODE_QUERY
  );
}

export async function verifyProductKey(key: string) {
  const { accessCodes } = await getAccessCodes();
  const isValid = accessCodes.map((c) => c.code).includes(key);
  if (!isValid) {
    throw new Error("Invalid product. Please contact support.");
  }
}
