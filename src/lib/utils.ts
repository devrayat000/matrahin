import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GraphQLClient, gql } from "graphql-request";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeRadian(degree: number) {
  return (degree * Math.PI) / 180;
}

export function makeDegree(radian: number) {
  return (radian * 180) / Math.PI;
}

export { gql };

export const gqlClient = new GraphQLClient(
  process.env.API_ENDPOINT || "http://localhost:3000/api/graphql",
  {
    headers: {
      authorization: `Bearer ${process.env.API_PUBLIC_KEY}`,
    },
    fetch,
  }
);
