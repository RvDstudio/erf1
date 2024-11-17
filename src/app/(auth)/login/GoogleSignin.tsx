// Path: src\app\(auth)\login\GoogleSignin.tsx
'use client';
// Path: src\app\(auth)\login\GoogleSignin.tsx

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function GoogleSignin() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const supabase = createClient();

  const searchParams = useSearchParams();

  const next = searchParams.get('next');

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: 'Please try again.',
        description: 'There was an error logging in with Google.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }
  return (
    <div className="max-w-lg mx-auto">
      <Button type="button" className="w-full " variant="outline" onClick={signInWithGoogle} disabled={isGoogleLoading}>
        {isGoogleLoading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2"
          />
        )}{' '}
        Sign in with Google
      </Button>
    </div>
  );
}
