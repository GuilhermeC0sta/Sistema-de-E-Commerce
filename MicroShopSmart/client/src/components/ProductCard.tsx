import { Product } from "@shared/schema";
import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [, navigate] = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation when clicking the add to cart button
    e.stopPropagation();
    
    setIsAdding(true);
    await addToCart(product.id, 1);
    setIsAdding(false);
    setAdded(true);
    
    // Reset the "Added" checkmark after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };
  
  const navigateToProduct = () => {
    navigate(`/products/${product.id}`);
  };

  const formatPrice = (price: number | string) => {
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  return (
    <Card 
      className="group relative h-full flex flex-col hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={navigateToProduct}
    >
      <div className="w-full h-64 overflow-hidden rounded-t-lg bg-neutral-100 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="flex items-center gap-1 bg-white/80 backdrop-blur-sm text-neutral-800">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{product.rating}</span>
          </Badge>
        </div>
      </div>
      <CardContent className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-medium text-neutral-800">{product.name}</h3>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{product.description}</p>
        <div className="mt-2 text-xs text-neutral-500">Categoria: {product.category}</div>
        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="text-xl font-semibold text-neutral-800">{formatPrice(product.price)}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock <= 0}
                  className={`h-10 w-10 rounded-full ${
                    added ? 'bg-green-100 text-green-600' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                  }`}
                >
                  {isAdding ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                  ) : added ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {product.stock <= 0 ? 'Produto esgotado' : 'Adicionar ao carrinho'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
