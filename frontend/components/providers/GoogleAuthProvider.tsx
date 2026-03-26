'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn('Google Client ID is missing. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
