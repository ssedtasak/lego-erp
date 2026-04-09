'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const next = params.get('next') || '/';

    if (code) {
      window.location.href = next;
    } else {
      window.location.href = '/login?error=auth_failed';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>กำลังยืนยันตัวตน...</p>
    </div>
  );
}
