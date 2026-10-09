# Grandfa Farm Cafe — Ambient Display

A full-screen, TV-oriented cafe atmosphere experience: a shuffled photography display, rotating vinyl, and a local-media audio player. It is intentionally a lightweight Vite + React + TypeScript app with no backend or streaming dependency.

## Start it

```bash
npm install
npm run dev
```

Open the URL Vite prints, then choose **Start experience**. Browsers require that first interaction before playing sound. For a TV, use the fullscreen button or press `F` after starting.

```bash
npm run build
npm run preview
```

## Media

The current project contains 12 cafe photos in `public/images/` and one local MP3 in `public/audio/song1.mp3`. `audio_player_interface.jpg` is deliberately excluded: it is reference artwork, not a slideshow photo.

To add media:

1. Copy cafe images to `public/images/` and supported audio (`.mp3`, `.wav`, `.ogg`, `.m4a`) to `public/audio/`.
2. Run `npm run generate:media` to inventory those files.
3. Run the app. The generated media inventory is the runtime source of truth; no component edits are needed.

Filenames containing spaces or parentheses are supported and safely URL-encoded. The slideshow uses a Fisher–Yates shuffled bag, so every usable photo displays once per cycle and the first item in a new cycle cannot repeat the previous cycle’s final item. Music has its own independent shuffle queue; track endings advance the persistent audio element without affecting photos.

## TV operation

- `Space`: play / pause
- `Left` / `Right`: seek 10 seconds
- `M`: mute / unmute
- `F`: toggle fullscreen

The app asks for a screen wake lock after Start Experience where the browser supports it. It is a best-effort feature and cannot override operating-system or TV sleep settings. It honors `prefers-reduced-motion` by disabling nonessential motion.

## Deployment and privacy

Deploy the output from `npm run build` as a static site (for example, GitHub Pages, Netlify, Cloudflare Pages, or a private local web server). A public GitHub repository exposes every committed image and MP3. Keep the repository private, omit the media, or use private asset hosting if the cafe’s music or photography is not licensed for public distribution.

## Troubleshooting

- **No sound:** press Start Experience or the play button; browsers block audible autoplay until a user gesture.
- **Audio unavailable:** confirm the file exists in `public/audio/`, regenerate/review the manifest, and check that the browser supports its format.
- **Photo missing:** remove the bad entry or restore the matching file. The slideshow skips failed images and keeps running.
- **Fullscreen does not open:** fullscreen must be invoked from a user interaction and may be disabled by kiosk/browser policy.

## Project notes

The project is prepared locally for GitHub but has not been initialized or pushed to any remote repository. No private files or credentials are included.
