import { getUserOrders } from './actions/getOrders';
import { createClient } from '@/utils/supabase/server';

import { OrdersTableClient } from './OrdersTableClient'; // Import the client component for interactivity

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return <p>User is not authenticated</p>;
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="pt-10 pl-10 pr-8 pb-10">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-medium mb-2 text-erf1-500">Bestellingen</h1>
        <OrdersTableClient orders={orders} />
      </div>
    </div>
  );
}
