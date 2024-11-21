import { getInvoices } from './actions/getInvoices';
import { createClient } from '@/utils/supabase/server';
import { InvoicesTableClient } from './InvoicesTableClient';

export default async function InvoicesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return <p>User is not authenticated</p>;
  }

  const invoices = await getInvoices(user.id);

  return (
    <div className="pt-10 pl-10 pr-8 pb-10">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-medium mb-2 text-erf1-500">Facturen</h1>
        <InvoicesTableClient invoices={invoices} userId={user.id} />
      </div>
    </div>
  );
}
