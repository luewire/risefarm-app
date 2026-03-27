'use client'

import { useState } from 'react'

export function ArticleEditor({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles)
  const [currentId, setCurrentId] = useState<string>('')
  
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
        alert("Judul artikel tidak boleh kosong!")
        return
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status })
    })

    if (res.ok) {
      alert(currentId ? 'Artikel diperbarui' : 'Artikel baru berhasil disimpan')
      handleCreateNew()
      refreshArticles()
    } else {
      alert('Gagal menyimpan artikel. Perhatikan format respons atau koneksi.')
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

  return (
    <div className="container mx-auto px-6 md:px-12">
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
                  <label className="block text-sm font-semibold mb-2">URL Cover Image</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="/images/file.jpg" />
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
