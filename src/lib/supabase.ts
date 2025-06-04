
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzvehfhhgoymyebernzn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dmVoZmhoZ295bXllYmVybnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0Mjg2ODMsImV4cCI6MjA1NTAwNDY4M30.5i79rVe_BTC2lTVtWOdkxVOtd6EZb5ufQHhQqymMRwM'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface PredictionSession {
  id?: string
  drawing_base64: string
  prediction: number
  confidence: number
  user_feedback: boolean | null
  correct_digit?: number  // Added field for storing the correct digit when prediction is wrong
  created_at?: string
}

// Note: If using manual table creation, add this column to your digit_prediction_sessions table:
// ALTER TABLE digit_prediction_sessions ADD COLUMN correct_digit INTEGER;
