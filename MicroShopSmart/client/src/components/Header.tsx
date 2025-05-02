import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User, LogOut, Package } from "lucide-react";

export default function Header() {
  const [location, navigate] = useLocation();
  const { openCart, getCartItemCount } = useCart();
  const { user, isAuthenticated, logoutMutation } = useAuth();
  const logout = () => logoutMutation.mutate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Fetch categories for menu
  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const cartCount = getCartItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary-600">ShopEasy</span>
              </a>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location === "/" ? "border-primary-500 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}>
                  Início
                </a>
              </Link>
              <Link href="/products">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.startsWith("/products") ? "border-primary-500 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}>
                  Produtos
                </a>
              </Link>
              {categories?.slice(0, 3).map((category) => (
                <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === `/products?category=${encodeURIComponent(category)}` ? "border-primary-500 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                  }`}>
                    {category}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div className="relative mx-3 md:w-64">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Pesquisar produtos..."
                      className="pr-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <Search className="h-4 w-4 text-neutral-400" />
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Cart button */}
              <Button
                onClick={openCart}
                variant="ghost"
                size="icon"
                className="ml-3 relative p-1 rounded-full text-neutral-600 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">Ver carrinho</span>
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500 text-white">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* User dropdown */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-3 relative rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile?tab=orders')}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="ml-3 flex">
                  <Link href="/auth">
                    <Button variant="ghost" className="text-sm font-medium text-neutral-700">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button variant="default" className="ml-2 text-sm font-medium">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 rounded-md text-neutral-600"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
                className="ml-2 relative p-2 rounded-md text-neutral-600"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500 text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-2 p-2 rounded-md text-neutral-600"
              >
                {isMobileMenuOpen ? (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search */}
      {isMobileSearchOpen && (
        <div className="md:hidden p-2 bg-neutral-50 border-t">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Search className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
              }`}>
                Início
              </a>
            </Link>
            <Link href="/products">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.startsWith("/products") ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
              }`}>
                Produtos
              </a>
            </Link>
            {categories?.map((category) => (
              <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === `/products?category=${encodeURIComponent(category)}` ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-50"
                }`}>
                  {category}
                </a>
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-neutral-200">
                <div className="flex items-center px-3">
                  <div className="flex-1">
                    <Link href="/auth">
                      <Button variant="outline" className="w-full mb-2">
                        Entrar
                      </Button>
                    </Link>
                    <Link href="/auth?tab=register">
                      <Button className="w-full">
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-neutral-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-800">{user?.name}</div>
                    <div className="text-sm font-medium text-neutral-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <a onClick={() => navigate('/profile')} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                    Perfil
                  </a>
                  <a onClick={() => navigate('/profile?tab=orders')} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer">
                    Meus Pedidos
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
