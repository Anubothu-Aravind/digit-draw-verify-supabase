
import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser, Pencil } from 'lucide-react'

interface DrawingCanvasProps {
  onDrawingChange: (imageData: string) => void
  disabled?: boolean
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingChange, disabled = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        setContext(ctx)
      }
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas && context) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    const canvas = canvasRef.current
    if (canvas && context) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.lineTo(x, y)
      context.stroke()
      
      // Convert to base64 and notify parent
      const imageData = canvas.toDataURL('image/png')
      onDrawingChange(imageData)
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      onDrawingChange('')
    }
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (disabled) return
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      })
      startDrawing(mouseEvent as any)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || disabled) return
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (canvas && context) {
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      context.lineTo(x, y)
      context.stroke()
      
      const imageData = canvas.toDataURL('image/png')
      onDrawingChange(imageData)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    stopDrawing()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className={`border-2 border-gray-300 rounded-lg shadow-lg bg-white cursor-crosshair ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {disabled && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-gray-600 font-medium">Drawing disabled during prediction</div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={clearCanvas} 
          variant="outline" 
          disabled={disabled}
          className="flex items-center space-x-2"
        >
          <Eraser className="w-4 h-4" />
          <span>Clear</span>
        </Button>
      </div>
    </div>
  )
}

export default DrawingCanvas
