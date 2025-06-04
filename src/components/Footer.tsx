
import React from 'react'
import { ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Developer Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Anubothu Aravind</h3>
            <p className="text-gray-400 text-sm">Full Stack Developer & AI Enthusiast</p>
            <p className="text-gray-500 text-xs mt-1">© 2025 All rights reserved</p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/in/anubothu-aravind"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1"
              aria-label="LinkedIn Profile"
            >
              <ExternalLink size={16} />
              <span className="text-sm">LinkedIn</span>
            </a>
            
            <a
              href="https://medium.com/@aanubothu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center space-x-1"
              aria-label="Medium Profile"
            >
              <ExternalLink size={16} />
              <span className="text-sm">Medium</span>
            </a>
            
            <a
              href="https://github.com/Anubothu-Aravind"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-1"
              aria-label="GitHub Profile"
            >
              <ExternalLink size={16} />
              <span className="text-sm">GitHub</span>
            </a>
            
            <a
              href="https://anubothu-aravind.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center space-x-1"
              aria-label="Portfolio Website"
            >
              <ExternalLink size={16} />
              <span className="text-sm">Portfolio</span>
            </a>
          </div>
        </div>

        {/* Project Credit */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center">
          <p className="text-gray-500 text-xs">
            Built with React, TypeScript, TensorFlow.js & Supabase | 
            <span className="text-gray-400 ml-1">Digit Recognition AI Project</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
