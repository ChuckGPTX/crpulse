'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = "/index.html";
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      Loading Chuck AI...
    </div>
  );
}
