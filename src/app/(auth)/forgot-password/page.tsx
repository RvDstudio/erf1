// Path: src\app\(auth)\forgot-password\page.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import { z } from 'zod';
import { forgotPassword } from './action';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email(),
});

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get('email') ?? ''),
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword({
        email: data.email,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        router.push('/forgot-password/confirmation');
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
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
            <Image width={150} height={150} src="/images/thumb2.png" alt="" />
          </div>

          <h1 className=" max-w-lg mx-auto text-xl md:text-2xl text-erf1-500 leading-tight mt-12">
            Reset uw wachtwoord
          </h1>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 flex flex-col gap-4 max-w-lg mx-auto">
            <div>
              <label className="block text-gray-700">Email Address</label>
              <Input
                type="email"
                placeholder="Voer je e-mailadres in"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                {...form.register('email')}
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
                'Reset Password'
              )}
            </Button>
          </form>

          <div className="flex justify-between items-center max-w-lg mx-auto">
            <p className="mt-8 text-gray-400">
              Ik weet mijn wachtwoord nog{' '}
              <Link href="/login" className="text-erf1-500 hover:text-erf1-400 font-semibold">
                Login
              </Link>
            </p>

            <p className="mt-8 text-gray-400">
              Heeft u geen account?{' '}
              <Link href="/register" className="text-erf1-500 hover:text-erf1-400 font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
