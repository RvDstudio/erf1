// src\app\dashboard\page.tsx
import MostSold from '@/components/MostSold';
import Image from 'next/image';

export default function page() {
  return (
    <div className="mt-6 px-6">
      <div className="w-full">
        <Image className="" width={1920} height={650} src="/images/dashboardBanner.png" alt="" />
      </div>
      <div className="w-full">
        <MostSold />
      </div>
    </div>
  );
}
