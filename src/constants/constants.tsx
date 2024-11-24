// src\constants\constants.tsx
import { BaggageClaim, BlocksIcon, Home, ShoppingBag, User, Milk, Beef, Shapes, ReceiptEuro } from 'lucide-react';

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
    path: '/dashboard/products',
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
    title: 'Bestellingen',
    notification: 0,
    icon: <BaggageClaim className="w-5 h-5" />,
    path: '/dashboard/orders',
  },
  {
    title: 'Facturen',
    notification: 0,
    icon: <ReceiptEuro className="w-5 h-5" />,
    path: '/dashboard/invoices',
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

export const cardsData = [
  {
    image: '/images/img1.jpg',
    alt: 'Abstract 3D shapes including beige arch, white sphere, and geometric forms',
    badge: 'Kaas',
    avatar: '/images/avatars.png?height=40&width=40',
    fallback: 'AU',
    category: '1 pond',
    title: 'Kampereilander Fenegriek',
    views: 9125,
    comments: 123,
    date: 'Mon, Dec 19',
  },
  {
    image: '/images/img2.jpg',
    alt: 'Another abstract design with geometric shapes',
    badge: 'Kaas',
    avatar: '/images/avatars2.png?height=40&width=40',
    fallback: 'JD',
    category: '1 pond',
    title: 'kruidenkaas daslook',
    views: 4821,
    comments: 768,
    date: 'Tue, Jan 3',
  },
  {
    image: '/images/img3.jpg',
    alt: 'Minimalistic design with a gradient background',
    badge: 'Kaas',
    avatar: '/images/avatars3.png?height=40&width=40',
    fallback: 'KP',
    category: '1 pond',
    title: 'Kampereilander Italiaans',
    views: 7213,
    comments: 453,
    date: 'Fri, Feb 10',
  },
  {
    image: '/images/img1.jpg',
    alt: 'Abstract 3D shapes including beige arch, white sphere, and geometric forms',
    badge: 'Kaas',
    avatar: '/images/avatars.png?height=40&width=40',
    fallback: 'AU',
    category: '1 pond',
    title: 'Kampereilander Fenegriek',
    views: 9125,
    comments: 123,
    date: 'Mon, Dec 19',
  },
  {
    image: '/images/img2.jpg',
    alt: 'Another abstract design with geometric shapes',
    badge: 'Kaas',
    avatar: '/images/avatars2.png?height=40&width=40',
    fallback: 'JD',
    category: '1 pond',
    title: 'kruidenkaas daslook',
    views: 4821,
    comments: 768,
    date: 'Tue, Jan 3',
  },
  {
    image: '/images/img3.jpg',
    alt: 'Minimalistic design with a gradient background',
    badge: 'Kaas',
    avatar: '/images/avatars3.png?height=40&width=40',
    fallback: 'KP',
    category: '1 pond',
    title: 'Kampereilander Italiaans',
    views: 7213,
    comments: 453,
    date: 'Fri, Feb 10',
  },
];
