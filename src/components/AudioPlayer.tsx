import type { KeyboardEvent } from 'react'
import { Icon } from './Icon'
import { Waveform } from './Waveform'
import { formatTime } from '../utils/shuffle'

type Props = {
  track?: { title: string; artist: string }
  currentTime: number
  duration: number
  playing: boolean
  muted: boolean
  shuffle: boolean
  error: string | null
  onPlay: () => void
  onNext: () => void
  onPrevious: () => void
  onMute: () => void
  onShuffle: () => void
  onSeek: (value: number) => void
  onVolume: (value: number) => void
}

export function AudioPlayer(props: Props) {
  const progress = props.duration ? Math.min(100, (props.currentTime / props.duration) * 100) : 0
  const seekWithKeyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Home') props.onSeek(0)
    if (event.key === 'End') props.onSeek(1)
  }
  return (
    <section className="player" aria-label="Audio controls">
      <div className="track-meta">
        <span className="eyebrow">Now playing</span>
        <strong>{props.track?.title ?? 'No track available'}</strong>
        <span>{props.track?.artist ?? 'Add music to public/audio'}</span>
      </div>
      <Waveform playing={props.playing} />
      <div className="transport">
        <button type="button" className={props.shuffle ? 'is-active' : ''} onClick={props.onShuffle} aria-label="Toggle shuffle" aria-pressed={props.shuffle}><Icon name="shuffle" /></button>
        <button type="button" onClick={props.onPrevious} aria-label="Previous track"><Icon name="previous" /></button>
        <button type="button" className="play-button" onClick={props.onPlay} aria-label={props.playing ? 'Pause music' : 'Play music'}><Icon name={props.playing ? 'pause' : 'play'} /></button>
        <button type="button" onClick={props.onNext} aria-label="Next track"><Icon name="next" /></button>
        <button type="button" onClick={props.onMute} aria-label={props.muted ? 'Unmute' : 'Mute'}><Icon name={props.muted ? 'mute' : 'volume'} /></button>
      </div>
      <div className="progress-row">
        <span>{formatTime(props.currentTime)}</span>
        <input className="progress" type="range" min="0" max="100" value={progress} aria-label="Seek track" style={{ '--progress': `${progress}%` } as React.CSSProperties} onChange={(event) => props.onSeek(Number(event.target.value) / 100)} onKeyDown={seekWithKeyboard} />
        <span>{formatTime(props.duration)}</span>
      </div>
      <input className="volume" type="range" min="0" max="100" defaultValue="72" aria-label="Volume" onChange={(event) => props.onVolume(Number(event.target.value) / 100)} />
      {props.error && <p className="audio-error" role="status">{props.error}</p>}
    </section>
  )
}
