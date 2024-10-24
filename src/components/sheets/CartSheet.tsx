// Path: src\components\sheets\CartSheet.tsx
import { useCartStore } from '@/store/cartStore';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { Product } from '@/types/types';

const CartSheet = () => {
  const items = useCartStore((state) => state.items) as Product[];
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return items
      .reduce((acc, item) => {
        const price = item.discountPrice || item.price;
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);
  }, [items]);

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Uw winkelwagen</h2>
      {items.length > 0 ? (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.discountPrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">${item.discountPrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <p className="text-gray-700">${item.price.toFixed(2)}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(Number(item.id), 'decrease')}
                        className="bg-gray-200 text-gray-600 px-2 rounded"
                      >
                        −
                      </button>
                      <div>{item.quantity}</div>
                      <button
                        onClick={() => updateQuantity(Number(item.id), 'increase')}
                        className="bg-gray-200 text-gray-600 px-2 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFromCart(Number(item.id))} className="text-erf1-700 hover:text-erf1-600">
                  <Trash size={22} />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <div>Total Price:</div>
              <div>${totalPrice}</div>
            </div>
          </div>

          <button
            className="mt-4 w-full bg-erf1-700 text-white p-2 rounded hover:bg-erf1-600"
            onClick={() => alert('Proceeding to checkout...')}
          >
            Afrekenen
          </button>
        </>
      ) : (
        <p className="text-gray-500">Uw winkelwagen is leeg.</p>
      )}
    </div>
  );
};

export default CartSheet;
