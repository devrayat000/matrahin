import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";
import { revalidateTag, unstable_cache } from "next/cache";

import { TransactionCheck } from "../types/AccessCode";
import { findOrCreateUser, verifyProductKey } from "~/services/graphql/user";

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

        await verifyProductKey(data.tranx.Product.productName);

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
    signIn(message) {
      console.log(message);
      revalidateTag("login");
    },
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

export const auth: Auth = (
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
};
