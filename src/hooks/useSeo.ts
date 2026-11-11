import { useEffect } from 'react'

const setMeta = (selector: string, content: string) => {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

/** Per-page document title and description (also mirrored to Open Graph). */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
  }, [title, description])
}
