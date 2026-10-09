import { useCallback, useEffect, useRef, useState } from 'react'
import type { Track } from '../data/mediaManifest'
import { shuffledBag } from '../utils/shuffle'

type AudioState = {
  currentIndex: number
  currentTime: number
  duration: number
  isPlaying: boolean
  isMuted: boolean
  volume: number
  shuffle: boolean
  loading: boolean
  error: string | null
}

export function useAudioPlayer(tracks: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const failureRef = useRef(new Set<number>())
  const queueRef = useRef<number[]>([])
  const indexRef = useRef(0)
  const shuffleRef = useRef(false)
  const [state, setState] = useState<AudioState>({
    currentIndex: 0, currentTime: 0, duration: 0, isPlaying: false,
    isMuted: false, volume: 0.72, shuffle: false, loading: false, error: null,
  })

  const setTrack = useCallback((index: number, shouldPlay = false) => {
    if (!tracks.length) return
    const safeIndex = ((index % tracks.length) + tracks.length) % tracks.length
    const audio = audioRef.current
    if (!audio) return
    indexRef.current = safeIndex
    audio.src = tracks[safeIndex].src
    audio.load()
    setState((old) => ({ ...old, currentIndex: safeIndex, currentTime: 0, duration: 0, loading: true, error: null }))
    if (shouldPlay) {
      void audio.play().catch(() => setState((old) => ({ ...old, isPlaying: false, loading: false, error: 'Playback needs a tap to begin.' })))
    }
  }, [tracks])

  const next = useCallback((shouldPlay = state.isPlaying) => {
    if (!tracks.length) return
    let index: number
    if (shuffleRef.current && tracks.length > 1) {
      if (!queueRef.current.length) queueRef.current = shuffledBag(tracks.map((_, itemIndex) => itemIndex), indexRef.current)
      index = queueRef.current.shift() ?? ((indexRef.current + 1) % tracks.length)
    } else {
      index = (indexRef.current + 1) % tracks.length
    }
    setTrack(index, shouldPlay)
  }, [setTrack, state.isPlaying, tracks])

  const previous = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 4) {
      audio.currentTime = 0
      return
    }
    setTrack(indexRef.current - 1, state.isPlaying)
  }, [setTrack, state.isPlaying])

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !tracks.length) return
    if (audio.paused) {
      if (!audio.src) setTrack(indexRef.current, false)
      try { await audio.play() } catch { setState((old) => ({ ...old, error: 'Playback was blocked. Please try again.' })) }
    } else audio.pause()
  }, [setTrack, tracks.length])

  const seek = useCallback((percentage: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(1, percentage)) * audio.duration
  }, [])

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current
    const nextVolume = Math.max(0, Math.min(1, volume))
    if (audio) { audio.volume = nextVolume; audio.muted = false }
    setState((old) => ({ ...old, volume: nextVolume, isMuted: false }))
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setState((old) => ({ ...old, isMuted: audio.muted }))
  }, [])

  const toggleShuffle = useCallback(() => {
    shuffleRef.current = !shuffleRef.current
    queueRef.current = []
    setState((old) => ({ ...old, shuffle: shuffleRef.current }))
  }, [])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = state.volume
    audioRef.current = audio
    const events: Array<[keyof HTMLMediaElementEventMap, EventListener]> = [
      ['loadedmetadata', () => setState((old) => ({ ...old, duration: audio.duration, loading: false }))],
      ['timeupdate', () => setState((old) => ({ ...old, currentTime: audio.currentTime }))],
      ['play', () => setState((old) => ({ ...old, isPlaying: true, loading: false, error: null }))],
      ['pause', () => setState((old) => ({ ...old, isPlaying: false }))],
      ['waiting', () => setState((old) => ({ ...old, loading: true }))],
      ['canplay', () => setState((old) => ({ ...old, loading: false }))],
      ['ended', () => next(true)],
      ['error', () => {
        failureRef.current.add(indexRef.current)
        if (failureRef.current.size >= tracks.length) {
          setState((old) => ({ ...old, isPlaying: false, loading: false, error: 'Audio is unavailable. Add a playable local track.' }))
        } else next(true)
      }],
    ]
    events.forEach(([event, listener]) => audio.addEventListener(event, listener))
    if (tracks.length) setTrack(0)
    return () => { events.forEach(([event, listener]) => audio.removeEventListener(event, listener)); audio.pause(); audio.src = ''; audioRef.current = null }
    // Audio is intentionally created once; tracks are a fixed generated manifest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, track: tracks[state.currentIndex], togglePlayback, next: () => next(), previous, seek, setVolume, toggleMute, toggleShuffle }
}
