import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { slugify } from '@/lib/slugify'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'id'
    const locales = lang === 'en' ? ['en', 'id'] : ['id']
    const prismaAny = prisma as any
    const { id } = await params
    const article = await prismaAny.article.findUnique({
      where: { id },
      include: {
        translations: {
          where: {
            locale: {
              in: locales,
            },
          },
        },
      },
    })
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    
    const localized =
      article.translations.find((t: any) => t.locale === lang) ??
      article.translations.find((t: any) => t.locale === 'id')

    if (!localized) {
      return NextResponse.json({ error: 'Article translation not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: article.id,
      category: article.category,
      author: article.author,
      image: article.image,
      status: article.status,
      createdAt: article.createdAt,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      locale: localized.locale,
      title: localized.title,
      slug: localized.slug,
      excerpt: localized.excerpt,
      content: localized.content,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const prismaAny = prisma as any
    const { id } = await params
    const data = await request.json()
    const locale = data.lang === 'en' ? 'en' : 'id'

    let uniqueSlug: string | undefined
    if (data.title) {
      const baseSlug = slugify(data.title)
      uniqueSlug = baseSlug
      let counter = 1
      while (
        await prismaAny.articleTranslation.findFirst({
          where: {
            slug: uniqueSlug,
            locale,
            NOT: {
              articleId: id,
            },
          },
        })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }
    }

    let publishedAtUpdate: Date | null | undefined
    if (data.status === 'published') {
      publishedAtUpdate = new Date()
    } else if (data.status === 'draft') {
      publishedAtUpdate = null
    }

    const article = await prismaAny.article.update({
      where: { id },
      data: {
        category: data.category,
        author: data.author,
        image: data.image,
        status: data.status,
        ...(publishedAtUpdate !== undefined ? { publishedAt: publishedAtUpdate } : {}),
        translations: {
          upsert: {
            where: {
              articleId_locale: {
                articleId: id,
                locale,
              },
            },
            create: {
              locale,
              title: data.title || 'Tanpa Judul',
              slug: uniqueSlug || slugify(data.title || `article-${Date.now()}`),
              excerpt: data.excerpt || '',
              content: data.content || '',
            },
            update: {
              title: data.title,
              slug: uniqueSlug,
              excerpt: data.excerpt,
              content: data.content,
            },
          },
        },
      },
      include: {
        translations: {
          where: {
            locale: {
              in: locale === 'en' ? ['en', 'id'] : ['id'],
            },
          },
        },
      },
    })

    const localized =
      article.translations.find((t: any) => t.locale === locale) ??
      article.translations.find((t: any) => t.locale === 'id')

    return NextResponse.json({
      id: article.id,
      category: article.category,
      author: article.author,
      image: article.image,
      status: article.status,
      createdAt: article.createdAt,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      locale: localized?.locale || locale,
      title: localized?.title || data.title || 'Tanpa Judul',
      slug: localized?.slug || uniqueSlug || '',
      excerpt: localized?.excerpt || data.excerpt || '',
      content: localized?.content || data.content || '',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.article.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
