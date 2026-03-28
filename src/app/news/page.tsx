import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { NewsListClient } from './NewsListClient'
import { getArticlesByLocaleWithFallback } from '@/lib/article-i18n'

export const dynamic = 'force-dynamic'

export default async function NewsList() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const token = cookieStore.get('risefarm_token')?.value
  const payload = token ? await verifyToken(token) : null
  const isAuthenticated = !!payload

  const articles = await getArticlesByLocaleWithFallback(lang, isAuthenticated)

  return (
    <>
      <Navbar />
      <NewsListClient initialArticles={articles as any[]} isAuthenticated={isAuthenticated} lang={lang} />
      <Footer />
    </>
  )
}
