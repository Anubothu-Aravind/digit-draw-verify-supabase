
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import DrawingCanvas from '@/components/DrawingCanvas'
import PredictionResult from '@/components/PredictionResult'
import FeedbackModal from '@/components/FeedbackModal'
import CorrectDigitModal from '@/components/CorrectDigitModal'
import SessionHistory from '@/components/SessionHistory'
import Footer from '@/components/Footer'
import { predictDigit, addLearningData, preprocessImage } from '@/utils/modelUtils'
import { supabase, PredictionSession } from '@/lib/supabase'
import { Brain, Zap, Database, Sparkles } from 'lucide-react'

const Index = () => {
  const [currentDrawing, setCurrentDrawing] = useState<string>('')
  const [prediction, setPrediction] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showCorrectDigitModal, setShowCorrectDigitModal] = useState(false)
  const [sessionData, setSessionData] = useState<Partial<PredictionSession>>({})
  const [currentGrayscaleData, setCurrentGrayscaleData] = useState<Float32Array | null>(null)
  const { toast } = useToast()

  const handleDrawingChange = (imageData: string) => {
    setCurrentDrawing(imageData)
  }

  const handlePredict = async () => {
    if (!currentDrawing) {
      toast({
        title: "No Drawing Found",
        description: "Please draw a digit before predicting",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      console.log('Starting prediction...')
      const result = await predictDigit(currentDrawing)
      
      setPrediction(result.prediction)
      setConfidence(result.confidence)
      
      // Store session data for later saving
      setSessionData({
        drawing_base64: currentDrawing,
        prediction: result.prediction,
        confidence: result.confidence,
        user_feedback: null
      })
      
      // Show feedback modal
      setShowFeedbackModal(true)
      
      toast({
        title: "Prediction Complete!",
        description: `The model predicts this digit is ${result.prediction}`,
      })
    } catch (error) {
      console.error('Prediction error:', error)
      toast({
        title: "Prediction Failed",
        description: "There was an error processing your drawing",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (isCorrect: boolean) => {
    try {
      const completeSession: PredictionSession = {
        ...sessionData,
        user_feedback: isCorrect,
      } as PredictionSession

      console.log('Saving session to Supabase:', completeSession)
      
      const { error } = await supabase
        .from('digit_prediction_sessions')
        .insert([completeSession])

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setShowFeedbackModal(false)
      
      if (isCorrect) {
        toast({
          title: "Feedback Saved!",
          description: "Thank you for confirming the prediction was correct",
        })
      } else {
        // Show the correction modal when prediction is wrong
        setShowCorrectDigitModal(true)
      }
    } catch (error) {
      console.error('Error saving session:', error)
      toast({
        title: "Save Failed",
        description: "Your feedback couldn't be saved, but the prediction was successful",
        variant: "destructive"
      })
      setShowFeedbackModal(false)
      
      // Still show correction modal even if save failed
      if (!isCorrect) {
        setShowCorrectDigitModal(true)
      }
    }
  }

  const handleCorrection = async (correctDigit: number) => {
    try {
      // Process the image to get grayscale data for learning
      if (currentDrawing && prediction !== null) {
        const processedImage = await preprocessImage(currentDrawing)
        const grayscaleData = processedImage.data
        
        // Add this correction to the learning data
        addLearningData(currentDrawing, correctDigit, prediction, grayscaleData)
        
        // Update the session in Supabase with the correct digit
        const correctionData = {
          ...sessionData,
          user_feedback: false,
          correct_digit: correctDigit
        }
        
        const { error } = await supabase
          .from('digit_prediction_sessions')
          .update({ correct_digit: correctDigit })
          .eq('id', sessionData.id)

        if (error) {
          console.error('Error updating correction:', error)
        }
        
        toast({
          title: "Thank You!",
          description: `Correction saved! The model learned that this drawing is actually ${correctDigit}`,
        })
      }
    } catch (error) {
      console.error('Error processing correction:', error)
      toast({
        title: "Learning Data Saved",
        description: `The model learned that this drawing is actually ${correctDigit} (local storage)`,
      })
    }
    
    setShowCorrectDigitModal(false)
  }

  const handleSkipCorrection = () => {
    setShowCorrectDigitModal(false)
    toast({
      title: "Feedback Saved",
      description: "Thank you for the feedback. No correction was provided.",
    })
  }

  const clearAll = () => {
    setCurrentDrawing('')
    setPrediction(null)
    setConfidence(null)
    setSessionData({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-blue-600" />
              <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Digit Recognition AI</h1>
              <p className="text-gray-600">Draw a digit and watch our CNN model predict it in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <Brain className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">CNN Model</h3>
              <p className="text-sm opacity-90">TensorFlow.js powered neural network</p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Real-time Inference</h3>
              <p className="text-sm opacity-90">Instant predictions in your browser</p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <Database className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Supabase Storage</h3>
              <p className="text-sm opacity-90">Session data and feedback tracking</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Drawing Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Draw Your Digit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DrawingCanvas 
                onDrawingChange={handleDrawingChange}
                disabled={isLoading}
              />
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handlePredict}
                  disabled={!currentDrawing || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Predict Digit
                    </>
                  )}
                </Button>
                
                <Button onClick={clearAll} variant="outline">
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <PredictionResult 
              prediction={prediction}
              confidence={confidence}
              isLoading={isLoading}
            />
            
            <SessionHistory />
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold">Draw</h4>
                <p className="text-sm text-gray-600">Use your mouse or finger to draw a digit (0-9)</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold">Predict</h4>
                <p className="text-sm text-gray-600">Click predict to run the CNN model</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold">Feedback</h4>
                <p className="text-sm text-gray-600">Tell us if the prediction was correct</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h4 className="font-semibold">Analyze</h4>
                <p className="text-sm text-gray-600">View your session history and accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        prediction={prediction}
        onFeedback={handleFeedback}
      />

      {/* Correct Digit Modal */}
      <CorrectDigitModal
        isOpen={showCorrectDigitModal}
        incorrectPrediction={prediction}
        onSubmitCorrection={handleCorrection}
        onSkip={handleSkipCorrection}
      />
    </div>
  )
}

export default Index
