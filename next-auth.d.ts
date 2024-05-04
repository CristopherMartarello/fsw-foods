import { DefaultSession } from "next-auth";

/* eslint-disable no-unused-vars */
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}
