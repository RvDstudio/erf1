// Path: src\components\Sidebar.tsx
'use client';
import { useState, useEffect } from 'react';
import { ArrowLeftSquareIcon, Tractor } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import SharedMenu from './SharedMenu';
import { Menus } from '@/constants/constants';

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [filteredMenus, setFilteredMenus] = useState(Menus);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from('profiles').select('isAdmin').eq('id', user.id).single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setFilteredMenus(Menus.filter((menu) => !menu.isAdmin || data?.isAdmin));
        }
      } else {
        setFilteredMenus([]);
      }
    };

    fetchAdminStatus();
  }, [supabase]);

  const toggleDropdown = (menuTitle: string) => {
    setExpandedMenu(expandedMenu === menuTitle ? null : menuTitle);
  };

  return (
    <div
      className={`${
        open ? 'w-64 lg:w-72 hidden md:block' : 'w-18 hidden md:block'
      } bg-[#374C69] dark:bg-[#171717] border-r border-light-white dark:border-[#2e2e2e] p-4 pt-4 h-screen sticky top-0 duration-300 z-40`}
    >
      <ArrowLeftSquareIcon
        onClick={() => setOpen(!open)}
        className={`text-white absolute -right-3 bg-[#374c69] top-5 cursor-pointer z-50 ${!open && 'rotate-180'}`}
      />
      <div className="flex gap-x-2 items-center border-b border-[#425b7b] pb-[18px]">
        <Tractor strokeWidth={1} className={`text-white pl-1 dark:text-white cursor-pointer duration-500 h-8 w-8`} />
        <h1 className={`text-white dark:text-white font-bold text-[22px] duration-200 ${!open && 'hidden'}`}>
          Erf1 <span className="text-[#6699CC]"> Bestellingen</span>
        </h1>
      </div>

      <SharedMenu menus={filteredMenus} open={open} expandedMenu={expandedMenu} toggleDropdown={toggleDropdown} />
    </div>
  );
};

export default Sidebar;
