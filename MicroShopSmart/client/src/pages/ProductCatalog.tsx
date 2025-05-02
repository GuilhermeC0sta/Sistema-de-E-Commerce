import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import RecommendationList from "@/components/RecommendationList";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductCatalog() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState("relevance");

  // Parse query parameters from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const category = params.get("category");
    const search = params.get("search");
    
    if (category) {
      setSelectedCategory(category);
    }
    
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);

  // Fetch products based on category and search
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, searchQuery],
    queryFn: async () => {
      let url = "/api/products";
      const params = new URLSearchParams();
      
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      return response.json();
    },
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<Product[]>({
    queryKey: ["/api/recommendations"],
  });

  // Filter and sort logic
  const sortedProducts = () => {
    if (!products) return [];
    
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case "price_asc":
          return Number(a.price) - Number(b.price);
        case "price_desc":
          return Number(b.price) - Number(a.price);
        case "rating":
          return Number(b.rating) - Number(a.rating);
        default:
          return 0;
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will be triggered by the state change
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Filters Section */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
        <aside className="lg:col-span-3">
          <div className="sticky top-20">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">Busca</h3>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </form>
            </div>
            
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategoryChange} 
            />
          </div>
        </aside>

        {/* Products Section */}
        <div className="mt-6 lg:mt-0 lg:col-span-9">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-800">
              {selectedCategory === "all" ? "Todos os Produtos" : selectedCategory}
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-neutral-500 mr-2">Ordenar por:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mais relevantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Mais relevantes</SelectItem>
                  <SelectItem value="price_asc">Menor preço</SelectItem>
                  <SelectItem value="price_desc">Maior preço</SelectItem>
                  <SelectItem value="rating">Avaliações</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="group relative bg-white rounded-lg shadow-sm p-4">
                  <Skeleton className="w-full h-48 rounded-md mb-4" />
                  <Skeleton className="w-2/3 h-5 mb-2" />
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-1/3 h-4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-1/4 h-6" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-neutral-900">Nenhum produto encontrado</h3>
              <p className="mt-2 text-neutral-500">Tente ajustar sua pesquisa ou navegue por outras categorias.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }} 
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {sortedProducts().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationList
        title="Você também pode gostar"
        products={recommendations || []}
        isLoading={isLoadingRecommendations}
      />
    </div>
  );
}
