'use client'

import { useState } from 'react'
import { CheckCircle2, CloudUpload, Loader2, X, AlertCircle } from 'lucide-react'

export function ArticleEditor({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles)
  const [currentId, setCurrentId] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  const [form, setForm] = useState({
    title: '',
    category: '',
    author: '',
    image: '',
    excerpt: '',
    content: '',
    lang: 'id'
  })

  // To refresh data from server after mutations
  const refreshArticles = async () => {
    // We already have admin cookie set, so calling /api/articles will return all items (drafts included)
    const res = await fetch('/api/articles')
    if (res.ok) {
        setArticles(await res.json())
    }
  }

  const handleCreateNew = () => {
    setCurrentId('')
    setForm({ title: '', category: '', author: '', image: '', excerpt: '', content: '', lang: 'id' })
  }

  const handleEdit = (article: any) => {
    setCurrentId(article.id)
    setForm({
      title: article.title,
      category: article.category,
      author: article.author,
      image: article.image || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      lang: article.lang || 'id'
    })
  }

  const handleSave = async (status: 'draft' | 'published') => {
    const url = currentId ? `/api/articles/${currentId}` : '/api/articles'
    const method = currentId ? 'PUT' : 'POST'
    
    if (!form.title) {
        showToast("Judul artikel tidak boleh kosong!", 'error')
        return
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status })
    })

    if (res.ok) {
      showToast(currentId ? 'Artikel diperbarui' : 'Artikel baru berhasil disimpan', 'success')
      handleCreateNew()
      refreshArticles()
    } else {
      showToast('Gagal menyimpan artikel. Periksa koneksi Anda.', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus artikel ini secara permanen?')) return
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    if (res.ok) {
      if (currentId === id) handleCreateNew()
      refreshArticles()
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Gagal upload gambar', 'error')
        return
      }

      setForm((prev) => ({ ...prev, image: data.url }))
      showToast('Gambar berhasil diunggah', 'success')
    } catch (error) {
      console.error(error)
      showToast('Gagal upload gambar, periksa koneksi internet', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="container mx-auto px-6 md:px-12 relative">
      {toast && (
        <div className="fixed top-24 right-5 sm:right-10 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 transition-opacity p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <p className="text-orange-600 font-bold uppercase tracking-wider mb-2">Editor</p>
                <h1 className="text-3xl md:text-4xl font-bold text-emerald-950">Tulis Artikel / Berita</h1>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleCreateNew} className="px-5 py-3 rounded-2xl border border-stone-300 font-semibold hover:bg-stone-50">Artikel Baru</button>
                <button onClick={() => handleSave('draft')} className="px-5 py-3 rounded-2xl bg-stone-900 text-white font-semibold hover:bg-stone-800">Simpan Draft</button>
                <button onClick={() => handleSave('published')} className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600">Publish</button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Judul Artikel</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Contoh: Panen Ubi Cilembu Meningkat..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Kategori</label>
                    <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Berita" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Bahasa</label>
                    <select value={form.lang} onChange={e => setForm({...form, lang: e.target.value})} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 appearance-none bg-white">
                      <option value="id">Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Penulis</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Tim RISEFARM" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Cover Image</label>
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploadingImage ? 'bg-stone-200 text-stone-600' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
                        {uploadingImage ? 'Mengupload...' : 'Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            const selected = e.target.files?.[0]
                            if (selected) handleImageUpload(selected)
                            e.currentTarget.value = ''
                          }}
                        />
                      </label>

                      <div className="text-xs text-stone-500">
                        Pilih file gambar untuk cover artikel.
                      </div>
                    </div>

                    {form.image && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-5 h-5" />
                        <div>
                          <p>Gambar berhasil ditambahkan</p>
                          <p className="text-xs text-emerald-600 font-normal truncate max-w-[200px] sm:max-w-xs mt-0.5">{form.image.split('/').pop()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Ringkasan Singkat</label>
                <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Ringkasan..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Isi Artikel</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={16} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Pisahkan paragraf dengan baris kosong. Awali ## untuk judul."></textarea>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-xl font-bold text-emerald-950 mb-4">Preview Cepat</h2>
            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <div className="h-44 bg-stone-200 flex items-center justify-center text-stone-500 overflow-hidden">
                {form.image ? <img src={form.image} alt="preview" className="w-full h-full object-cover" /> : 'Cover artikel'}
              </div>
              <div className="p-5">
                <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-3">Draft</span>
                <h3 className="text-xl font-bold text-emerald-950 mb-2 line-clamp-2">{form.title || 'Judul artikel akan tampil di sini'}</h3>
                <p className="text-stone-600 text-sm line-clamp-3">{form.excerpt || 'Ringkasan artikel akan muncul sebagai preview card.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-950">Daftar Artikel</h2>
              <span className="text-sm text-stone-500">{articles.length} artikel</span>
            </div>
            <div className="space-y-3 max-h-[520px] overflow-auto pr-2">
              {articles.map((article: any) => (
                <div key={article.id} className="text-left p-4 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group" onClick={() => handleEdit(article)}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-700'}`}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(article.id) }} className="text-xs text-red-500 opacity-0 group-hover:opacity-100">Hapus</button>
                  </div>
                  <h3 className="font-bold text-emerald-950 line-clamp-2 mb-1">{article.title}</h3>
                  <p className="text-sm text-stone-500 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
