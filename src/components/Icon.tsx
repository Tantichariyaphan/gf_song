import type { ReactNode, SVGProps } from 'react'

export type IconName = 'play' | 'pause' | 'previous' | 'next' | 'shuffle' | 'volume' | 'mute' | 'fullscreen' | 'music'

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<IconName, ReactNode> = {
    play: <path d="m9 5 10 7-10 7V5Z" fill="currentColor" stroke="none" />,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    previous: <><path d="M7 5v14M18 5l-8 7 8 7V5Z" fill="currentColor" stroke="none" /></>,
    next: <><path d="M17 5v14M6 5l8 7-8 7V5Z" fill="currentColor" stroke="none" /></>,
    shuffle: <><path d="M3 7h3c4 0 5 10 9 10h3" /><path d="m16 14 3 3-3 3M3 17h3c1.3 0 2.3-1.1 3.2-2.5M15 7h3" /><path d="m16 4 3 3-3 3" /></>,
    volume: <><path d="M4 10v4h3l4 3V7l-4 3H4Z" fill="currentColor" /><path d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10" /></>,
    mute: <><path d="M4 10v4h3l4 3V7l-4 3H4Z" fill="currentColor" /><path d="m16 9 5 5m0-5-5 5" /></>,
    fullscreen: <><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" /></>,
    music: <><path d="M9 18V6l10-2v12" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>{paths[name]}</svg>
}
