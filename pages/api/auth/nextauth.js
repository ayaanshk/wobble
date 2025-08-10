import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from '../../../lib/supabase'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          // Check if user exists in our database
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', user.id)
            .single()

          if (!existingUser) {
            // Create new user
            const { data: newUser, error: userError } = await supabase
              .from('users')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  google_id: user.id,
                }
              ])
              .select()
              .single()

            if (userError) {
              console.error('Error creating user:', userError)
              return false
            }

            // Create initial streak record
            const { error: streakError } = await supabase
              .from('streaks')
              .insert([
                {
                  user_id: newUser.id,
                  current_streak: 0,
                  longest_streak: 0,
                }
              ])

            if (streakError) {
              console.error('Error creating streak record:', streakError)
            }
          }

          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      // Get user ID from database
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('google_id', token.sub)
        .single()

      if (user) {
        session.user.id = user.id
      }

      return session
    },
    async jwt({ token, user, account }) {
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export default NextAuth(authOptions)