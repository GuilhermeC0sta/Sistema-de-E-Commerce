import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RecommendationListProps {
  title: string;
  products: Product[];
  isLoading: boolean;
}

export default function RecommendationList({ title, products, isLoading }: RecommendationListProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number | string) => {
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  if (products.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {isLoading ? (
          // Skeleton loading state
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="border border-neutral-200">
              <div className="w-full rounded-t-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
              </div>
              <CardContent className="p-3 flex flex-col">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex items-center justify-between mt-auto pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual recommendations
          products.slice(0, 4).map((product) => (
            <Card key={product.id} className="border border-neutral-200">
              <div className="w-full rounded-t-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-48 object-cover object-center"
                />
              </div>
              <CardContent className="p-3 flex flex-col">
                <h3 className="text-sm font-medium text-neutral-800 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <p className="text-base font-semibold text-neutral-800">{formatPrice(product.price)}</p>
                  <Button
                    onClick={() => addToCart(product.id, 1)}
                    size="sm"
                    className="text-xs"
                  >
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
