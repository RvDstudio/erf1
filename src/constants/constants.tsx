// Path: src\constants\constants.tsx
import { BaggageClaim, BlocksIcon, Caravan, Home, ShoppingBag, User, Milk, Beef, Shapes } from 'lucide-react';

interface MenuItem {
  title: string;
  notification?: number;
  icon: JSX.Element;
  gap?: boolean;
  path: string;
  isAdmin?: boolean;
  isUitgekookt?: boolean;
  children?: MenuItem[]; // For dropdown menus
}

export const Menus: MenuItem[] = [
  {
    title: 'Dashboard',
    notification: 0,
    icon: <Home className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    title: 'Profiel',
    notification: 0,
    icon: <User className="w-5 h-5" />,
    path: '/dashboard/account',
  },
  {
    title: 'Producten',
    notification: 0,
    icon: <ShoppingBag className="w-5 h-5" />,
    path: '#',
    children: [
      {
        title: 'Zuivel',
        icon: <Milk className="w-5 h-5" />,
        path: '/dashboard/products/zuivel',
      },
      {
        title: 'Kaas',
        icon: <Shapes className="w-5 h-5" />,
        path: '/dashboard/products/kaas',
      },
      {
        title: 'Vlees',
        icon: <Beef className="w-5 h-5" />,
        path: '/dashboard/products/vlees',
      },
    ],
  },
  {
    title: 'Orders',
    notification: 0,
    icon: <BaggageClaim className="w-5 h-5" />,
    path: '/dashboard/order_history',
  },
  {
    title: 'Camperplekken',
    icon: <Caravan className="w-5 h-5" />,
    notification: 0,
    path: '/dashboard/camper',
  },
  {
    title: 'Agro Diëtetiek',
    notification: 0,
    icon: <BlocksIcon className="w-5 h-5" />,
    path: '/debts',
  },
  {
    title: 'Admin',
    notification: 0,
    gap: true,
    isAdmin: true,
    icon: <BlocksIcon className="w-5 h-5" />,
    path: '/dashboard/admin',
  },
  {
    title: 'Producten toevoegen',
    notification: 0,
    icon: <ShoppingBag className="w-5 h-5" />,
    path: '/dashboard/product-upload',
    isAdmin: false,
  },
];
