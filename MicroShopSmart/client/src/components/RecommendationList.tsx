import { Product } from "@shared/schema";
import { RecommendationWithReason } from "@/types/recommendation";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface RecommendationListProps {
  title: string;
  products: (Product | RecommendationWithReason)[];
  isLoading: boolean;
}

export default function RecommendationList({ title, products, isLoading }: RecommendationListProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number | string) => {
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  // Verifica se o produto tem reasonCode (ou seja, é uma RecommendationWithReason)
  const hasReason = (product: Product | RecommendationWithReason): product is RecommendationWithReason => {
    return 'reasonCode' in product && !!product.reasonCode;
  };

  // Retorna a cor do badge baseado no tipo de recomendação
  const getReasonBadgeColor = (reasonCode: string) => {
    switch (reasonCode) {
      case 'category':
        return 'bg-primary-100 text-primary-800 hover:bg-primary-200';
      case 'similar':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'popular':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'explore':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200';
    }
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
            <Card key={product.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
              <div className="w-full rounded-t-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-48 object-cover object-center"
                />
              </div>
              <CardContent className="p-3 flex flex-col">
                {/* Reason Badge */}
                {hasReason(product) && (
                  <div className="mb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-normal py-1 ${getReasonBadgeColor(product.reasonCode!)}`}
                          >
                            <InfoIcon className="h-3 w-3 mr-1" />
                            {product.reasonCode === 'category' ? 'Baseado em suas compras' : 
                             product.reasonCode === 'similar' ? 'Produto similar' :
                             product.reasonCode === 'popular' ? 'Produto popular' :
                             product.reasonCode === 'explore' ? 'Descoberta' : 'Recomendado'}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{product.reasonText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
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
