'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) {
        dot.current.style.left = mx + 'px'
        dot.current.style.top = my + 'px'
      }
    }

    const tick = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ring.current) {
        ring.current.style.left = rx + 'px'
        ring.current.style.top = ry + 'px'
      }
      requestAnimationFrame(tick)
    }

    const big = () => {
      dot.current && (dot.current.style.transform = 'translate(-50%,-50%) scale(2)')
      ring.current && (ring.current.style.width = '52px') && (ring.current.style.height = '52px')
    }
    const small = () => {
      dot.current && (dot.current.style.transform = 'translate(-50%,-50%) scale(1)')
      ring.current && (ring.current.style.width = '34px') && (ring.current.style.height = '34px')
    }

    document.addEventListener('mousemove', move)
    requestAnimationFrame(tick)
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', big)
      el.addEventListener('mouseleave', small)
    })
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', big)
        el.addEventListener('mouseleave', small)
      })
    })
    obs.observe(document.body, { childList: true, subtree: true })
    return () => { document.removeEventListener('mousemove', move); obs.disconnect() }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" style={{ transition: 'transform .2s' }} />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
