// Path: src\components\ProductList.tsx
'use client';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/components/FetchProducts';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading from './loading';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface ProductListProps {
  category: 'kaas' | 'vlees' | 'zuivel';
  title: string;
}

const productCache = new Map<string, Product[]>();

const ProductList: React.FC<ProductListProps> = ({ category, title }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useCartStore((state) => state.addToWishlist);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);

      if (productCache.has(category)) {
        setProducts(productCache.get(category)!);
        setLoading(false);
        return;
      }

      const data = await fetchProducts(category);
      setProducts(data);
      productCache.set(category, data);
      setLoading(false);
    };

    setProducts([]);
    getProducts();
  }, [category]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: `${category}-${product.id}`, // Prefix with category to make it unique
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      quantity: 1,
      description: '',
      short_description: '',
      stock_status: '',
      images: [],
      category,
      image_url: '',
      discountPrice: 0,
    });
    toggleCart(true);
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      id: `${category}-${product.id}`, // Prefix with category to make it unique
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      description: '',
      short_description: '',
      stock_status: '',
      images: [],
      category,
      image_url: '',
      discountPrice: 0,
      quantity: 0,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="">
      <h1 className="text-2xl text-erf1-500 mb-4 mt-4">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="w-full max-w-4xl hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-2">
              <div className="flex items-center space-x-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    className="w-18 h-18 object-cover rounded-md"
                    width={60}
                    height={60}
                  />
                </div>

                {/* Name and Quantity */}
                <div className="flex-grow">
                  <h3 className="text-lg text-erf1-500 mb-2">{product.name}</h3>
                  <p className="text-gray-700">€{product.price}</p>
                </div>

                {/* Icons */}
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddToWishlist(product)}
                    className="h-10 w-10 text-gray-500 hover:bg-[#374C69] hover:text-white"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddToCart(product)}
                    className="h-10 w-10 text-gray-500 hover:bg-[#374C69] hover:text-white"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
