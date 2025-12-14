import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown, Check } from 'lucide-react'

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'pt-BR', name: 'Português', fullName: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en', name: 'English', fullName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', fullName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', fullName: 'Français', flag: '🇫🇷' },
    { code: 'tr', name: 'Türkçe', fullName: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', fullName: 'العربية', flag: '🇸🇦' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 hover:from-primary-100 hover:to-primary-200/50 border border-primary-200 hover:border-primary-300 transition-all duration-300 shadow-sm hover:shadow-md group"
        aria-label="Select language"
      >
        <div className="relative">
          <Globe className="w-5 h-5 text-primary-700 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-xl leading-none">{currentLanguage.flag}</span>
          <span className="text-sm font-semibold text-primary-800">
            {currentLanguage.name}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-primary-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-100 overflow-hidden z-50 animate-fade-in">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500">
            <p className="text-xs font-semibold text-white text-center tracking-wide uppercase">
              Select Language
            </p>
          </div>

          <div className="py-2 max-h-96 overflow-y-auto">
            {languages.map((lang) => {
              const isActive = i18n.language === lang.code

              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 group/item relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-100 to-accent-50 font-semibold'
                      : 'hover:bg-primary-50/50'
                  }`}
                >
                  {/* Background hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100/0 via-primary-100/50 to-primary-100/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700"></div>

                  {/* Flag */}
                  <span className="text-3xl leading-none relative z-10 group-hover/item:scale-110 transition-transform duration-200">
                    {lang.flag}
                  </span>

                  {/* Language name */}
                  <div className="flex-1 relative z-10">
                    <span className={`text-sm block ${isActive ? 'text-primary-900' : 'text-neutral-700 group-hover/item:text-primary-800'}`}>
                      {lang.fullName}
                    </span>
                  </div>

                  {/* Check icon for active language */}
                  {isActive && (
                    <div className="relative z-10 bg-primary-600 rounded-full p-1">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
