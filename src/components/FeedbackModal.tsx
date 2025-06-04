
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  prediction: number | null
  onFeedback: (isCorrect: boolean) => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  prediction, 
  onFeedback 
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Quick Feedback</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Was the prediction <span className="font-bold text-blue-600">"{prediction}"</span> correct?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={() => onFeedback(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Yes, Correct!</span>
          </Button>
          
          <Button
            onClick={() => onFeedback(false)}
            variant="destructive"
            className="flex items-center space-x-2 px-8 py-3"
          >
            <XCircle className="w-5 h-5" />
            <span>No, Wrong</span>
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Your feedback helps improve the model's performance
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackModal
