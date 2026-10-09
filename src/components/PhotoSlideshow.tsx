import { useEffect } from 'react'
import { photos, slideshowIntervalMs } from '../data/mediaManifest'
import { useSlideshow } from '../hooks/useSlideshow'

export function PhotoSlideshow() {
  const { current, previous, reportFailure } = useSlideshow(photos, slideshowIntervalMs)
  const currentPhoto = photos[current]
  const previousPhoto = previous === null ? null : photos[previous]

  useEffect(() => {
    const next = photos[(current + 1) % photos.length]
    if (next) { const image = new Image(); image.src = next.src }
  }, [current])

  return (
    <div className="slideshow" aria-label="Grandfa Farm Cafe photography">
      {previousPhoto && <img className="photo photo--leaving" src={previousPhoto.src} style={{ objectPosition: previousPhoto.position }} alt="" />}
      <img key={currentPhoto.id} className="photo photo--active" src={currentPhoto.src} style={{ objectPosition: currentPhoto.position }} alt="Grandfa Farm Cafe" onError={() => reportFailure(current)} />
      <div className="photo-wash" />
    </div>
  )
}
