import prisma from '@/lib/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { cookies } from 'next/headers'
import { translations } from '@/lib/translations'
import { verifyToken } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewsList() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const t = translations[lang]
  const token = cookieStore.get('risefarm_token')?.value
  const payload = token ? await verifyToken(token) : null
  const isAuthenticated = !!payload

  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-[#F8F4ED]">
        <section className="pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-3xl">
                <p className="text-[#C4521A] font-bold uppercase tracking-wider mb-2">Newsroom</p>
                <h1 className="text-4xl md:text-6xl font-serif text-[#1C4A2E] mb-4">{t.news.title}</h1>
              </div>
              {isAuthenticated && (
                <Link href="/editor" className="px-6 py-3 rounded-full bg-[#C4521A] text-white font-semibold hover:bg-[#A94315] hover:-translate-y-0.5 shadow-lg transition-all shrink-0">
                  {t.articles.write}
                </Link>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} lang={lang as 'id' | 'en'} isAdmin={isAuthenticated} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
