import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ArrowLeftIcon, CalendarDaysIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline'
import { format, parseISO } from 'date-fns'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStreakData()
    }
  }, [session])

  const fetchStreakData = async () => {
    try {
      const response = await fetch('/api/streak')
      const data = await response.json()
      setStreak(data)
    } catch (error) {
      console.error('Error fetching streak data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wobble-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getCategoryColor = (category) => {
    const colors = {
      social_interaction: 'bg-blue-100 text-blue-800',
      phone_calls: 'bg-green-100 text-green-800',
      public_speaking: 'bg-purple-100 text-purple-800',
      self_advocacy: 'bg-red-100 text-red-800',
      digital_social: 'bg-indigo-100 text-indigo-800',
      workplace: 'bg-yellow-100 text-yellow-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-wobble-600 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-wobble-900">Profile</h1>
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-600 hover:text-red-600 text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-wobble-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {session.user.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{session.user.name}</h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {streak && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-wobble-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FireIcon className="w-6 h-6 text-wobble-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{streak.currentStreak}</p>
              <p className="text-gray-600">Current Streak</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrophyIcon className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{streak.longestStreak}</p>
              <p className="text-gray-600">Longest Streak</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CalendarDaysIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{streak.recentCompletions?.length || 0}</p>
              <p className="text-gray-600">Tasks Completed</p>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          
          {streak?.recentCompletions && streak.recentCompletions.length > 0 ? (
            <div className="space-y-3">
              {streak.recentCompletions.slice(0, 10).map((completion, index) => (
                <div
                  key={completion.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      {completion.task_title}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          completion.task_category
                        )}`}
                      >
                        {completion.task_category.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(parseISO(completion.completed_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {completion.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{completion.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No completed tasks yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                Complete your first daily challenge to see your progress here!
              </p>
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <div className="mt-8 card bg-gradient-to-r from-wobble-500 to-wobble-600 text-white">
          <h3 className="text-xl font-semibold mb-2">Keep Going! 🌟</h3>
          <p className="text-wobble-100">
            {streak?.currentStreak > 0 
              ? `You're on a ${streak.currentStreak}-day streak! Every challenge you complete builds your social confidence.`
              : "Ready to start your journey? Complete today's challenge to begin building your streak!"
            }
          </p>
        </div>
      </main>
    </div>
  )
}