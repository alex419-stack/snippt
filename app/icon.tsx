import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

// Generiertes App-Icon: dunkler Grund mit leuchtendem „S".
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08080B',
          backgroundImage: 'radial-gradient(circle at 50% 32%, #5468FF, transparent 62%)',
          color: '#F4F2EE',
          fontSize: 320,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        S
      </div>
    ),
    { ...size },
  )
}
