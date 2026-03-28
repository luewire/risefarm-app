'use client'

import { useState } from 'react'
import { CloudUpload, Loader2, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react'

export function GalleryEditor() {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
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

      setImageUrl(data.url)
      showToast('Foto dokumentasi berhasil diunggah', 'success')
    } catch (error) {
      console.error(error)
      showToast('Gagal upload gambar, periksa koneksi internet', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    if (!imageUrl) {
        showToast("Mohon upload foto terlebih dahulu!", "error")
        return
    }
    
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, caption }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')

      showToast("Berhasil ditambahkan ke Dokumentasi!", "success")
      setImageUrl("")
      setCaption("")
    } catch (error) {
      console.error(error)
      showToast(error instanceof Error ? error.message : "Gagal menyimpan ke database", "error")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    } else {
      showToast('Mohon upload file gambar yang valid', 'error')
    }
  }

  return (
    <div className="container mx-auto px-6 md:px-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-5 sm:right-10 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 transition-opacity p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-orange-600 font-bold uppercase tracking-wider mb-2">Dokumentasi</p>
              <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-emerald-700" />
                Tambahkan Foto
              </h1>
            </div>
            <button onClick={handleSave} className="px-6 py-3 rounded-2xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-md">
              Simpan Dokumentasi
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-stone-700">Foto</label>
              <div 
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={imageUrl} alt="Preview" className="h-64 object-cover rounded-xl shadow-sm mb-4" />
                    <button onClick={() => setImageUrl("")} className="text-red-500 font-semibold text-sm hover:underline">Hapus Foto</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors ${isDragging ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-emerald-600'}`}>
                       <CloudUpload className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-lg text-emerald-950 mb-1">Upload Foto Baru</p>
                    <p className="text-sm text-stone-500 mb-6">Pilih file gambar untuk galeri dokumentasi atau drag & drop ke area ini.</p>
                    
                    <label className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploadingImage ? 'bg-stone-200 text-stone-600' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}>
                      {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
                      {uploadingImage ? 'Mengupload...' : 'Pilih Foto'}
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
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-stone-700">Keterangan / Caption <span className="text-stone-400 font-normal">(Opsional)</span></label>
              <input 
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
                type="text" 
                className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" 
                placeholder="Contoh: Panen bersama kelompok petani" 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
