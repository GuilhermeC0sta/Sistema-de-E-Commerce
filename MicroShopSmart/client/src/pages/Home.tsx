import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import RecommendationList from "@/components/RecommendationList";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<Product[]>({
    queryKey: ["/api/recommendations"],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="bg-primary-600 rounded-lg shadow-lg mb-8 relative overflow-hidden">
        <div className="px-8 py-12 md:w-1/2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            As melhores ofertas
            <span className="block text-primary-200">em um só lugar</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-primary-100">
            Encontre os produtos que você precisa com os melhores preços e entrega rápida.
          </p>
          <div className="mt-8">
            <Link href="/products">
              <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50">
                Ver Ofertas
              </a>
            </Link>
          </div>
        </div>
        <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1/2 bg-primary-500 rounded-r-lg">
          <div className="h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-10">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section id="featured-products">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Produtos em Destaque</h2>
          <Link href="/products">
            <a className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Ver todos →
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[...Array(4)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/products?category=Eletrônicos">
            <a className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-lg">Eletrônicos</h3>
            </a>
          </Link>
          <Link href="/products?category=Vestuário">
            <a className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="font-semibold text-lg">Vestuário</h3>
            </a>
          </Link>
          <Link href="/products?category=Livros">
            <a className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="font-semibold text-lg">Livros</h3>
            </a>
          </Link>
          <Link href="/products?category=Casa & Jardim">
            <a className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="font-semibold text-lg">Casa & Jardim</h3>
            </a>
          </Link>
        </div>
      </section>

      {/* Recommendations */}
      <RecommendationList
        title="Recomendado para você"
        products={recommendations || []}
        isLoading={isLoadingRecommendations}
      />

      {/* Promotional Banner */}
      <section className="mt-16 bg-neutral-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-3">Receba nossas ofertas</h2>
        <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
          Inscreva-se para receber promoções exclusivas e novidades em primeira mão.
        </p>
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="flex-1 rounded-l-md border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
          />
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-r-md">
            Assinar
          </button>
        </div>
      </section>
    </div>
  );
}
