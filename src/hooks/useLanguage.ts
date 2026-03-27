'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type Language = 'id' | 'en'

export function useLanguage() {
  const [lang, setLang] = useState<Language>('id')
  const router = useRouter()

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )risefarm_lang=([^;]+)'))
    if (match) {
      setLang(match[2] as Language)
    } else {
      document.cookie = 'risefarm_lang=id; path=/'
    }
  }, [])

  const changeLanguage = (newLang: Language) => {
    document.cookie = `risefarm_lang=${newLang}; path=/; max-age=31536000` // 1 year
    setLang(newLang)
    // Force a full window reload so ALL client components pick up the new cookie
    window.location.reload()
  }

  return { lang, changeLanguage }
}
