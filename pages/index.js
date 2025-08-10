import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CheckCircleIcon, FireIcon, UserCircleIcon } from '@heroicons/react/24/solid'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [task, setTask] = useState(null)
  const [streak, setStreak] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDailyTask()
      fetchStreak()
    }
  }, [session])

  const fetchDailyTask = async () => {
    try {
      const response = await fetch('/api/tasks/daily')
      const data = await response.json()
      setTask(data)
    } catch (error) {
      console.error('Error fetching daily task:', error)
    }
  }

  const fetchStreak = async () => {
    try {
      const response = await fetch('/api/streak')
      const data = await response.json()
      setStreak(data)
    } catch (error) {
      console.error('Error fetching streak:', error)
    }
  }

  const completeTask = async () => {
    if (task?.completed) return

    setCompleting(true)
    try {
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })

      if (response.ok) {
        const result = await response.json()
        setTask({ ...task, completed: true })
        setStreak({
          ...streak,
          currentStreak: result.currentStreak,
          longestStreak: result.longestStreak
        })
        setShowNotes(false)
        setNotes('')
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
    setCompleting(false)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wobble-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-wobble-900">Wobble</h1>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-gray-600 hover:text-wobble-600 transition-colors">
              <UserCircleIcon className="w-8 h-8" />
            </Link>
            <button
             onClick={() => signOut()}
             className="text-gray-600 hover:text-red-600 text-sm transition-colors"
           >
             Sign Out
           </button>
         </div>
       </div>
     </header>

     {/* Main Content */}
     <main className="max-w-4xl mx-auto px-4 py-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Daily Task Card */}
         <div className="md:col-span-2">
           <div className="card">
             <div className="flex items-start justify-between mb-4">
               <h2 className="text-xl font-semibold text-gray-900">Today's Challenge</h2>
               {task?.completed && (
                 <CheckCircleIcon className="w-6 h-6 text-green-500" />
               )}
             </div>
             
             {task ? (
               <div className="space-y-4">
                 <div className="p-4 bg-wobble-50 rounded-lg border border-wobble-100">
                   <p className="text-wobble-900 font-medium text-lg leading-relaxed">
                     {task.task}
                   </p>
                   <p className="text-wobble-600 text-sm mt-2 capitalize">
                     Category: {task.category.replace('_', ' ')}
                   </p>
                 </div>
                 
                 {!task.completed && (
                   <div className="space-y-3">
                     {!showNotes ? (
                       <div className="flex space-x-3">
                         <button
                           onClick={completeTask}
                           disabled={completing}
                           className="btn-primary flex-1"
                         >
                           {completing ? 'Completing...' : 'Mark Complete'}
                         </button>
                         <button
                           onClick={() => setShowNotes(true)}
                           className="btn-secondary"
                         >
                           Add Note
                         </button>
                       </div>
                     ) : (
                       <div className="space-y-3">
                         <textarea
                           value={notes}
                           onChange={(e) => setNotes(e.target.value)}
                           placeholder="How did it go? Any thoughts or reflections..."
                           className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-wobble-500 focus:border-transparent"
                           rows={3}
                         />
                         <div className="flex space-x-3">
                           <button
                             onClick={completeTask}
                             disabled={completing}
                             className="btn-primary flex-1"
                           >
                             {completing ? 'Completing...' : 'Complete with Note'}
                           </button>
                           <button
                             onClick={() => {
                               setShowNotes(false)
                               setNotes('')
                             }}
                             className="btn-secondary"
                           >
                             Cancel
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                 )}
                 
                 {task.completed && (
                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                     <div className="flex items-center">
                       <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                       <p className="text-green-700 font-medium">
                         Great job! You completed today's challenge.
                       </p>
                     </div>
                     <p className="text-green-600 text-sm mt-1">
                       Come back tomorrow for a new challenge!
                     </p>
                   </div>
                 )}
               </div>
             ) : (
               <div className="animate-pulse">
                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
               </div>
             )}
           </div>
         </div>

         {/* Streak Card */}
         <div className="space-y-6">
           <div className="card text-center">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Streak</h3>
             {streak ? (
               <div className="space-y-4">
                 <div className="streak-circle mx-auto">
                   {streak.currentStreak}
                 </div>
                 <div>
                   <p className="text-2xl font-bold text-gray-900">{streak.currentStreak}</p>
                   <p className="text-gray-600">days in a row</p>
                 </div>
                 
                 {streak.longestStreak > 0 && (
                   <div className="pt-4 border-t border-gray-100">
                     <div className="flex items-center justify-center text-amber-600">
                       <FireIcon className="w-5 h-5 mr-1" />
                       <span className="font-medium">Best: {streak.longestStreak} days</span>
                     </div>
                   </div>
                 )}
               </div>
             ) : (
               <div className="animate-pulse">
                 <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                 <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
               </div>
             )}
           </div>

           {/* Quick Stats */}
           {streak && (
             <div className="card">
               <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h3>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Total completed:</span>
                   <span className="font-medium">{streak.recentCompletions?.length || 0}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Longest streak:</span>
                   <span className="font-medium">{streak.longestStreak}</span>
                 </div>
                 {streak.lastCompleted && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Last completed:</span>
                     <span className="font-medium">
                       {new Date(streak.lastCompleted).toLocaleDateString()}
                     </span>
                   </div>
                 )}
               </div>
             </div>
           )}
         </div>
       </div>

       {/* Motivational Section */}
       <div className="mt-8 card bg-gradient-to-r from-wobble-500 to-wobble-600 text-white">
         <h3 className="text-xl font-semibold mb-2">Remember</h3>
         <p className="text-wobble-100">
           Every small step counts. Social anxiety gets easier with practice. 
           You're building confidence one challenge at a time! 🌟
         </p>
       </div>
     </main>
   </div>
 )
}