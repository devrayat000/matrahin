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
import { getSession as getAuthSession } from "next-auth/react";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";

export const getSession = unstable_cache(getAuthSession, ["login"], {
  tags: ["login"],
});

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
          throw new Error("No valid transactions found!");
        }
        if (data.tranx.status !== "VALID") {
          throw new Error("No valid transactions found!");
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
  pages: {
    error: "/login",
  },
  events: {
    signOut(message) {
      console.log(message);
      revalidateTag("login");
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
interface Auth {
  (): Promise<Session>;
  (
    req: GetServerSidePropsContext["req"],
    res: GetServerSidePropsContext["res"]
  ): Promise<Session>;
  (req: NextApiRequest, res: NextApiResponse): Promise<Session>;
}

export const auth: Auth = unstable_cache(
  (
    ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
  ) => {
    if (typeof window !== "undefined") {
      return getSession({ req: args[0] });
    } else {
      return getServerSession(...args, authConfig);
    }
  },
  ["login"],
  { tags: ["login"] }
);

export async function findOrCreateUser(params: Student) {
  try {
    const student = await findStudent(params.email);

    if (!student) {
      await createStudent(params);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error loging in! Please contact support.");
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

export const findStudent = cache(async (email: string) => {
  console.log("okay");
  const { student } = await gqlClient.request<
    FindStudentQuery,
    FindStudentQueryVariables
  >(
    FIND_STUDENT,
    { email },
    { cache: "force-cache", next: { tags: ["login"] } }
  );
  console.log("finding...");
  console.log({ student });

  return student;
});

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
