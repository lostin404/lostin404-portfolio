/** Brand glyphs drawn inline (icon libraries no longer ship brand marks). */
export function SocialIcon({ id, size = 20 }: { id: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const
  switch (id) {
    case 'instagram':
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'pinterest':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.31-.09-.79-.17-2 .03-2.87.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.78 0 3.14-1.87 3.14-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.34 0 .86.33 1.78.74 2.28.08.1.09.19.07.29-.08.31-.24 1-.28 1.14-.04.18-.15.22-.34.13-1.25-.58-2.03-2.41-2.03-3.88 0-3.16 2.3-6.06 6.62-6.06 3.47 0 6.17 2.48 6.17 5.78 0 3.45-2.18 6.23-5.2 6.23-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.84 1.96-1.25 2.62.94.29 1.94.45 2.98.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      )
    case 'spotify':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="9.2" />
          <path d="M7.4 9.6c3.2-.9 6.6-.6 9.4 1" />
          <path d="M8 12.6c2.6-.7 5.2-.4 7.5.9" />
          <path d="M8.7 15.4c1.9-.5 3.7-.3 5.4.7" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.2 19.3z" />
          <path d="M9.2 8.4c-.4 1 .3 2.8 1.7 4.2 1.4 1.4 3.2 2.1 4.2 1.7l.6-1.2-1.7-1-.8.6c-.7-.3-1.6-1.2-1.9-1.9l.6-.8-1-1.7z" />
        </svg>
      )
    default:
      return null
  }
}
