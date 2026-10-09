export type PhotoAsset = {
  id: string;
  src: string;
  category: 'atmosphere' | 'cake';
  objectPosition?: string;
  duration?: number;
};

export type TrackAsset = {
  id: string;
  title: string;
  src: string;
};

export const photoManifest: PhotoAsset[] = [
  { id: 'asmosphere', src: '/images/asmosphere.jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'asmosphere-2', src: '/images/asmosphere (2).jpg', category: 'atmosphere', objectPosition: '50% 48%' },
  { id: 'asmosphere-3', src: '/images/asmosphere (3).jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'asmosphere-4', src: '/images/asmosphere (4).jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'asmosphere-5', src: '/images/asmosphere (5).jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'asmosphere-6', src: '/images/asmosphere (6).jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'asmosphere-7', src: '/images/asmosphere (7).jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'asmosphere-8', src: '/images/asmosphere (8).jpg', category: 'atmosphere', objectPosition: '50% 52%' },
  { id: 'cake', src: '/images/cake.jpg', category: 'cake', objectPosition: '50% 52%' },
  { id: 'cake-2', src: '/images/cake (2).jpg', category: 'cake', objectPosition: '50% 52%' },
  { id: 'cake-3', src: '/images/cake (3).jpg', category: 'cake', objectPosition: '50% 52%' },
  { id: 'cake-4', src: '/images/cake (4).jpg', category: 'cake', objectPosition: '50% 52%' },
];

export const trackManifest: TrackAsset[] = [
  { id: 'song1', title: 'Grandfa Ambient', src: '/audio/song1.mp3' },
];
