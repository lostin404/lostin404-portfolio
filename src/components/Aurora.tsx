import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useVisible } from '../hooks/useVisible'

const VERT = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

// Aurora curtain: a noise-driven height field tinted by a three-stop colour ramp.
const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform float uBlend;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 ramp(float t) {
  return t < 0.5
    ? mix(uColorStops[0], uColorStops[1], t * 2.0)
    : mix(uColorStops[1], uColorStops[2], (t - 0.5) * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 color = ramp(uv.x);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = uv.y * 2.0 - height + 0.2;
  float intensity = 0.6 * height;

  float mid = 0.20;
  float alpha = smoothstep(mid - uBlend * 0.5, mid + uBlend * 0.5, intensity);

  fragColor = vec4(intensity * color * alpha, alpha);
}`

const DEFAULT_STOPS: [string, string, string] = ['#3A29FF', '#5227FF', '#BFFF00']

type Props = {
  colorStops?: [string, string, string]
  amplitude?: number
  blend?: number
  speed?: number
  className?: string
}

/**
 * OGL aurora for the hero. Renders only while on screen and in a visible tab,
 * draws one static frame under prefers-reduced-motion, and falls back to a CSS
 * gradient when WebGL2 is unavailable.
 */
export function Aurora({
  colorStops = DEFAULT_STOPS,
  amplitude = 0.75,
  blend = 0.5,
  speed = 0.28,
  className = '',
}: Props) {
  const host = useRef<HTMLDivElement>(null)
  const visible = useVisible(host)
  const reduce = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const play = useRef<{ start: () => void; stop: () => void } | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return

    // OGL is loaded on demand so the WebGL code stays out of the initial bundle
    let disposed = false
    let cleanup = () => {}
    import('ogl')
      .then((ogl) => {
        if (!disposed) cleanup = init(ogl)
      })
      .catch(() => setFailed(true))
    return () => {
      disposed = true
      cleanup()
    }

    function init({ Color, Mesh, Program, Renderer, Triangle }: typeof import('ogl')): () => void {
      const host = el!
      let renderer: InstanceType<typeof Renderer>
      try {
        renderer = new Renderer({
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          dpr: 1, // a soft gradient gains nothing from retina resolution
          webgl: 2,
        })
        if (!renderer.gl || !(renderer.gl instanceof WebGL2RenderingContext)) throw new Error('webgl2 unavailable')
      } catch {
        setFailed(true)
        return () => {}
      }

      const gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      const canvas = gl.canvas as HTMLCanvasElement
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
      canvas.setAttribute('aria-hidden', 'true')

      const geometry = new Triangle(gl)
      if (geometry.attributes.uv) delete geometry.attributes.uv

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uBlend: { value: blend },
          uColorStops: {
            value: colorStops.map((hex) => {
              const c = new Color(hex)
              return [c.r, c.g, c.b]
            }),
          },
          uResolution: { value: [1, 1] },
        },
      })
      const mesh = new Mesh(gl, { geometry, program })

      const resize = () => {
        const w = host.offsetWidth
        const h = host.offsetHeight
        if (!w || !h) return
        renderer.setSize(w, h)
        program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight]
        if (!raf) renderer.render({ scene: mesh })
      }

      let raf = 0
      let last = 0
      let t = 6 // start mid-motion so the first frame already has shape
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame)
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
        last = now
        t += dt * speed * 4
        program.uniforms.uTime.value = t
        renderer.render({ scene: mesh })
      }

      play.current = {
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
      ro.observe(host)
      host.appendChild(canvas)
      program.uniforms.uTime.value = t
      resize()

      const onLost = (e: Event) => {
        e.preventDefault()
        play.current?.stop()
        setFailed(true)
      }
      canvas.addEventListener('webglcontextlost', onLost)
      setReady(true)

      return () => {
        play.current?.stop()
        play.current = null
        ro.disconnect()
        canvas.removeEventListener('webglcontextlost', onLost)
        canvas.remove()
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }
  }, [amplitude, blend, speed, colorStops])

  // Run the loop only when it can be seen.
  useEffect(() => {
    if (!play.current) return
    if (visible && !reduce) play.current.start()
    else play.current.stop()
  }, [visible, reduce, failed, ready])

  return (
    <div
      ref={host}
      className={`pointer-events-none absolute inset-0 ${className}`}
      data-aurora={failed ? 'fallback' : 'webgl'}
      style={
        failed
          ? {
              background:
                'radial-gradient(60% 55% at 22% 0%, rgba(58,41,255,.55), transparent 70%), radial-gradient(50% 50% at 62% 0%, rgba(82,39,255,.45), transparent 70%), radial-gradient(34% 40% at 92% 0%, rgba(191,255,0,.16), transparent 70%)',
            }
          : undefined
      }
    />
  )
}
