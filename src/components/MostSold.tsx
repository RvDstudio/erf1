'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  product_name: string;
  product_price: number;
  total_sold: number;
  category: string;
  image_url: string;
}

export default function MostSold() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostSoldProducts = async () => {
      try {
        const response = await fetch('/api/most-sold-products');
        if (!response.ok) {
          throw new Error('Failed to fetch most sold products');
        }
        const { products } = await response.json();
        setProducts(products);
      } catch (error) {
        console.error('Error fetching most sold products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostSoldProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return <div>No most sold products found.</div>;
  }

  return (
    <div className="w-full">
      <div className="grid items-center justify-items-center gap-16">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Card className="overflow-hidden rounded-3xl group cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative h-64 bg-[#E97F5A] overflow-hidden">
                      <Badge className="absolute bottom-6 right-4 z-20 bg-erf1-500 text-white text-xs rounded-full px-2.5 py-1">
                        <span className="text-white">€{product.product_price.toFixed(2)}</span>
                      </Badge>
                      <div className="relative h-full w-full">
                        <Image
                          src={product.image_url}
                          alt={product.product_name}
                          className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                          fill
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white border-none">
                    <h5 className="text-lg mt-6 mb-0 group-hover:text-primary line-clamp-2">{product.product_name}</h5>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-gray-500">Aantal verkocht: {product.total_sold}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
