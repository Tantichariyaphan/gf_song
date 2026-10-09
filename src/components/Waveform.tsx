export function Waveform({ playing }: { playing: boolean }) {
  return <div className={`waveform ${playing ? 'waveform--active' : ''}`} aria-label={playing ? 'Audio playing' : 'Audio paused'}>{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--delay': `${index * -0.12}s`, '--height': `${10 + ((index * 17) % 24)}px` } as React.CSSProperties} />)}</div>
}
