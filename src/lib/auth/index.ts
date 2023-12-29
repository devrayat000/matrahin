import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { TransactionCheck } from "../types/AccessCode";

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

        return {
          id: data.tranx.uid,
          name: data.tranx.Name,
          email: data.tranx.Email,
          sessionkey: data.tranx.sessionkey,
          tranId: data.tranx.tran_id,
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
