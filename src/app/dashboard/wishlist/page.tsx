// Path: src\app\dashboard\wishlist\page.tsx
'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Trash } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';

const WishlistPage = () => {
  const wishlist = useCartStore((state) => state.wishlist);
  const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);

  if (wishlist.length === 0) {
    return (
      <div className="h-screen items-center justify-center flex flex-col pt-0 p-4 text-center text-gray-500">
        <Image className="" width={650} height={650} src="/images/wishlist.png" alt="" />
        <h2 className="text-3xl text-erf1-700">Je verlanglijstje is nog leeg.</h2>
      </div>
    );
  }

  return (
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#ECF0F6] dark:bg-[#171717]">
      <div className="bg-white dark:bg-[#252525] p-8 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e]">
        <h1 className="text-2xl text-erf1-500 mb-0">Mijn verlanglijstje</h1>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full  rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <Image
                            className="w-full h-full rounded"
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>€{product.price}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => removeFromWishlist(product.id)} // Pass `product.id` directly
                        className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
