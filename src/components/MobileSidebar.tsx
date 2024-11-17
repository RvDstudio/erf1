// src\components\MobileSidebar.tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Tractor } from 'lucide-react';
import { useState } from 'react';
import SharedMenu from './SharedMenu';
import { Menus } from '../constants/constants';

export function MobileSidebar() {
  const [open, setOpen] = useState<boolean>(false);
  const toggleSidebar = () => setOpen(!open);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleDropdown = (menuTitle: string) => {
    setExpandedMenu(expandedMenu === menuTitle ? null : menuTitle);
  };

  return (
    <Sheet key="left">
      <SheetTrigger asChild onClick={toggleSidebar}>
        <Menu className="h-6 w-6 pr-1 text-[#888888]" />
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className={`w-[300px] bg-[#374c69] dark:bg-[#374c69] border-r border-[#374c69] ${open ? 'open' : 'closed'}`}
      >
        <div className="flex gap-x-2 items-center border-b border-[#425b7b] pb-[18px]">
          <Tractor strokeWidth={1} className={`text-white pl-1 dark:text-white cursor-pointer duration-500 h-8 w-8`} />
          <h1 className="text-white dark:text-white font-bold text-[22px]">
            Erf1 <span className="text-[#6699CC]"> Bestellingen</span>
          </h1>
        </div>

        <SharedMenu menus={Menus} open={open} expandedMenu={expandedMenu} toggleDropdown={toggleDropdown} />
      </SheetContent>
    </Sheet>
  );
}
