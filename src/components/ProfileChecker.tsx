// Path: src\components\ProfileChecker.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import FirstNameDialog from '@/components/FirstNameDialog';

const ProfileChecker = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const [showDialog, setShowDialog] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Indicate component is mounted

    const checkProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();

        if (!data?.full_name) {
          setShowDialog(true);
        }
      }
    };

    checkProfile();
  }, [supabase]);

  if (!hasMounted) return null; // Only render after mount

  return (
    <>
      {children}
      {showDialog && <FirstNameDialog onClose={() => setShowDialog(false)} />}
    </>
  );
};

export default ProfileChecker;
