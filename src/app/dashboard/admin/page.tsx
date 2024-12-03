// Path: src\app\dashboard\admin\page.tsx
'use client';

import SummaryCard from '@/components/SummaryCard';
import ShowUsers from '@/components/admin/ShowUsers';
import OrdersTable from '@/components/admin/OrdersTable';
import InvoicesTable from '@/components/admin/InvoicesTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AdminPage() {
  return (
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#ECF0F6] dark:bg-[#171717]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Zuivel Orders"
          category="zuivel"
          description="Total ordered quantity"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icon-tabler-milk"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 6h8v-2a1 1 0 0 0 -1 -1h-6a1 1 0 0 0 -1 1v2z" />
              <path d="M16 6l1.094 1.759a6 6 0 0 1 .906 3.17v8.071a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8.071a6 6 0 0 1 .906 -3.17l1.094 -1.759" />
              <path d="M12 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M10 10h4" />
            </svg>
          }
        />
        <SummaryCard
          title="Kaas Orders"
          category="kaas"
          description="Total ordered quantity"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icon-tabler-cheese"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4.519 20.008l16.481 -.008v-3.5a2 2 0 1 1 0 -4v-3.5h-16.722" />
              <path d="M21 9l-9.385 -4.992c-2.512 .12 -4.758 1.42 -6.327 3.425c-1.423 1.82 -2.288 4.221 -2.288 6.854c0 2.117 .56 4.085 1.519 5.721" />
              <path d="M15 13v.01" />
              <path d="M8 13v.01" />
              <path d="M11 16v.01" />
            </svg>
          }
        />
        <SummaryCard
          title="Vlees Orders"
          category="vlees"
          description="Total ordered quantity"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icon-tabler-meat"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M13.62 8.382l1.966 -1.967a2 2 0 1 1 3.414 -1.415a2 2 0 1 1 -1.413 3.414l-1.82 1.821" />
              <path d="M5.904 18.596c2.733 2.734 5.9 4 7.07 2.829c1.172 -1.172 -.094 -4.338 -2.828 -7.071c-2.733 -2.734 -5.9 -4 -7.07 -2.829c-1.172 1.172 .094 4.338 2.828 7.071z" />
              <path d="M7.5 16l1 1" />
              <path d="M12.975 21.425c3.905 -3.906 4.855 -9.288 2.121 -12.021c-2.733 -2.734 -8.115 -1.784 -12.02 2.121" />
            </svg>
          }
        />
      </div>

      <div className="bg-white dark:bg-[#252525] p-8 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e]">
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <ShowUsers />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTable />
          </TabsContent>
          <TabsContent value="invoices">
            <InvoicesTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
