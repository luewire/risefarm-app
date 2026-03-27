'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArticleCard } from '@/components/ArticleCard'

export function ArticlesPreviewSection() {
  const { lang } = useLanguage()
  const { isAuthenticated } = useAuth()
  const t = translations[lang].articles
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch(`/api/articles`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data.slice(0, 3) as never)
      })
  }, [])

  return (
    <section id="articles" className="py-24 bg-[#F8F4ED]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 fade-in-up">
          <div className="max-w-2xl">
            <h3 className="text-[#C4521A] font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C4A2E] mb-4">{t.title}</h2>
            <p className="text-stone-600 text-lg">{t.desc}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/news" className="px-6 py-3 rounded-full border-[1.5px] border-[#1C4A2E]/25 text-[#1C4A2E] font-semibold hover:bg-[#4A7C59]/10 hover:border-[#4A7C59] transition-all">
              {t.viewAll}
            </Link>
            {isAuthenticated && (
              <Link href="/editor" className="px-6 py-3 rounded-full bg-[#C4521A] text-white font-semibold hover:bg-[#A94315] hover:-translate-y-0.5 shadow-lg transition-all shrink-0">
                {t.write}
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <div key={article.id} className="h-full">
              <ArticleCard article={article} lang={lang} isAdmin={!!isAuthenticated} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
