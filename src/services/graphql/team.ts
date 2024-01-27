import { gql } from "graphql-request";
import { unstable_cache } from "next/cache";
import type {
  GetTeamMembersQuery,
  GetTeamMembersQueryVariables,
} from "~/generated/graphql";
import { gqlClient } from "~/lib/utils";

const MEMBERS_QUERY = gql`
  query GetTeamMembers($width: Int = 320, $height: Int = 384) {
    members: teamMembers(orderBy: publishedAt_ASC) {
      id
      name
      designation
      image {
        src: url(
          transformation: {
            image: { resize: { fit: crop, width: $width, height: $height } }
          }
        )
        height
        width
      }
    }
  }
`;

export const getMembers = unstable_cache(
  async (params?: GetTeamMembersQueryVariables) => {
    const { members } = await gqlClient.request<
      GetTeamMembersQuery,
      GetTeamMembersQueryVariables
    >(MEMBERS_QUERY, params);
    return members;
  },
  ["members"],
  {
    tags: ["members"],
  }
);
