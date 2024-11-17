// Path: src\components\SharedMenu.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Menus } from '@/constants/constants';

interface SharedMenuProps {
  menus: typeof Menus;
  open: boolean;
  expandedMenu: string | null;
  toggleDropdown: (title: string) => void;
}

const SharedMenu: React.FC<SharedMenuProps> = ({ menus, open, toggleDropdown }) => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  return (
    <ul className="pt-4 space-y-4">
      {menus.map((menu, index) => (
        <div key={index}>
          {menu.gap && <div className="my-4 border-t border-dashed border-[#6699CC] dark:border-gray-600" />}
          <li>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div onClick={() => (menu.children ? toggleDropdown(menu.title) : null)}>
                    <Link
                      className={`w-full flex items-center space-x-2 hover:bg-[#6699CC] dark:hover:bg-[#292929] active:bg-gray-300 py-2.5 px-2.5 rounded-lg text-white ${
                        isActive(menu.path) ? 'bg-[#30425b] border border-[#3f5777] text-white dark:bg-[#292929]' : ''
                      }`}
                      href={menu.path}
                    >
                      {menu.icon && <span className="mr-0.5 text-white dark:text-[#888888]">{menu.icon}</span>}
                      <span className={`${!open && 'hidden'} origin-left duration-200 flex items-center w-full`}>
                        <div className="flex relative items-center w-full">
                          <div>{menu.title}</div>
                        </div>
                      </span>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{menu.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </div>
      ))}
    </ul>
  );
};

export default SharedMenu;
