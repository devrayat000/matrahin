"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import {
  CreateHistoryMutation,
  CreateHistoryMutationVariables,
  GetHistoriesQuery,
  GetHistoriesQueryVariables,
  PublishHistoryMutation,
  PublishHistoryMutationVariables,
} from "~/generated/graphql";
import { auth } from "~/lib/auth";
import { gqlClient, gql } from "~/lib/utils";
import { findStudent } from "./user";

const CREATE_HISTORY = gql`
  mutation CreateHistory($pathname: String!, $studentId: ID!) {
    createHistory(
      data: { pathname: $pathname, student: { connect: { id: $studentId } } }
    ) {
      id
    }
  }
`;

const PUBLISH_HISTORY = gql`
  mutation PublishHistory($id: ID!) {
    publishHistory(to: PUBLISHED, where: { id: $id }) {
      id
    }
  }
`;

export async function publishHistory(pathname: string) {
  const session = await auth();
  const student = await findStudent(session.user.email);
  const {
    createHistory: { id },
  } = await gqlClient.request<
    CreateHistoryMutation,
    CreateHistoryMutationVariables
  >(CREATE_HISTORY, {
    pathname,
    studentId: student.id,
  });
  await gqlClient.request<
    PublishHistoryMutation,
    PublishHistoryMutationVariables
  >(PUBLISH_HISTORY, { id });
  revalidateTag("histories");
}

const GET_HISTORIES = gql`
  query GetHistories($studentId: ID!) {
    histories(orderBy: createdAt_DESC, where: { student: { id: $studentId } }) {
      id
      pathname
      createdAt
    }
  }
`;

export const getHistories = async () => {
  const session = await auth();
  const student = await findStudent(session.user.email);
  const { histories } = await gqlClient.request<
    GetHistoriesQuery,
    GetHistoriesQueryVariables
  >(GET_HISTORIES, { studentId: student.id });
  return histories;
};
