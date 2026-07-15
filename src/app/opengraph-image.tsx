import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <svg viewBox="0 0 512 512" width="256" height="256" xmlns="http://www.w3.org/2000/svg">
          <circle cx="256" cy="256" r="256" fill="#000000" />
          <path d="M176 336 L336 176 M336 176 H208 M336 176 V304" stroke="#ffffff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div style={{ marginLeft: 60, fontSize: 130, fontWeight: 800, color: '#000000', fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
          橙子 AI
        </div>
      </div>
    ),
    { ...size }
  );
}
