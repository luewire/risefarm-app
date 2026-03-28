import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { getArticlesByLocaleWithFallback } from '@/lib/article-i18n'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'id'
    
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    let isAdmin = false
    if (token) {
      const payload = await verifyToken(token)
      if (payload) isAdmin = true
    }
    
    const localizedArticles = await getArticlesByLocaleWithFallback(lang, isAdmin)
    const articles = category
      ? localizedArticles.filter((article) => article.category === category)
      : localizedArticles
    
    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await request.json()
    const prismaAny = prisma as any
    const locale = data.lang === 'en' ? 'en' : 'id'
    const slug = slugify(data.title || 'artikel-baru')

    let uniqueSlug = slug
    let counter = 1
    while (await prismaAny.articleTranslation.findUnique({ where: { slug_locale: { slug: uniqueSlug, locale } } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const article = await prismaAny.article.create({
      data: {
        category: data.category || 'Berita',
        author: data.author || 'Admin',
        image: data.image || '/images/susunan_ubi.jpeg',
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? new Date() : null,
        translations: {
          create: {
            locale,
            title: data.title || 'Tanpa Judul',
            slug: uniqueSlug,
            excerpt: data.excerpt || '',
            content: data.content || '',
          },
        },
      }
    })

    return NextResponse.json(
      {
        id: article.id,
        category: article.category,
        author: article.author,
        image: article.image,
        status: article.status,
        createdAt: article.createdAt,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        locale,
        title: data.title || 'Tanpa Judul',
        slug: uniqueSlug,
        excerpt: data.excerpt || '',
        content: data.content || '',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
