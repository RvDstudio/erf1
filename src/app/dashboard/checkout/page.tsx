'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUitgekookt, setIsUitgekookt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError('Failed to retrieve session.');
        console.error('Session error:', sessionError);
        setLoading(false);
        return;
      }

      const userId = sessionData.session?.user.id;
      setUserId(userId || null);

      if (userId) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('isUitgekookt')
          .eq('id', userId)
          .single();

        if (profileError) {
          setError('Failed to retrieve user profile.');
          console.error('Profile error:', profileError);
        } else {
          setIsUitgekookt(profileData?.isUitgekookt || false);
        }
      }
      setLoading(false);
    };
    fetchSession();
  }, [supabase]);

  const discountRate = isUitgekookt ? 0.1 : 0;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (paymentMethod === 'stripe') {
        const response = await fetch('/api/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            items: items.map((item) => ({
              name: item.name,
              unit_amount: item.price,
              quantity: item.quantity,
              imageUrl: item.imageUrl || '/fallback-image.jpg',
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      } else if (paymentMethod === 'invoice') {
        const response = await fetch('/api/userInvoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            status: 'niet betaald',
            totalAmount: total,
            items: items.map((item) => ({
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
              imageUrl: item.imageUrl || '/fallback-image.jpg',
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        router.push('/dashboard/success');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 pl-10 pr-8 pb-10">
      <h2 className="mb-6 text-xl text-erf1-500">Uw Winkelwagen</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b text-erf1-500">
                  <th className="text-left pb-4 font-normal">Product</th>
                  <th className="text-center pb-4 font-normal">Aantal</th>
                  <th className="text-right pb-4 font-normal">Prijs</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-4 flex items-center space-x-4">
                      <Image
                        src={item.imageUrl || '/fallback-image.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                      />
                      <div>
                        <div className="text-erf1-500">{item.name}</div>
                        <div className="text-gray-500">{item.description}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => updateQuantity(item.id, 'decrease')} className="p-1 border rounded">
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 'increase')} className="p-1 border rounded">
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right">€{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl text-erf1-500 mb-4">Uw bestelling</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotaal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Korting</span>
              <span>€{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mb-4 text-gray-600">
              <span>Totaalbedrag</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
            <div className="mb-4">
              <label className="block text-xl text-erf1-500 mb-4">Betaalmethode:</label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="mr-2"
                  />
                  Betaal met Stripe
                </label>
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="invoice"
                    checked={paymentMethod === 'invoice'}
                    onChange={() => setPaymentMethod('invoice')}
                    className="mr-2"
                  />
                  Vraag Factuur Aan
                </label>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full mb-4 bg-erf1-700 hover:bg-erf1-600" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Bezig...' : paymentMethod === 'stripe' ? 'Betaal Nu' : 'Factuur Aanvragen'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
