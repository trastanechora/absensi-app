import { getServerSession, type NextAuthOptions } from "next-auth";
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
          include: {
            grade: {
              select: {
                level: true,
              }
            },
            divisions: {
              select: {
                id: true,
              }
            }
          }
				});

				token.role = user?.role;
				token.gradeLevel = user?.grade?.level;
				token.divisionIds = user?.divisions?.map(division => division.id);
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
        password: { label: "Password", type: "password" },
        deviceUA: { label: "UA", type: "text" }
      },
      async authorize(credentials) {
        const { email, password, deviceUA } = credentials ?? { }
        console.log('[debug] credentials', credentials);
        if (!email || !password) {
          throw new Error("Email atau password ada yang belum diisi");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
				});

        if (!user || !(await compare(password, user.password))) {
          throw new Error("Email atau password salah");
				}

        if (user.role !== 'admin') {
          const isLoggedIn = user.loggedIn;

          if (!isLoggedIn) {
            const updatedUser = await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                loggedIn: true
              },
            });

            return updatedUser;
          }

          if (deviceUA !== null && deviceUA !== user.id) {
            throw new Error("Anda hanya bisa masuk melalui satu perangkat yang sama");
          }
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

export const getServerAuthSession = () => getServerSession(authOptions);