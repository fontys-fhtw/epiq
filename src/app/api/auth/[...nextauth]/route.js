import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Replace this with your own user lookup logic
        const user = { id: 1, name: 'Test User', username: 'test', password: 'test' };

        if (credentials.username === user.username && credentials.password === user.password) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',  // Optional, customize your sign-in page
  },
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
