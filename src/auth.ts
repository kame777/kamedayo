import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.githubUsername = (profile as { login: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { githubUsername?: string }).githubUsername =
        token.githubUsername as string | undefined;
      return session;
    },
  },
});
