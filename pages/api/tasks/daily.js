import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { supabase } from '../../../lib/supabase'
import { getTodaysTask } from '../../../lib/tasks'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const userId = session.user.id
    const today = new Date().toISOString().split('T')[0]

    // Check if user has already completed today's task
    const { data: todayCompletion } = await supabase
      .from('completions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed_date', today)
      .single()

    // Get today's task
    const taskData = getTodaysTask(userId)

    res.status(200).json({
      task: taskData.task,
      category: taskData.category,
      completed: !!todayCompletion,
      completedAt: todayCompletion?.created_at || null
    })

  } catch (error) {
    console.error('Daily task API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}