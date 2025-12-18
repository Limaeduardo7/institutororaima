import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { galleryService } from '../lib/supabaseClient'
import type { GalleryItem } from '../lib/types'
import { Card } from '../components/ui/Card'
import { Loading } from '../components/ui/Loading'
import { Image, Video, Play, X, Loader2, Camera } from 'lucide-react'

export default function Galeria() {
  const { t } = useTranslation()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const data = await galleryService.getAll()
      setItems(data)
    } catch (error) {
      console.error('Erro ao carregar galeria:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item => 
    filter === 'all' ? true : item.media_type === filter
  )

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const getEmbedUrl = (url: string) => {
    const youtubeId = getYoutubeId(url)
    if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`
    // Adicionar suporte a Vimeo ou outros se necessário
    return url
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-gallery">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            {t('gallery.hero_title')}
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            {t('gallery.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex justify-center mb-12 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white shadow-lg scale-105' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
              }`}
            >
              {t('gallery.filters.all')}
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                filter === 'image' 
                  ? 'bg-primary-600 text-white shadow-lg scale-105' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <Image size={18} />
              {t('gallery.filters.images')}
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                filter === 'video' 
                  ? 'bg-primary-600 text-white shadow-lg scale-105' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <Video size={18} />
              {t('gallery.filters.videos')}
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loading size="lg" text={t('gallery.loading')} />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">{t('gallery.no_items')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  variant="glass"
                  className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => setSelectedItem(item)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {item.media_type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        {item.thumbnail_url ? (
                          <img 
                            src={item.thumbnail_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <Video className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-primary-600 ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal / Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <X size={24} />
          </button>
          
          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col items-center">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6 relative group">
              {selectedItem.media_type === 'image' ? (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(selectedItem.url)}
                  title={selectedItem.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            
            <div className="text-white text-center max-w-3xl animate-slide-up">
              <h3 className="text-3xl font-bold mb-3">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-gray-300 text-lg leading-relaxed">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
