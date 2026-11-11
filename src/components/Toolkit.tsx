import { useRef, type CSSProperties } from 'react'
import {
  Box,
  Camera,
  ChartColumn,
  Clapperboard,
  Fingerprint,
  Frame,
  Gauge,
  LayoutTemplate,
  PenTool,
  Printer,
  Search,
  Share2,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  TrendingUp,
  Type,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { ClipReveal } from './ClipReveal'
import { Reveal } from './Reveal'
import { useVisible } from '../hooks/useVisible'
import { toolkit } from '../data/site'

const ICONS: Record<string, LucideIcon> = {
  fingerprint: Fingerprint,
  'pen-tool': PenTool,
  type: Type,
  frame: Frame,
  printer: Printer,
  box: Box,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  search: Search,
  camera: Camera,
  clapperboard: Clapperboard,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  share: Share2,
  'trending-up': TrendingUp,
  'bar-chart': ChartColumn,
  users: Users,
  gauge: Gauge,
}

function Row({ items, reverse, duration }: { items: (typeof toolkit)[number]; reverse?: boolean; duration: number }) {
  const set = (hidden: boolean) => (
    <ul className="marquee-set" aria-hidden={hidden || undefined}>
      {items.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <li key={item.label} className="skill">
            <span className="skill-icon">
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="text-[0.9375rem] font-medium">{item.label}</span>
          </li>
        )
      })}
    </ul>
  )
  return (
    <div className="marquee" data-marquee={reverse ? 'right' : 'left'}>
      <div
        className={`marquee-track ${reverse ? 'reverse' : ''}`}
        style={{ '--marquee-dur': `${duration}s` } as CSSProperties}
      >
        {set(false)}
        {set(true)}
      </div>
    </div>
  )
}

/** Two rows of real disciplines moving in opposite directions; paused while off screen. */
export function Toolkit() {
  const ref = useRef<HTMLElement>(null)
  const visible = useVisible(ref, '100px')

  return (
    <section
      ref={ref}
      className="section overflow-hidden bg-ink"
      aria-labelledby="toolkit-title"
      style={{ '--marquee-state': visible ? 'running' : 'paused' } as CSSProperties}
    >
      <div className="wrap mb-12 grid gap-6 md:mb-14 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="label mb-4">[ Creative toolkit ]</p>
          <ClipReveal
            id="toolkit-title"
            text="Brand, web, cinema, social."
            className="display h-section"
            distance={100}
            stagger={18}
            duration={0.8}
          />
        </div>
        <Reveal className="md:col-span-5">
          <p className="lede">
            The disciplines behind every LOSTIN404 project — from the first mark to the last frame of the feed.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col gap-3">
        <Row items={toolkit[0]} duration={34} />
        <Row items={toolkit[1]} duration={30} reverse />
      </div>
    </section>
  )
}
