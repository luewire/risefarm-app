import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { cookies } from 'next/headers'
import { translations } from '@/lib/translations'

// Simple markdown-like to HTML converter
function renderArticleContent(content: string) {
  return content.split('\n\n').map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} className="text-2xl font-bold text-emerald-950 mt-8 mb-4">{trimmed.replace(/^##\s*/, '')}</h2>
    }
    return <p key={i} className="mb-4 text-stone-700 leading-relaxed text-lg">{trimmed}</p>
  })
}

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const article = await prisma.article.findUnique({
    where: { slug }
  })

  if (!article || article.status !== 'published') {
    notFound()
  }

  // Bug 4: Read the active language from cookie
  const cookieStore = await cookies()
  const activeLang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const articleLang = (article as any).lang || 'id'
  const showLangNotice = activeLang !== articleLang
  const t = translations[activeLang]

  const date = new Date(article.publishedAt || article.createdAt).toLocaleDateString(activeLang === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FDFBF7]">
        <section className="pb-20">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <Link href="/news" className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-orange-600 mb-8">
              <ArrowLeft className="w-4 h-4" />
              {t.news.back}
            </Link>
            
            <article>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-sm tracking-wide">
                  {article.category}
                </span>
                <span className="text-stone-500 font-medium" suppressHydrationWarning>{date}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-emerald-950 mb-6 leading-tight">
                {article.title}
              </h1>
              
              {/* Bug 4: Language disclaimer notice */}
              {showLangNotice && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8 text-amber-800">
                  <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                  <p className="text-sm font-medium">
                    {t.news.disclaimer}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mb-10 pb-10 border-b border-stone-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-emerald-950">{article.author}</div>
                  <div className="text-stone-500 text-sm">{t.news.team}</div>
                </div>
              </div>

              {article.image && (
                <div className="mb-12 rounded-3xl overflow-hidden shadow-xl">
                  <img src={article.image} alt={article.title} className="w-full h-auto object-cover max-h-[600px]" />
                </div>
              )}

              <div className="prose-article prose-lg max-w-none text-stone-700">
                {renderArticleContent(article.content)}
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
