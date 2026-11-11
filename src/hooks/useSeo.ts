import { useEffect } from 'react'
import { canonical, jsonLdFor, metaFor } from '../seo/meta'

function upsert(tag: 'meta' | 'link', key: string, keyValue: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(`${tag}[${key}="${keyValue}"]`)
  if (!el) {
    el = document.createElement(tag)
    el.setAttribute(key, keyValue)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/**
 * Per-route document title, description, canonical, Open Graph / Twitter text, robots and JSON-LD,
 * all read from src/seo/meta.js — the same data the post-build prerender step writes into static HTML.
 * Pass `noindex` for the not-found view.
 */
export function useSeo(path: string, opts: { noindex?: boolean } = {}) {
  const m = metaFor(path)
  const noindex = !!opts.noindex
  useEffect(() => {
    const title = m?.title ?? 'Page not found — LOSTIN404'
    const description = m?.description ?? 'This page does not exist.'
    document.title = title
    upsert('meta', 'name', 'description', 'content', description)
    upsert('meta', 'property', 'og:title', 'content', title)
    upsert('meta', 'property', 'og:description', 'content', description)
    upsert('meta', 'name', 'twitter:title', 'content', title)
    upsert('meta', 'name', 'twitter:description', 'content', description)
    upsert('meta', 'name', 'robots', 'content', noindex ? 'noindex' : 'index, follow')
    if (m) {
      upsert('link', 'rel', 'canonical', 'href', canonical(path))
      upsert('meta', 'property', 'og:url', 'content', canonical(path))
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove()
    }

    const scripts: HTMLScriptElement[] = []
    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove())
    for (const obj of jsonLdFor(path)) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.seoJsonld = ''
      s.textContent = JSON.stringify(obj)
      document.head.appendChild(s)
      scripts.push(s)
    }
    return () => scripts.forEach((s) => s.remove())
  }, [m, path, noindex])
}
