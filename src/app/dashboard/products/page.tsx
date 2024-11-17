// Path: src\app\dashboard\products\page.tsx
import ProductList from '@/components/ProductList';
import { Card, CardContent } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductsPage = () => {
  return (
    <div className="mt-6 px-6">
      <Tabs defaultValue="zuivel" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="zuivel">Zuivel</TabsTrigger>
          <TabsTrigger value="kaas">Kaas</TabsTrigger>
          <TabsTrigger value="vlees">Vlees</TabsTrigger>
        </TabsList>
        <TabsContent value="zuivel">
          <Card className="bg-transparent border-none ">
            <CardContent className="px-0 space-y-2">
              <ProductList category="zuivel" title="Zuivel Producten" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kaas">
          <Card className="bg-transparent border-none ">
            <CardContent className="px-0 space-y-2">
              <ProductList category="kaas" title="Kaas Producten" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vlees">
          <Card className="bg-transparent border-none ">
            <CardContent className="px-0 space-y-2">
              <ProductList category="vlees" title="Vlees Producten" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsPage;
