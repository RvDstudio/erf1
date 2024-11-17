// Path: src/app/dashboard/products/[category]/[id]/page.tsx

'use client';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import Loading from '@/components/loading';
import { useEffect, useState } from 'react';

const supabase = createClient();

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
};

interface ProductPageProps {
  params: {
    category: 'kaas' | 'vlees' | 'zuivel';
    id: string;
  };
}

const ProductPage = ({ params }: ProductPageProps) => {
  const { category, id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const tableName = `${category}_products`; // Dynamically choose the table

      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [category, id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: `${category}-${product.id}`, // Unique ID with category prefix
        name: product.name,
        price: product.price,
        imageUrl: product.image_url,
        quantity: 1,
        description: product.description,
        short_description: '',
        stock_status: '',
        images: [],
        category,
        image_url: product.image_url,
        discountPrice: 0,
      });
      toggleCart(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Product not found</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start space-x-6">
        <div className="w-full md:w-1/2">
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 mt-4 md:mt-0">
          <h1 className="text-3xl font-semibold text-erf1-500 mb-2">{product.name}</h1>
          <p className="text-xl text-gray-800 mb-4">€{product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <Button onClick={handleAddToCart} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
