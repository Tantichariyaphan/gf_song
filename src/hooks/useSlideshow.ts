import { useCallback, useEffect, useRef, useState } from 'react'
import type { Photo } from '../data/mediaManifest'
import { shuffledBag } from '../utils/shuffle'

export function useSlideshow(photos: Photo[], interval: number) {
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const bagRef = useRef<number[]>([])
  const lastRef = useRef<number | undefined>(undefined)
  const currentRef = useRef(0)
  const failedRef = useRef(new Set<number>())

  const next = useCallback(() => {
    const valid = photos.map((_, index) => index).filter((index) => !failedRef.current.has(index))
    if (!valid.length) return
    if (valid.length === 1) {
      setPrevious(null)
      setCurrent(valid[0])
      return
    }
    if (!bagRef.current.length) {
      bagRef.current = shuffledBag(valid, lastRef.current)
    }
    const nextIndex = bagRef.current.shift()
    if (nextIndex === undefined) return
    setPrevious(currentRef.current)
    currentRef.current = nextIndex
    setCurrent(nextIndex)
    lastRef.current = nextIndex
  }, [photos])

  const reportFailure = useCallback((index: number) => {
    failedRef.current.add(index)
    if (index === currentRef.current) next()
  }, [next])

  useEffect(() => {
    if (!photos.length) return undefined
    const firstBag = shuffledBag(photos.map((_, index) => index))
    const first = firstBag.shift() ?? 0
    bagRef.current = firstBag
    lastRef.current = first
    currentRef.current = first
    setCurrent(first)
    const timer = window.setInterval(next, interval)
    return () => window.clearInterval(timer)
  }, [interval, next, photos])

  return { current, previous, next, reportFailure }
}
