import React, { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

const WhatsAppButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  
  const phoneNumber = "554187479813" // Número do WhatsApp do Instituto
  const message = "Olá! Gostaria de saber mais sobre o trabalho do Instituto Estação."
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <button
            onClick={handleWhatsAppClick}
            className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
            aria-label="Falar no WhatsApp"
          >
            <MessageSquare className="w-6 h-6" />
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </button>
          
          {/* Close button - moved outside main button */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Fale conosco no WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>
      
      {/* Mobile styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .fixed.bottom-6.right-6 {
              bottom: 1rem;
              right: 1rem;
            }
          }
        `
      }} />
    </>
  )
}

export default WhatsAppButton