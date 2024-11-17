// Path: src\components\admin\ShowUsers.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Switch } from '@/components/ui/switch'; // Assuming Switch is from shadcn

interface User {
  id: string;
  isAdmin: boolean;
  isUitgekookt: boolean;
  full_name: string;
}

export default function ShowUsers() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('id, isAdmin, isUitgekookt, full_name');

      if (error) {
        console.error('Error fetching users:', error.message);
      } else {
        setUsers(data as User[]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [supabase]);

  const toggleRole = async (userId: string, role: 'isAdmin' | 'isUitgekookt', currentValue: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [role]: !currentValue })
      .eq('id', userId);

    if (error) {
      console.error(`Error updating ${role} for user ${userId}:`, error.message);
    } else {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, [role]: !currentValue } : user))
      );
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="pt-4">
      <h2 className="text-xl mb-4 text-erf1-500">Beheer gebruikersrollen</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b font-normal text-erf1-500">Voor Naam</th>
            <th className="p-2 border-b font-normal text-erf1-500">Admin</th>
            <th className="p-2 border-b font-normal text-erf1-500">Uitgekookt</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border-b">{user.full_name}</td>
              <td className="p-2 border-b">
                <Switch checked={user.isAdmin} onCheckedChange={() => toggleRole(user.id, 'isAdmin', user.isAdmin)} />
              </td>
              <td className="p-2 border-b">
                <Switch
                  checked={user.isUitgekookt}
                  onCheckedChange={() => toggleRole(user.id, 'isUitgekookt', user.isUitgekookt)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
