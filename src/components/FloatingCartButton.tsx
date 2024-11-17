// Path: src\components\FloatingCartButton.tsx
import { useEffect, useRef } from 'react';
import CartSheet from '@/components/sheets/CartSheet';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag } from 'lucide-react';

const FloatingCartButton = () => {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItemCount = useCartStore((state) => state.cartItemCount());
  const cartRef = useRef<HTMLDivElement | null>(null);

  // Handle clicks outside the cart sheet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        toggleCart(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  return (
    <>
      {/* Cart Button */}
      <div className="relative">
        <button onClick={() => toggleCart()} className="relative flex items-center justify-center p-2 rounded-full">
          <ShoppingBag className="h-6 w-6 text-erf1-700 cursor-pointer" />
        </button>
        {cartItemCount > 0 && (
          <span className="animate-pulse absolute -top-1 right-1 bg-erf1-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </div>

      {/* Cart Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div ref={cartRef} className="w-full max-w-sm bg-white h-full p-4 shadow-lg">
            <CartSheet />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCartButton;
