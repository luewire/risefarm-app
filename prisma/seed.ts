import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await bcrypt.hash('RiseFarmbebas2026', 10)

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
    },
  })

  // Articles
  await prisma.article.upsert({
    where: { slug: 'panen-ubi-cilembu-risefarm-naik-25-di-kuartal-ini' },
    update: {},
    create: {
      title: 'Panen Ubi Cilembu RISEFARM Naik 25% di Kuartal Ini',
      slug: 'panen-ubi-cilembu-risefarm-naik-25-di-kuartal-ini',
      category: 'Berita',
      author: 'Tim RISEFARM',
      image: '/images/susunan_ubi.jpeg',
      excerpt: 'Optimalisasi bibit unggul dan pemupukan presisi mendorong kenaikan hasil panen yang lebih konsisten.',
      content: 'RISEFARM mencatat peningkatan panen ubi Cilembu hingga 25% dibanding periode sebelumnya.\n\nKenaikan ini didorong oleh penggunaan bibit unggul, pemantauan kelembapan lahan, dan proses sortir pasca panen yang lebih ketat.\n\n## Dampak ke mitra\n\nPeningkatan hasil panen memberi pasokan yang lebih stabil untuk kebutuhan supermarket dan pembeli B2B.\n\nSelain itu, mitra petani juga memperoleh pendampingan budidaya yang lebih terukur.',
      status: 'published',
      publishedAt: new Date(),
    },
  })

  await prisma.article.upsert({
    where: { slug: '5-tips-menjaga-kualitas-ubi-setelah-panen' },
    update: {},
    create: {
      title: '5 Tips Menjaga Kualitas Ubi Setelah Panen',
      slug: '5-tips-menjaga-kualitas-ubi-setelah-panen',
      category: 'Edukasi',
      author: 'Admin RISEFARM',
      image: '/images/penyucian_tahap_awal.jpeg',
      excerpt: 'Penyimpanan, pembersihan, dan pengemasan yang tepat sangat menentukan kualitas ubi sampai ke pelanggan.',
      content: 'Menjaga kualitas ubi setelah panen adalah kunci utama untuk mempertahankan kesegaran produk.\n\nPertama, lakukan sortir awal untuk memisahkan ubi yang rusak. Kedua, hindari pencucian berlebihan jika produk belum akan dikirim.\n\n## Pengemasan\n\nGunakan kemasan yang memiliki sirkulasi udara baik agar kelembapan tetap terkontrol.\n\n## Distribusi\n\nPastikan pengiriman dilakukan tepat waktu dengan handling yang minim benturan.',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000),
    },
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
