
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface PredictionResultProps {
  prediction: number | null
  confidence: number | null
  isLoading: boolean
}

const PredictionResult: React.FC<PredictionResultProps> = ({ 
  prediction, 
  confidence, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Analyzing Drawing...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Running CNN model inference...</p>
        </CardContent>
      </Card>
    )
  }

  if (prediction === null || confidence === null) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Ready to Predict</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">Draw a digit and click "Predict" to see the magic!</p>
        </CardContent>
      </Card>
    )
  }

  const confidencePercentage = Math.round(confidence * 100)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Prediction Result</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-6xl font-bold text-blue-600 bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center">
            {prediction}
          </div>
          <div className="text-left">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {confidencePercentage}% confidence
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confidence Level</span>
            <span>{confidencePercentage}%</span>
          </div>
          <Progress value={confidencePercentage} className="w-full" />
        </div>

        <div className="text-sm text-gray-600">
          <p>The neural network is {confidencePercentage}% confident this digit is {prediction}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PredictionResult
