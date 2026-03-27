'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

// All gallery images in one place — easy to extend
const GALLERY_IMAGES = [
  { src: '/images/pengecekan_berulang_pak_budi.jpeg', alt: 'Petani di ladang', caption: 'Pemberdayaan Petani Lokal' },
  { src: '/images/pickup_ubi.jpeg', alt: 'Pickup Ubi', caption: 'Distribusi Ubi Segar' },
  { src: '/images/ubiakbar.jpeg', alt: 'Produk ubi', caption: 'Produk Unggulan' },
  { src: '/images/penyucian_tahap_awal.jpeg', alt: 'Pencucian', caption: 'Proses Pencucian' },
  { src: '/images/susunan_ubi.jpeg', alt: 'Susunan ubi', caption: 'Sortir & Pengemasan' },
  { src: '/images/cuciubi_pak_rama.jpeg', alt: 'Cuci ubi', caption: 'Quality Control' },
  { src: '/images/pengkelompokanubi.jpeg', alt: 'Pengelompokan', caption: 'Grading & Pengelompokan' },
  { src: '/images/ubiferry.jpeg', alt: 'Ubi ferry', caption: 'Varietas Pilihan' },
]

export function GallerySection() {
  const { lang } = useLanguage()
  const t = translations[lang].gallery
  const [showFull, setShowFull] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      {/* Preview section */}
      <section id="gallery" className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="fade-in-up flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
              <h2 className="text-4xl font-bold text-emerald-950">{t.title}</h2>
            </div>
            <button
              onClick={() => setShowFull(true)}
              className="mt-6 md:mt-0 text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors"
            >
              <span>{t.all}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="fade-in-up col-span-2 row-span-2">
              <div className="h-64 md:h-[500px] rounded-3xl overflow-hidden group relative cursor-pointer" onClick={() => setLightbox(GALLERY_IMAGES[0].src)}>
                <img src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <p className="text-white font-bold text-xl">{t.caption1}</p>
                </div>
              </div>
            </div>
            {GALLERY_IMAGES.slice(1, 4).map((img, i) => (
              <div key={i} className={`fade-in-up${i === 2 ? ' col-span-2 md:col-span-2' : ''}`}>
                <div className="h-48 md:h-[238px] rounded-3xl overflow-hidden group relative cursor-pointer" onClick={() => setLightbox(img.src)}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowFull(true)}
              className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full transition-all shadow-md"
            >
              {t.all} ({GALLERY_IMAGES.length} foto) →
            </button>
          </div>
        </div>
      </section>

      {/* Full gallery modal */}
      {showFull && (
        <div className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto" id="gallery-full">
          <div className="container mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">{t.title}</h2>
                <p className="text-stone-400 mt-1">{GALLERY_IMAGES.length} foto</p>
              </div>
              <button onClick={() => setShowFull(false)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightbox(img.src)}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-semibold text-sm">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox} alt="Gallery" className="max-w-full max-h-[90vh] rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
