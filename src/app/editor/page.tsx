import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ArticleEditor } from '@/components/ArticleEditor'
import { cookies } from 'next/headers'
import { getArticlesByLocaleWithFallback } from '@/lib/article-i18n'

export const dynamic = 'force-dynamic'

export default async function EditorPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const articles = await getArticlesByLocaleWithFallback(lang, true)

  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-stone-100">
        <section className="pb-20">
          <ArticleEditor initialArticles={articles} />
        </section>
      </main>
      <Footer />
    </>
  )
}
