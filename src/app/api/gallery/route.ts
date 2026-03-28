import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

const db = prisma as any

export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error('Failed to fetch gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Only admins can upload
    const cookieStore = await cookies()
    const token = cookieStore.get('risefarm_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { url, caption } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const image = await db.galleryImage.create({
      data: {
        url,
        caption: caption || '',
      }
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Failed to create gallery image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}