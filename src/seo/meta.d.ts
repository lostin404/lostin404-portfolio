export const SITE_URL: string
export const SITE_NAME: string
export const OG_IMAGE: string
export type PageMeta = {
  path: string
  title: string
  description: string
  heading: string
  project?: { title: string; description: string; url?: string }
}
export const pages: Record<string, { title: string; description: string; heading: string }>
export const projectMeta: Record<string, { title: string; description: string; url?: string }>
export const routes: string[]
export function canonical(path: string): string
export function metaFor(path: string): PageMeta | undefined
export function jsonLdFor(path: string): object[]
