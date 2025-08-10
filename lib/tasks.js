// Curated tasks for social anxiety help
export const TASKS = {
  social_interaction: [
    "Make eye contact and smile at a cashier today",
    "Ask someone 'How's your day going?' and listen to their response",
    "Compliment someone on their outfit, hairstyle, or something they're wearing",
    "Hold the door open for someone and make brief small talk",
    "Thank someone for their service (waiter, cashier, etc.) by name",
    "Ask for directions, even if you know the way",
    "Make a comment about the weather to someone waiting in line",
    "Wave hello to a neighbor",
    "Ask a coworker about their weekend plans",
    "Share a positive observation about your surroundings with someone nearby"
  ],
  phone_calls: [
    "Call a restaurant to ask about their hours",
    "Make a dentist or doctor appointment over the phone",
    "Call a store to check if they have an item in stock",
    "Order takeout by phone instead of using an app",
    "Call a friend or family member just to say hello",
    "Ask a business about their services over the phone",
    "Call to confirm an appointment",
    "Phone a local business to ask about their location"
  ],
  public_speaking: [
    "Ask a question in a group setting (meeting, class, etc.)",
    "Share your opinion when someone asks the group a question",
    "Introduce yourself to someone new in a group setting",
    "Volunteer to read something aloud if the opportunity arises",
    "Make a toast or brief speech at dinner",
    "Ask for help from a store employee",
    "Participate in a group discussion by adding one comment"
  ],
  self_advocacy: [
    "Send back food that isn't what you ordered",
    "Ask for a discount or deal politely",
    "Return an item to a store",
    "Ask for help when you're lost or confused",
    "Speak up when someone cuts in line",
    "Ask for a seat on public transportation if you need one",
    "Request a different table at a restaurant",
    "Ask to speak to a manager about a positive experience"
  ],
  digital_social: [
    "Comment on a friend's social media post with something meaningful",
    "Share something positive on your own social media",
    "Join an online community discussion",
    "Send a message to reconnect with an old friend",
    "Post a question in a community group",
    "Leave a positive review for a business you enjoyed",
    "Share an article or meme that made you laugh",
    "Respond to someone's story or post with encouragement"
  ],
  workplace: [
    "Suggest an idea in a meeting",
    "Ask a coworker to grab coffee or lunch",
    "Introduce yourself to someone new at work",
    "Volunteer for a project or task",
    "Ask for clarification on something you don't understand",
    "Compliment a colleague on their work",
    "Start a casual conversation in the break room",
    "Offer to help someone with a task"
  ]
}

export function getTodaysTask(userId, date = new Date()) {
  // Create a consistent but pseudo-random task selection based on user ID and date
  const dateString = date.toISOString().split('T')[0] // YYYY-MM-DD
  const seed = userId + dateString
  
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Get all tasks in a flat array with their categories
  const allTasks = []
  Object.entries(TASKS).forEach(([category, tasks]) => {
    tasks.forEach(task => {
      allTasks.push({ task, category })
    })
  })
  
  // Select task based on hash
  const taskIndex = Math.abs(hash) % allTasks.length
  return allTasks[taskIndex]
}