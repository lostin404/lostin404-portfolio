import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import { SocialIcon } from '../SocialIcon'
import { brand, services } from '../../data/site'

export type ContactFormValues = { name: string; email: string; message: string; service?: string }
type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: ContactFormValues): Errors {
  const errors: Errors = {}
  if (!v.name) errors.name = 'Please enter your name.'
  if (!v.email) errors.email = 'Please enter your email address.'
  else if (!EMAIL.test(v.email)) errors.email = 'That email address doesn’t look right — please check it.'
  if (!v.message) errors.message = 'Please write a short message about your project.'
  return errors
}

/** The enquiry text sent to WhatsApp. `*text*` renders bold in WhatsApp. */
export function buildEnquiry(v: ContactFormValues) {
  return [
    '*NEW PORTFOLIO ENQUIRY — LOSTIN404*',
    '',
    `*Name:* ${v.name}`,
    `*Email:* ${v.email}`,
    ...(v.service ? [`*Service:* ${v.service}`] : []),
    '',
    '*Message:*',
    v.message,
    '',
    '*Source:* LOSTIN404 Portfolio — Contact Page',
  ].join('\n')
}

export function whatsappUrl(v: ContactFormValues, number = brand.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildEnquiry(v))}`
}

type Status = { state: 'idle' } | { state: 'opened'; url: string } | { state: 'blocked'; url: string }

function FieldBlock({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label !text-bone/80">
        {label}{' '}
        {optional ? (
          <span className="normal-case tracking-normal text-mute">(optional)</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      {children}
      <p id={`${id}-error`} className="min-h-[1.25rem] text-[0.8125rem] text-[#ff8a8a]" aria-live="polite">
        {error}
      </p>
    </div>
  )
}

/** Chevron for the native select (appearance-none hides the browser's own arrow). */
const SELECT_ARROW =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EDE7DC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"

const inputClass =
  'w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-base text-bone sm:text-[0.9375rem] placeholder:text-mute/60 outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-expo hover:border-line-strong focus:border-volt-2 focus:bg-ink/80 focus:shadow-[0_0_0_3px_rgba(82,39,255,0.3)] aria-[invalid=true]:border-[#ff8a8a]/70'

/**
 * Two-column contact section (adapted from the "contact form" reference): heading, short
 * description and contact details on the left, the form on the right; stacked on mobile.
 *
 * Submitting opens WhatsApp with the enquiry prefilled. A wa.me link only *prepares* the
 * message — the visitor still taps Send — so this never reports the enquiry as delivered,
 * keeps the form filled in, and always offers a fallback link in case the new tab is blocked.
 */
export function ContactForm() {
  const uid = useId()
  const ids = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message`, service: `${uid}-service` }
  // /contact?service=web (from a service card) pre-selects that service; the visitor can change or clear it
  const [params] = useSearchParams()
  const preselected = services.find((s) => s.id === params.get('service'))?.title ?? ''
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const busy = useRef(false)
  const form = useRef<HTMLFormElement>(null)

  const read = (): ContactFormValues => {
    const data = new FormData(form.current!)
    return {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      service: String(data.get('service') ?? '').trim() || undefined,
    }
  }

  // Clear a field's error as soon as it becomes valid.
  const revalidate = (field: Field) => {
    if (!errors[field]) return
    const next = validate(read())
    setErrors((e) => ({ ...e, [field]: next[field] }))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy.current) return // ignore double-clicks while the tab is opening

    const values = read()
    const found = validate(values)
    setErrors(found)
    const first = (['name', 'email', 'message'] as Field[]).find((f) => found[f])
    if (first) {
      document.getElementById(ids[first])?.focus()
      setStatus({ state: 'idle' })
      return
    }

    busy.current = true
    window.setTimeout(() => (busy.current = false), 1200)

    const url = whatsappUrl(values)
    // Opened directly inside the submit handler, so it counts as a user action and isn't
    // treated as a popup. (No "noopener" feature here: with it, window.open always returns
    // null and a blocked tab could not be detected. The opener is cleared by hand instead.)
    const tab = window.open(url, '_blank')
    if (tab) {
      tab.opener = null
      setStatus({ state: 'opened', url })
    } else {
      setStatus({ state: 'blocked', url })
    }
  }

  return (
    <section
      aria-labelledby={`${uid}-title`}
      className="grid gap-10 border-t border-line pt-14 md:pt-20 lg:grid-cols-12 lg:gap-12"
      data-contact-form={status.state}
    >
      <div className="lg:col-span-5">
        <p className="label mb-4">[ Enquiry ]</p>
        <h2 id={`${uid}-title`} className="display text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold">
          Start a project on WhatsApp.
        </h2>
        <p className="lede mt-5 max-w-[28rem]">
          Tell me a little about what you have in mind. The form writes it up as a WhatsApp message to me, ready for you
          to send.
        </p>

        <ul className="mt-8 border-t border-line text-[0.9375rem]">
          <li className="flex items-center gap-4 border-b border-line py-4">
            <span className="text-mute">
              <SocialIcon id="whatsapp" size={18} />
            </span>
            <span className="min-w-0">
              <span className="label block">WhatsApp</span>
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-medium"
              >
                {brand.whatsappDisplay}
              </a>
            </span>
          </li>
          <li className="flex items-center gap-4 border-b border-line py-4">
            <Mail size={18} strokeWidth={1.5} className="shrink-0 text-mute" aria-hidden="true" />
            <span className="min-w-0">
              <span className="label block">Prefer email?</span>
              <a href={`mailto:${brand.email}`} className="link-underline break-all font-medium">
                {brand.email}
              </a>
            </span>
          </li>
          <li className="flex items-center gap-4 border-b border-line py-4">
            <MapPin size={18} strokeWidth={1.5} className="shrink-0 text-mute" aria-hidden="true" />
            <span>
              <span className="label block">Based in</span>
              <span className="font-medium">{brand.location}</span>
            </span>
          </li>
        </ul>
      </div>

      <div className="lg:col-span-7">
        <form
          ref={form}
          noValidate
          onSubmit={onSubmit}
          className="glass flex flex-col gap-2 rounded-[18px] p-5 sm:p-8"
          aria-describedby={`${uid}-note`}
        >
          <div className="grid gap-x-5 sm:grid-cols-2">
            <FieldBlock id={ids.name} label="Name" error={errors.name}>
              <input
                id={ids.name}
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                aria-invalid={!!errors.name}
                aria-describedby={`${ids.name}-error`}
                onChange={() => revalidate('name')}
                className={inputClass}
              />
            </FieldBlock>
            <FieldBlock id={ids.email} label="Email" error={errors.email}>
              <input
                id={ids.email}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={160}
                aria-invalid={!!errors.email}
                aria-describedby={`${ids.email}-error`}
                onChange={() => revalidate('email')}
                className={inputClass}
              />
            </FieldBlock>
          </div>
          <FieldBlock id={ids.service} label="Service" optional>
            <select
              id={ids.service}
              name="service"
              defaultValue={preselected}
              style={{ backgroundImage: SELECT_ARROW }}
              className={`${inputClass} appearance-none bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
            >
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
            <p className="min-h-[1.25rem]" aria-hidden="true" />
          </FieldBlock>
          <FieldBlock id={ids.message} label="Message" error={errors.message}>
            <textarea
              id={ids.message}
              name="message"
              rows={6}
              required
              maxLength={2000}
              aria-invalid={!!errors.message}
              aria-describedby={`${ids.message}-error`}
              onChange={() => revalidate('message')}
              className={`${inputClass} min-h-[9rem] resize-y`}
            />
          </FieldBlock>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="btn btn-primary w-full sm:w-auto" data-contact-submit>
              Continue to WhatsApp
              <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
            </button>
            <p id={`${uid}-note`} className="text-[0.8125rem] text-mute sm:max-w-[16rem] sm:text-right">
              WhatsApp will open with your message. Tap Send to finish your enquiry.
            </p>
          </div>

          {/* Status: never claims delivery — only that WhatsApp was opened. */}
          <div role="status" aria-live="polite" className="empty:hidden" data-contact-status>
            {status.state !== 'idle' && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line bg-ink/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-3 text-[0.875rem] text-bone/90">
                  <MessageCircle size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                  {status.state === 'opened'
                    ? 'WhatsApp opened in a new tab with your message. Tap Send there to finish your enquiry.'
                    : 'Your browser blocked the new tab. Use the button to open WhatsApp with your message.'}
                </p>
                <a
                  href={status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost !min-h-11 shrink-0"
                  data-contact-fallback
                >
                  Open WhatsApp
                  <ArrowUpRight size={16} className="arrow" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
