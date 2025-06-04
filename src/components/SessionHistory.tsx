
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase, PredictionSession } from '@/lib/supabase'
import { History, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const SessionHistory: React.FC = () => {
  const [sessions, setSessions] = useState<PredictionSession[]>([])
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('digit_prediction_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch session history",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isExpanded) {
      fetchSessions()
    }
  }, [isExpanded])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isExpanded) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Session History</span>
            </span>
            <Button onClick={() => setIsExpanded(true)} variant="outline" size="sm">
              View History
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Recent Sessions</span>
          </span>
          <Button onClick={() => setIsExpanded(false)} variant="outline" size="sm">
            Collapse
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No sessions found</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                    {session.drawing_base64 ? (
                      <img 
                        src={session.drawing_base64} 
                        alt="Drawing" 
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Predicted: {session.prediction}</Badge>
                      <Badge variant="secondary">
                        {Math.round(session.confidence * 100)}% confident
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {session.user_feedback === true ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Correct</span>
                        </div>
                      ) : session.user_feedback === false ? (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Incorrect</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No feedback</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.created_at ? formatDate(session.created_at) : 'Unknown'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SessionHistory
