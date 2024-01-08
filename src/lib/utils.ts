import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeRadian(degree: number) {
  return (degree * Math.PI) / 180;
}

export function makeDegree(radian: number) {
  return (radian * 180) / Math.PI;
}

export const gql = String.raw;

export class GQLClient {
  constructor(
    private readonly url: string,
    private readonly requestConfig?: RequestInit
  ) {}

  async request<T, V>(
    query: string,
    variables?: V,
    requestConfig?: RequestInit
  ) {
    const res = await fetch(this.url, {
      ...this.requestConfig,
      ...requestConfig,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.requestConfig?.headers,
        ...requestConfig?.headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    const { data, errors } = await res.json();
    if (errors) {
      throw new Error("Error occured", { cause: errors });
    }
    return data as T;
  }
}

export const gqlClient = new GQLClient(
  process.env.API_ENDPOINT || "http://localhost:3000/api/graphql",
  {
    headers: {
      authorization: `Bearer ${process.env.API_PUBLIC_KEY}`,
    },
  }
);
