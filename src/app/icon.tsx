import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="256" cy="256" r="256" fill="#000000" />
        <path d="M176 336 L336 176 M336 176 H208 M336 176 V304" stroke="#ffffff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    { ...size }
  );
}
