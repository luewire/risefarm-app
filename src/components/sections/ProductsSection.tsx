'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { ChevronRight } from 'lucide-react'

export function ProductsSection() {
  const { lang } = useLanguage()
  const t = translations[lang].products

  return (
    <section id="products" className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6">{t.title}</h2>
          <p className="text-stone-600 text-lg">{t.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="fade-in-up h-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group flex flex-col h-full">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">{t.badge1}</div>
                <img src="/images/cilembu.png" alt="Ekspor" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">{t.p1}</h3>
                <p className="text-stone-600 mb-6">{t.p1d}</p>
                <a href="https://wa.me/6281281091257" target="_blank" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                  <span>{t.detail}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="fade-in-up h-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group flex flex-col h-full">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">B2B</div>
                <img src="/images/pengkelompokanubi.jpeg" alt="Supermarket" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">{t.p2}</h3>
                <p className="text-stone-600 mb-6">{t.p2d}</p>
                <a href="https://wa.me/6281281091257" target="_blank" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                  <span>{t.detail}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="fade-in-up h-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group flex flex-col h-full">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">{t.badge3}</div>
                <img src="https://images.unsplash.com/photo-1615486171448-4afd28d488f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sayuran" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-emerald-950 mb-3">{t.p3}</h3>
                <p className="text-stone-600 mb-6">{t.p3d}</p>
                <a href="https://wa.me/6281281091257" target="_blank" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                  <span>{t.detail}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
