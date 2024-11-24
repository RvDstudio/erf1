// Path: src\app\dashboard\success\page.tsx
'use client';
// src/app/success/page.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Set width and height only on the client side
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    clearCart(); // Clear the cart when the success page loads
  }, [clearCart]);

  return (
    <div className="relative flex flex-col items-center justify-center h-[100%] w-full">
      {/* Confetti effect */}
      {dimensions.width && dimensions.height ? (
        <Confetti recycle={false} numberOfPieces={300} width={dimensions.width} height={dimensions.height} />
      ) : null}
      {/* Success Image */}
      <div className="mb-0">
        <Image
          src="/images/success.png" // Replace with your success image path
          alt="Success Icon"
          width={500}
          height={500}
          className=""
        />
      </div>

      {/* Success Message */}
      <h1 className="text-3xl text-erf1-700 mb-4 -mt-6">Success!</h1>
      <p className="text-lg text-gray-700 mb-8">Uw bestelling is succesvol geplaatst.</p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 text-xs bg-erf1-500 text-white font-semibold rounded-md hover:bg-erf1-600 focus:outline-none"
        >
          Ga naar Dashboard
        </button>
        <button
          onClick={() => router.push('/dashboard/order_history')}
          className="px-6 py-2 text-xs bg-erf1-700 text-white font-semibold rounded-md hover:bg-erf1-600 focus:outline-none"
        >
          Bekijk bestelling
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
