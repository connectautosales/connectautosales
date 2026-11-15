import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const REMEMBER_FOR = 30 * 24 * 60 * 60 // 30 days, in seconds
const SHORT_SESSION = 12 * 60 * 60     // 12 hours, in seconds

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember me', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const rows = await prisma.$queryRaw`SELECT * FROM admin WHERE email = ${credentials.email} LIMIT 1`
        const admin = rows[0]

        if (!admin) return null

        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null

        const remember = credentials.remember !== 'false'
        return { id: admin.id, email: admin.email, name: admin.name, role: admin.role || 'admin', remember }
      },
    }),
  ],
  // The cookie lives for 30 days. "Remember me" keeps the admin signed in for
  // that long; without it the sign-in ends after SHORT_SESSION.
  session: { strategy: 'jwt', maxAge: REMEMBER_FOR, updateAge: 24 * 60 * 60 },
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.shortUntil = user.remember ? null : Math.floor(Date.now() / 1000) + SHORT_SESSION
      }
      if (token.shortUntil && Math.floor(Date.now() / 1000) > token.shortUntil) {
        return null
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
