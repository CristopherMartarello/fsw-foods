//localhost:3000/auth/nextauth/
//[...nextauth] -> catch all segments

import NextAuth from "next-auth";
import { authOptions } from "@/app/_lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
