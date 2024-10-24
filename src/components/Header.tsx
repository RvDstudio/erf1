// Path: src\components\Header.tsx
'use client';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { User } from '@/types/types';
import { MobileSidebar } from './MobileSidebar';
import { FC } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import FloatingCartButton from '@/components/FloatingCartButton';

const AvatarFallback: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('/images/default.png');
  const supabase = createClient();

  // Get item counts from Zustand store
  const wishlistItemCount = useCartStore((state) => state.wishlistItemCount());

  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user as unknown as User);
        const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();

        if (data?.avatar_url) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);

          setAvatarUrl(publicUrl || '/images/default.png');
        }
      }
    }

    getUserData();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-[#2e2e2e]">
      <div className="flex items-center space-x-4">
        <div className="md:hidden">
          <MobileSidebar />
        </div>
        {user && (
          <div className="text-sm font-bold text-[#888888]">
            Welkom terug: <span className="text-[#6699CC]">{user.email}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-8"></div>
      <div className="flex items-center space-x-4">
        <div>
          <ThemeToggle />
        </div>

        {/* Wishlist Icon */}
        <Link href="/dashboard/wishlist">
          <div className="relative rounded-full">
            <Heart className="h-6 w-6 text-gray-700 cursor-pointer" />
            {wishlistItemCount > 0 && (
              <span className="animate-pulse absolute -top-3 -right-2 bg-erf1-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistItemCount}
              </span>
            )}
          </div>
        </Link>

        {/* Cart Button */}
        <FloatingCartButton />

        <div className="flex items-center space-x-2">
          {user ? (
            <Link href="/dashboard/account">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={`${user?.email}'s Avatar`} />
                <AvatarFallback>
                  <Image src="/images/default.png" alt="Default Avatar" width={32} height={32} />
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
