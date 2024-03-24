import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
	session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) { 
      if(account && account.type === "credentials") {
        token.userId = account.providerAccountId;
				
				const user = await prisma.user.findUnique({
					where: {
						id: token.userId as unknown as string || '',
					},
				});

				token.role = user?.role;
			}
			
      return token;
    },
    async session({ session, token }) {
			session.user.id = token.userId as unknown as string || '';
			const user = await prisma.user.findUnique({
				where: {
					id: session.user.id,
				},
			});

			session.user.role = user?.role || '';

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? { }
        if (!email || !password) {
          throw new Error("Missing username or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
				});

        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid username or password");
				}

        return user;
      },
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
		})
  ],
};

const handler = NextAuth(authOptions);

export const getServerAuthSession = () => getServerSession(authOptions);
export { handler as GET, handler as POST };