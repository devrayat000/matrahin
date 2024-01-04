import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { TransactionCheck } from "../types/AccessCode";
import { Student } from "../types/Student";
import { gql, gqlClient } from "../utils";
import {
  CreateStudentMutation,
  CreateStudentMutationVariables,
  FindStudentQuery,
  FindStudentQueryVariables,
  PublishStudentMutation,
  PublishStudentMutationVariables,
} from "~/generated/graphql";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authConfig = {
  providers: [
    CredentialsProvider({
      id: "access_code",
      credentials: {
        tran_id: { label: "Transaction ID", type: "text" },
      },
      async authorize(credentials) {
        const res = await fetch(
          "https://shop.aparsclassroom.com/query/transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );
        if (!res.ok) {
          return null;
        }

        const data = (await res.json()) as TransactionCheck;
        if ("no_of_trans_found" in data) {
          return null;
        }
        if (data.tranx.status !== "VALID") {
          return null;
        }

        const user = {
          name: data.tranx.Name,
          email: data.tranx.Email,
          phone: data.tranx.Phone,
          institution: data.tranx.Institution,
          hscYear: data.tranx.HSC,
        };
        await findOrCreateUser(user);

        return {
          id: data.tranx.uid,
          ...user,
        };
      },
    }),
  ], // rest of your config
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(): Promise<Session>;
export function auth(
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"]
): Promise<Session>;
export function auth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session>;
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig);
}

export async function findOrCreateUser(params: Student) {
  const student = await findStudent(params.email);
  console.log({ student });

  if (!student) {
    await createStudent(params);
  }
}

const FIND_STUDENT = gql`
  query FindStudent($email: String!) {
    student(where: { email: $email }) {
      id
      name
      email
      phone
      institution
      hscYear
    }
  }
`;

export async function findStudent(email: string) {
  console.log("okay");
  const { student } = await gqlClient.request<
    FindStudentQuery,
    FindStudentQueryVariables
  >(FIND_STUDENT, { email });
  console.log("finding...");

  return student;
}

const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentCreateInput!) {
    createStudent(data: $input) {
      id
    }
  }
`;

const PUBLISH_STUDENT = gql`
  mutation PublishStudent($id: ID!) {
    publishStudent(where: { id: $id }) {
      id
    }
  }
`;

async function createStudent(params: Student) {
  const {
    createStudent: { id },
  } = await gqlClient.request<
    CreateStudentMutation,
    CreateStudentMutationVariables
  >(CREATE_STUDENT, { input: params });
  console.log("creating...");
  console.log(id);

  await gqlClient.request<
    PublishStudentMutation,
    PublishStudentMutationVariables
  >(PUBLISH_STUDENT, { id });
}
