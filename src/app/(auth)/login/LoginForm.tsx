'use client';
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx
// Path: src\app\(auth)\login\LoginForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';
import { loginUser } from './action';
import GoogleSignin from './GoogleSignin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { passwordSchema } from '@/validation/passwordSchema';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const email = form.getValues('email');

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-white hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <Image src="/images/cow.png" alt="" className="w-full h-full object-cover" width={1000} height={1000} />
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <div className="flex justify-center items-center">
            <Image width={150} height={150} src="/images/thumb2.png" alt="" className="" />
          </div>

          <h1 className=" max-w-lg mx-auto text-xl md:text-2xl text-erf1-500 leading-tight mt-12">
            Log in op uw account
          </h1>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 flex flex-col gap-4 max-w-lg mx-auto">
            <div>
              <label className="block text-gray-400">E-mailadres</label>
              <Input
                type="email"
                placeholder="Voer je e-mailadres in"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                {...form.register('email')}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-400">Wachtwoord</label>
              <Input
                type="password"
                placeholder="Voer wachtwoord in"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                {...form.register('password')}
              />
            </div>

            {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}

            <div className="text-right mt-2">
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                className="text-sm font-semibold text-gray-400 hover:text-erf1-700 focus:text-erf1-700"
              >
                Wachtwoord vergeten?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full block bg-erf1-500 hover:bg-erf1-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wacht alstublieft
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>

          <hr className="my-6 border-gray-300 max-w-lg mx-auto" />

          <GoogleSignin />

          <p className="mt-8 text-gray-400 max-w-lg mx-auto">
            Een account nodig?{' '}
            <Link href="/register" className="text-erf1-500 hover:text-erf1-400 font-semibold">
              Maak een account aan
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
