import { useCallback, useEffect, useRef, useState } from 'react'
import { AudioPlayer } from './components/AudioPlayer'
import { Icon } from './components/Icon'
import { PhotoSlideshow } from './components/PhotoSlideshow'
import { RotatingDisc } from './components/RotatingDisc'
import { tracks } from './data/mediaManifest'
import { useAudioPlayer } from './hooks/useAudioPlayer'

function editableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
}

export default function App() {
  const player = useAudioPlayer(tracks)
  const [started, setStarted] = useState(false)
  const [immersive, setImmersive] = useState(false)
  const wakeLock = useRef<WakeLockSentinel | null>(null)

  const requestWakeLock = useCallback(async () => {
    try { wakeLock.current = await navigator.wakeLock?.request('screen') ?? null } catch { /* Browser policy can decline it. */ }
  }, [])

  const startExperience = useCallback(() => {
    setStarted(true)
    player.togglePlayback()
    void requestWakeLock()
  }, [player, requestWakeLock])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* Fullscreen requires browser support and a user gesture. */ }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (editableTarget(event.target)) return
      if (event.code === 'Space') { event.preventDefault(); player.togglePlayback() }
      if (event.code === 'ArrowLeft') { event.preventDefault(); player.seek(Math.max(0, player.duration ? (player.currentTime - 10) / player.duration : 0)) }
      if (event.code === 'ArrowRight') { event.preventDefault(); player.seek(player.duration ? Math.min(1, (player.currentTime + 10) / player.duration) : 0) }
      if (event.key.toLowerCase() === 'm') player.toggleMute()
      if (event.key.toLowerCase() === 'f') void toggleFullscreen()
    }
    const onVisibilityChange = () => { if (document.visibilityState === 'visible' && started) void requestWakeLock() }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => { window.removeEventListener('keydown', onKeyDown); document.removeEventListener('visibilitychange', onVisibilityChange); wakeLock.current?.release().catch(() => undefined) }
  }, [player, requestWakeLock, started, toggleFullscreen])

  return (
    <main className={`ambient-scene ${immersive ? 'ambient-scene--immersive' : ''}`}>
      <PhotoSlideshow />
      <div className="scene-grain" aria-hidden="true" />
      <aside className="record-area"><RotatingDisc playing={player.isPlaying} /></aside>
      <div className="player-area">
        <AudioPlayer track={player.track} currentTime={player.currentTime} duration={player.duration} playing={player.isPlaying} muted={player.isMuted} shuffle={player.shuffle} error={player.error} onPlay={player.togglePlayback} onNext={player.next} onPrevious={player.previous} onMute={player.toggleMute} onShuffle={player.toggleShuffle} onSeek={player.seek} onVolume={player.setVolume} />
      </div>
      <div className="scene-actions">
        <button type="button" onClick={() => setImmersive((value) => !value)} aria-pressed={immersive}>Hide controls</button>
        <button type="button" onClick={() => void toggleFullscreen()} aria-label="Toggle fullscreen"><Icon name="fullscreen" /></button>
      </div>
      {!started && <section className="start-gate" aria-label="Start Grandfa Cafe atmosphere"><div><span className="gate-mark"><Icon name="music" /></span><p>Grandfa Farm Cafe</p><h1>Settle into the atmosphere.</h1><button type="button" onClick={startExperience}><Icon name="play" /> Start experience</button><small>Sound begins after you choose to play.</small></div></section>}
    </main>
  )
}
