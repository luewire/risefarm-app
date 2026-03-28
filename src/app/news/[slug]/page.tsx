import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { cookies } from 'next/headers'
import { translations } from '@/lib/translations'
import { getArticleBySlugWithLocaleFallback } from '@/lib/article-i18n'

// Simple markdown-like to HTML converter
function renderArticleContent(content: string) {
  return content.split('\n\n').map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} className="text-2xl font-bold text-emerald-950 mt-8 mb-4">{trimmed.replace(/^##\s*/, '')}</h2>
    }
    return <p key={i} className="mb-4 text-stone-700 leading-relaxed text-base">{trimmed}</p>
  })
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  const cookieStore = await cookies()
  const activeLang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const article = await getArticleBySlugWithLocaleFallback(slug, activeLang, false)

  if (!article || article.status !== 'published') {
    notFound()
  }

  const articleLang = article.locale || 'id'
  const showLangNotice = activeLang !== articleLang
  const t = translations[activeLang]

  const date = new Date(article.publishedAt || article.createdAt).toLocaleDateString(activeLang === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#F6F4EF]">
        <section className="pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-[760px] mx-auto">
              <Link href="/news" className="inline-flex items-center gap-2 text-emerald-700 text-sm font-semibold hover:text-orange-600 mb-6">
              <ArrowLeft className="w-4 h-4" />
              {t.news.back}
              </Link>

              <article>
                <div className="flex items-center gap-3 mb-5 text-xs text-stone-500">
                  <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold tracking-wide">
                    {article.category}
                  </span>
                  <span suppressHydrationWarning>{date}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                  <span>{article.author}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 mb-4 leading-tight">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                    {article.excerpt}
                  </p>
                )}

                {showLangNotice && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 text-amber-800">
                    <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-sm font-medium">
                      {t.news.disclaimer}
                    </p>
                  </div>
                )}

                {article.image && (
                  <div className="mb-6 rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-white">
                    <img src={article.image} alt={article.title} className="w-full h-auto object-cover max-h-[560px]" />
                  </div>
                )}

                <div className="rounded-3xl border border-stone-200 bg-[#F8F8F8] px-6 md:px-8 py-7">
                  <div className="prose-article max-w-none text-stone-700">
                    {renderArticleContent(article.content)}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/editor"
                    className="inline-flex items-center rounded-full px-5 py-2.5 bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    Edit Artikel
                  </Link>
                  <Link
                    href="/news"
                    className="inline-flex items-center rounded-full px-5 py-2.5 border border-stone-300 bg-white text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Lihat Artikel Lain
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
