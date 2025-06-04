
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CorrectDigitModalProps {
  isOpen: boolean
  incorrectPrediction: number | null
  onSubmitCorrection: (correctDigit: number) => void
  onSkip: () => void
}

const CorrectDigitModal: React.FC<CorrectDigitModalProps> = ({ 
  isOpen, 
  incorrectPrediction,
  onSubmitCorrection,
  onSkip
}) => {
  const [correctDigit, setCorrectDigit] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = () => {
    const digit = parseInt(correctDigit)
    
    if (isNaN(digit) || digit < 0 || digit > 9) {
      setError('Please enter a valid digit (0-9)')
      return
    }
    
    onSubmitCorrection(digit)
    setCorrectDigit('')
    setError('')
  }

  const handleSkip = () => {
    onSkip()
    setCorrectDigit('')
    setError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Help Improve the Model</DialogTitle>
          <DialogDescription className="text-center">
            The model predicted <span className="font-bold text-red-600">"{incorrectPrediction}"</span> but that was incorrect.
            <br />
            What digit did you actually draw?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <label htmlFor="correct-digit" className="text-sm font-medium">
              Correct digit (0-9):
            </label>
            <Input
              id="correct-digit"
              type="number"
              min="0"
              max="9"
              value={correctDigit}
              onChange={(e) => setCorrectDigit(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter the correct digit"
              className="text-center text-lg"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <div className="flex justify-center space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={!correctDigit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Submit Correction
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="outline"
              className="px-6"
            >
              Skip
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Your corrections help train the model to make better predictions
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default CorrectDigitModal
