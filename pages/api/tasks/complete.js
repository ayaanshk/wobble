import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { supabase } from '../../../lib/supabase'
import { getTodaysTask } from '../../../lib/tasks'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = session.user.id
    const { notes } = req.body
    const today = new Date().toISOString().split('T')[0]

    // Check if already completed today
    const { data: existing } = await supabase
      .from('completions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed_date', today)
      .single()

    if (existing) {
      return res.status(400).json({ error: 'Task already completed today' })
    }

    // Get today's task
    const taskData = getTodaysTask(userId)

    // Record completion
    const { error: completionError } = await supabase
      .from('completions')
      .insert([
        {
          user_id: userId,
          task_title: taskData.task,
          task_category: taskData.category,
          completed_date: today,
          notes: notes || null,
        }
      ])

    if (completionError) {
      throw completionError
    }

    // Update streak
    const { data: streakData } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    let newCurrentStreak = 1
    let newLongestStreak = streakData?.longest_streak || 0

    if (streakData?.last_completed_date) {
      const lastCompleted = new Date(streakData.last_completed_date)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      lastCompleted.setHours(0, 0, 0, 0)

      // If they completed yesterday, continue streak
      if (lastCompleted.getTime() === yesterday.getTime()) {
        newCurrentStreak = (streakData.current_streak || 0) + 1
      }
      // If gap is more than 1 day, reset streak
      else if (lastCompleted.getTime() < yesterday.getTime()) {
        newCurrentStreak = 1
      }
    }

    // Update longest streak if needed
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak
    }

    // Update streak record
    const { error: streakError } = await supabase
      .from('streaks')
      .upsert([
        {
          user_id: userId,
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_completed_date: today,
          updated_at: new Date().toISOString(),
        }
      ])

    if (streakError) {
      console.error('Streak update error:', streakError)
    }

    res.status(200).json({
      success: true,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak
    })

  } catch (error) {
    console.error('Complete task API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}