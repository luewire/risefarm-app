'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Language = 'id' | 'en'

const parseCookieLanguage = (cookieString: string): Language => {
  const match = cookieString.match(/(?:^|;\s*)risefarm_lang=([^;]+)/)
  return match?.[1] === 'en' ? 'en' : 'id'
}

const getCookieLanguage = (): Language => {
  if (typeof document === 'undefined') return 'id'
  return parseCookieLanguage(document.cookie)
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => getCookieLanguage())
  const router = useRouter()

  useEffect(() => {
    const cookieLang = parseCookieLanguage(document.cookie)
    setLang(cookieLang)

    if (!document.cookie.includes('risefarm_lang=')) {
      document.cookie = 'risefarm_lang=id; path=/; max-age=31536000; samesite=lax'
    }
  }, [])

  const changeLanguage = (newLang: Language) => {
    document.cookie = `risefarm_lang=${newLang}; path=/; max-age=31536000; samesite=lax` // 1 year
    setLang(newLang)
    router.refresh()
  }

  return { lang, changeLanguage }
}
