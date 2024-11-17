// Path: src\components\FirstNameDialog.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FirstNameDialog = ({ onClose }: { onClose: () => void }) => {
  const supabase = createClient();
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!firstName) {
      setErrorMessage('Full name is required.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage('User not found. Please sign in again.');
        console.error('Error retrieving user:', userError);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: firstName }) // Updated to `full_name`
        .eq('id', user.id);

      if (error) {
        console.error('Error updating full name in Supabase:', error);
        setErrorMessage(`Update failed: ${error.message}`);
      } else {
        console.log('Full name updated successfully');
        onClose(); // Close dialog after successful submission
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Unexpected error during submission:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-erf1-500">Voltooi uw profiel</DialogTitle>
        <DialogDescription>Voer uw voornaam in om door te gaan.</DialogDescription>
        <Input
          placeholder="Voornaam"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-4 ring-offset-erf1-500 focus-visible:ring-erf1-500"
        />
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading} className="bg-erf1-500">
            {loading ? 'Opslaan...' : 'verzenden'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FirstNameDialog;
