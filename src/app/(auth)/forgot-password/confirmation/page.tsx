// Path: src\app\(auth)\forgot-password\confirmation\page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export default function RegistrationConfirmation() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[540px] text-center">
        <CardHeader>
          <Image src="/images/thumb2.png" alt="Logo" className="mx-auto mb-4" width={150} height={150} />
          <CardTitle className="text-2xl text-erf1-500">Controleer uw e-mail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <Mail className="h-16 w-16 text-erf1-500" />
          </div>
          <p className="text-erf1-500 mb-4">
            We hebben een wachtwoord reset link naar uw e-mailadres gestuurd. Controleer uw inbox en klik op de link om
            uw wachtwoord te resetten.
          </p>
          <p className="text-sm text-erf1-500">Als u de e-mail niet ziet, controleer dan uw spamfolder.</p>
        </CardContent>
      </Card>
    </main>
  );
}
