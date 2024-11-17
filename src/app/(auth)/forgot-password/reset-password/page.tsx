// Path: src\app\(auth)\forgot-password\reset-password\page.tsx
'use client';
// Path: src\app\(auth)\forgot-password\reset-password\page.tsx
// Path: src\app\(auth)\forgot-password\reset-password\page.tsx
// Path: src\app\(auth)\forgot-password\reset-password\page.tsx
// Path: src\app\(auth)\forgot-password\reset-password\page.tsx
// Path: src\app\(auth)\forgot-password\reset-password\page.tsx
// Path: src\app\(auth)\forgot-password\reset-password\page.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { z } from 'zod';
import { resetPasswordFunc } from './action';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
});

export default function ResetPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await resetPasswordFunc({
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Error during password reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-white hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <Image width={1000} height={1000} src="/images/cow.png" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <div className="flex justify-center items-center">
            <Image width={150} height={150} src="/images/thumb2.png" alt="" className="" />
          </div>

          <h1 className="text-xl md:text-2xl text-erf1-500 leading-tight mt-12">Stel een nieuw wachtwoord in</h1>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 flex flex-col gap-4 max-w-lg mx-auto">
            <div>
              <label className="block text-gray-700">Nieuw wachtwoord</label>
              <Input
                type="password"
                placeholder="Voer een nieuw wachtwoord in"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                {...form.register('password')}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Bevestig je nieuwe wachtwoord</label>
              <Input
                type="password"
                placeholder="Bevestig je nieuwe wachtwoord"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                {...form.register('passwordConfirm')}
              />
            </div>

            {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}

            <Button
              type="submit"
              className="w-full block bg-erf1-500 hover:bg-erf1-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
