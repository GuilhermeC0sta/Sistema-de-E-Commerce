import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Check, ChevronLeft, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import RecommendationList from "@/components/RecommendationList";

export default function ProductDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  
  const productId = Number(params.id);
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Produto não encontrado");
      }
      return response.json();
    },
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<Product[]>({
    queryKey: ["/api/recommendations"],
    enabled: !!product,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    await addToCart(product.id, quantity);
    setIsAdding(false);
    setAdded(true);
    
    // Reset the "Added" checkmark after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const formatPrice = (price: string | number) => {
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="pt-6">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-neutral-50 rounded-lg p-12 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Produto não encontrado</h2>
          <p className="text-neutral-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate("/products")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-neutral-500 mb-6">
        <button 
          onClick={() => navigate("/products")}
          className="flex items-center hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          Voltar para produtos
        </button>
        <span className="mx-2">/</span>
        <span className="font-medium text-neutral-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain object-center p-4"
            style={{ maxHeight: '500px' }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
              <Badge variant="secondary" className="flex items-center gap-1 bg-amber-50 text-amber-600 border-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
              </Badge>
            </div>
            <p className="mt-1 text-sm text-neutral-500">Categoria: {product.category}</p>
          </div>

          <p className="text-3xl font-bold text-neutral-900">{formatPrice(product.price)}</p>
          
          <div className="border-t border-b py-4">
            <p className="text-neutral-700">{product.description}</p>
          </div>

          <div className="flex items-center">
            <div className="mr-6">
              <p className="text-sm text-neutral-500 mb-1">Quantidade</p>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-2 text-neutral-900 w-10 text-center">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
                  disabled={product.stock <= quantity}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-500 mb-1">Disponibilidade</p>
              <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
              </p>
            </div>
          </div>

          <Button
            className="w-full py-6 text-lg"
            onClick={handleAddToCart}
            disabled={isAdding || product.stock <= 0 || added}
          >
            {isAdding ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : added ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Adicionado ao carrinho
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao carrinho
              </>
            )}
          </Button>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 text-sm">
            <div className="flex items-center text-neutral-600">
              <Truck className="h-4 w-4 mr-2 text-primary-600" />
              <span>Frete grátis em pedidos acima de R$ 150,00</span>
            </div>
            <div className="flex items-center text-neutral-600">
              <ShieldCheck className="h-4 w-4 mr-2 text-primary-600" />
              <span>Garantia de 12 meses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card className="mb-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b rounded-none p-0 h-auto">
            <TabsTrigger 
              value="description" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 py-4"
            >
              Descrição
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 py-4"
            >
              Especificações
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 py-4"
            >
              Avaliações
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-6">
            <div className="prose max-w-none">
              <h3>Descrição do Produto</h3>
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl ac ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl ac ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
              <ul>
                <li>Alta qualidade</li>
                <li>Design moderno</li>
                <li>Feito com materiais sustentáveis</li>
                <li>Confortável e durável</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="details" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Especificações Técnicas</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Marca</td>
                      <td className="py-2 text-neutral-900">TechStore</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Modelo</td>
                      <td className="py-2 text-neutral-900">{product.name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Categoria</td>
                      <td className="py-2 text-neutral-900">{product.category}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Garantia</td>
                      <td className="py-2 text-neutral-900">12 meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Dimensões e Peso</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Altura</td>
                      <td className="py-2 text-neutral-900">30 cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Largura</td>
                      <td className="py-2 text-neutral-900">15 cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Profundidade</td>
                      <td className="py-2 text-neutral-900">10 cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-neutral-500">Peso</td>
                      <td className="py-2 text-neutral-900">0.5 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 text-neutral-300" />
              </div>
              <span className="text-lg font-medium">{product.rating} de 5</span>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </div>
                  <span className="font-medium">Maria S.</span>
                  <span className="text-neutral-500 text-sm ml-2">12/04/2025</span>
                </div>
                <p className="text-neutral-700">Produto de excelente qualidade, entrega rápida e atendeu todas as expectativas. Recomendo!</p>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 text-neutral-300" />
                  </div>
                  <span className="font-medium">Carlos R.</span>
                  <span className="text-neutral-500 text-sm ml-2">28/03/2025</span>
                </div>
                <p className="text-neutral-700">Muito bom, mas poderia ter mais opções de cores. No geral, satisfeito com a compra.</p>
              </div>
              <div className="pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <Star className="h-4 w-4 text-neutral-300" />
                    <Star className="h-4 w-4 text-neutral-300" />
                  </div>
                  <span className="font-medium">Juliana M.</span>
                  <span className="text-neutral-500 text-sm ml-2">15/03/2025</span>
                </div>
                <p className="text-neutral-700">O produto é bom, mas demorou mais que o esperado para chegar. Qualidade condiz com o preço.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Recommendations */}
      <RecommendationList
        title="Produtos Relacionados"
        products={recommendations || []}
        isLoading={isLoadingRecommendations}
      />
    </div>
  );
}
