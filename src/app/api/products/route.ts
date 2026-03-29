import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

// Cache strategy: products change rarely (admin-driven).
// s-maxage=300 → CDN/server cache fresh for 5 minutes.
// stale-while-revalidate=600 → serve stale for up to 10 more minutes while revalidating in background.
const PRODUCTS_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { translations: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products, { headers: PRODUCTS_CACHE_HEADERS })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { image, badgeColor, link, translations } = data
    const targetBadgeColor = badgeColor || 'emerald'

    const product = await prisma.product.create({
      data: {
        image,
        badgeColor: targetBadgeColor,
        link,
        translations: {
          create: translations.map((t: any) => ({
            locale: t.locale,
            badge: t.badge,
            title: t.title,
            desc: t.desc,
          })),
        },
      },
      include: { translations: true },
    })

    // Purge the home page cache so the next public request gets fresh data immediately
    revalidatePath('/', 'layout')

    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
