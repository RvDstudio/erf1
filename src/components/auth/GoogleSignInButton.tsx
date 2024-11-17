// Path: src\components\auth\GoogleSignInButton.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function GoogleSignInButton() {
  const supabase = createClientComponentClient();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="max-w-lg mx-auto flex items-center justify-center bg-erf1-500 w-full rounded-md px-4 py-3 font-semibold mb-4 text-white hover:bg-erf1-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google mr-3"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
      </svg>
      Inloggen met Google
    </button>
  );
}
