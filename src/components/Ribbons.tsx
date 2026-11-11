import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useScroll } from 'motion/react'
import { ClipReveal } from './ClipReveal'
import { Reveal } from './Reveal'
import { useVisible } from '../hooks/useVisible'
import { about, brand } from '../data/site'

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

// Three sine-driven ribbons, composited additively so crossings bloom.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;

vec3 ribbon(vec2 p, float t, float seed, vec3 col, float amp, float freq, float thick) {
  float y = sin(p.x * freq + t * 0.9 + seed) * amp
          + sin(p.x * freq * 0.43 - t * 0.55 + seed * 1.7) * amp * 0.55;
  // the ribbon "twists": its visible width swells and pinches along its length
  float w = thick * (0.3 + 0.7 * abs(sin(p.x * 0.9 + t * 0.35 + seed * 2.1)));
  float d = abs(p.y - y);
  float body = smoothstep(w, w * 0.12, d);
  float fold = 0.5 + 0.5 * sin(p.x * freq * 2.0 + t + seed);
  float bloom = 0.012 / (d + 0.035);
  return col * (body * (0.35 + 0.65 * fold) + bloom);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  p.y += 0.04;
  float t = uTime + uScroll * 2.6;

  vec3 c = vec3(0.0);
  c += ribbon(p, t,        0.0, vec3(0.23, 0.16, 1.00), 0.17, 2.1, 0.085); // indigo
  c += ribbon(p, t * 1.15, 2.1, vec3(0.14, 0.40, 1.00), 0.21, 1.6, 0.070); // electric blue
  c += ribbon(p, t * 0.85, 4.3, vec3(0.52, 0.22, 1.00), 0.13, 2.8, 0.060); // violet

  // faint cyan where the light stacks up
  float stack = max(0.0, c.r + c.g + c.b - 1.5);
  c += vec3(0.10, 0.85, 1.00) * stack * 0.16;

  // fade toward the edges so the canvas melts into the section
  float edge = smoothstep(0.0, 0.18, gl_FragCoord.y / uRes.y) * smoothstep(1.0, 0.82, gl_FragCoord.y / uRes.y);
  c *= edge;

  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  gl_FragColor = vec4(c, a);
}`

type Painter = {
  draw: (t: number, scroll: number) => void
  resize: (w: number, h: number) => void
  dispose: () => void
}

function createGL(canvas: HTMLCanvasElement): Painter | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uRes = gl.getUniformLocation(prog, 'uRes')
  const uTime = gl.getUniformLocation(prog, 'uTime')
  const uScroll = gl.getUniformLocation(prog, 'uScroll')
  gl.clearColor(0, 0, 0, 0)

  return {
    resize: (w, h) => {
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    },
    draw: (t, scroll) => {
      gl.uniform1f(uTime, t)
      gl.uniform1f(uScroll, scroll)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    dispose: () => {
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

/** Canvas 2D stand-in with the same three ribbons, used when WebGL is unavailable. */
function create2D(canvas: HTMLCanvasElement): Painter | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  let W = 1
  let H = 1
  const bands = [
    { seed: 0.0, color: '58,41,255', amp: 0.17, freq: 2.1, thick: 0.085, rate: 1 },
    { seed: 2.1, color: '36,102,255', amp: 0.21, freq: 1.6, thick: 0.07, rate: 1.15 },
    { seed: 4.3, color: '133,56,255', amp: 0.13, freq: 2.8, thick: 0.06, rate: 0.85 },
  ]
  return {
    resize: (w, h) => {
      W = w
      H = h
    },
    draw: (time, scroll) => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      const aspect = W / H
      for (const b of bands) {
        const t = (time + scroll * 2.6) * b.rate
        for (const [width, alpha] of [
          [b.thick * 2.6, 0.1],
          [b.thick * 1.1, 0.32],
          [b.thick * 0.3, 0.55],
        ]) {
          ctx.beginPath()
          for (let i = 0; i <= 80; i++) {
            const px = (i / 80 - 0.5) * aspect
            const py =
              Math.sin(px * b.freq + t * 0.9 + b.seed) * b.amp +
              Math.sin(px * b.freq * 0.43 - t * 0.55 + b.seed * 1.7) * b.amp * 0.55
            const x = (i / 80) * W
            const y = H * (0.5 - py)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.strokeStyle = `rgba(${b.color},${alpha})`
          ctx.lineWidth = width * H
          ctx.stroke()
        }
      }
    },
    dispose: () => ctx.clearRect(0, 0, W, H),
  }
}

/**
 * Experimental feature: flowing light ribbons behind the LOSTIN404 creative philosophy.
 * Separate from the hero aurora; renders only while on screen, caps DPR, and draws a
 * single still frame under prefers-reduced-motion.
 */
export function Ribbons() {
  const section = useRef<HTMLElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const visible = useVisible(section)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const [mode, setMode] = useState<'webgl' | '2d' | 'none'>('none')
  const loop = useRef<{ start: () => void; stop: () => void } | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const makeCanvas = () => {
      const c = document.createElement('canvas')
      c.setAttribute('aria-hidden', 'true')
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
      return c
    }

    let target = makeCanvas()
    let painter = createGL(target)
    let kind: 'webgl' | '2d' = 'webgl'
    if (!painter) {
      // a canvas only ever hands out one context type, so the 2D fallback needs its own
      target = makeCanvas()
      painter = create2D(target)
      kind = '2d'
    }
    if (!painter) return
    host.appendChild(target)
    setMode(kind)

    let raf = 0
    let last = 0
    let t = 3.2
    const paint = () => painter!.draw(t, scrollYProgress.get())

    const resize = () => {
      // soft light upscales cleanly, so render below native resolution to keep the GPU cost low
      const dpr = window.innerWidth < 768 ? 0.75 : 1
      const w = Math.max(1, Math.round(target.clientWidth * dpr))
      const h = Math.max(1, Math.round(target.clientHeight * dpr))
      if (target.width !== w || target.height !== h) {
        target.width = w
        target.height = h
      }
      painter!.resize(w, h)
      if (!raf) paint()
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      t += dt * 0.35
      paint()
    }

    loop.current = {
      start: () => {
        if (raf) return
        host.dataset.running = 'true'
        last = 0
        raf = requestAnimationFrame(frame)
      },
      stop: () => {
        cancelAnimationFrame(raf)
        host.dataset.running = 'false'
        raf = 0
      },
    }

    const ro = new ResizeObserver(resize)
    ro.observe(target)
    resize()

    return () => {
      loop.current?.stop()
      loop.current = null
      ro.disconnect()
      painter!.dispose()
      target.remove()
    }
  }, [scrollYProgress])

  useEffect(() => {
    if (!loop.current) return
    if (visible && !reduce) loop.current.start()
    else loop.current.stop()
  }, [visible, reduce, mode])

  return (
    <section
      ref={section}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black"
      aria-labelledby="ribbons-title"
      data-ribbons={mode}
    >
      <div ref={hostRef} aria-hidden="true" className="absolute inset-0 -z-20" />
      {/* veil so the type always wins */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,.86) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.1) 100%), linear-gradient(180deg, #000 0%, transparent 18%, transparent 82%, #0a0c0e 100%)',
        }}
      />

      <div className="wrap py-28">
        <p className="label mb-6">[ {brand.signature} ]</p>
        <ClipReveal
          id="ribbons-title"
          text="Every pixel, every frame, every word is deliberate."
          className="display max-w-[16ch] text-[clamp(2.25rem,6.4vw,5.5rem)]"
          distance={100}
          stagger={14}
          duration={0.85}
        />
        <Reveal className="mt-8 max-w-[34rem]">
          <p className="lede !text-bone/80">{about.philosophy}</p>
          <p className="label mt-8">Creative philosophy — {brand.name}</p>
        </Reveal>
      </div>
    </section>
  )
}
