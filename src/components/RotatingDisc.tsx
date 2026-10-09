export function RotatingDisc({ playing }: { playing: boolean }) {
  return (
    <div className={`disc-shell ${playing ? 'disc-shell--playing' : ''}`} aria-hidden="true">
      <img className="disc" src="/images/cd.png" alt="" />
      <div className="disc-label"><img src="/images/Logo.jpg" alt="" /></div>
    </div>
  )
}
