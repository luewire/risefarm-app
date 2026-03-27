import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lang = searchParams.get('lang')
    
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    let isAdmin = false
    if (token) {
      const payload = await verifyToken(token)
      if (payload) isAdmin = true
    }
    
    const whereClause: any = {}
    if (!isAdmin) {
      whereClause.status = 'published'
    }
    if (category) {
      whereClause.category = category
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })
    
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
    const slug = slugify(data.title)

    let uniqueSlug = slug
    let counter = 1
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        category: data.category || 'Berita',
        author: data.author || 'Admin',
        image: data.image || '/images/susunan_ubi.jpeg',
        excerpt: data.excerpt || '',
        content: data.content || '',
        lang: data.lang || 'id',
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? new Date() : null,
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
