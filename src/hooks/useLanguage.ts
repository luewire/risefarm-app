'use client'

import { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Language = 'id' | 'en'

const getCookieLanguage = (): Language => {
  if (typeof document === 'undefined') return 'id'
  const match = document.cookie.match(new RegExp('(^| )risefarm_lang=([^;]+)'))
  return match?.[2] === 'en' ? 'en' : 'id'
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => getCookieLanguage())
  const router = useRouter()

  useLayoutEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )risefarm_lang=([^;]+)'))
    if (!match) {
      document.cookie = 'risefarm_lang=id; path=/; max-age=31536000'
    }
  }, [])

  const changeLanguage = (newLang: Language) => {
    document.cookie = `risefarm_lang=${newLang}; path=/; max-age=31536000` // 1 year
    setLang(newLang)
    router.refresh()
  }

  return { lang, changeLanguage }
}
