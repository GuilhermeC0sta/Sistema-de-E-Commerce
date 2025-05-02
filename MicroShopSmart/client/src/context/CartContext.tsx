import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CartItemWithProduct } from "@shared/schema";

interface CartContextType {
  cartItems: CartItemWithProduct[];
  cartId: number | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart on component mount
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      const data = await response.json();
      setCartItems(data.items);
      setCartId(data.cart.id);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load your shopping cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      
      // Ensure we always have the latest cartId before adding items
      await fetchCart();
      
      if (!cartId) {
        throw new Error("Failed to get or create cart");
      }
      
      const response = await apiRequest("POST", "/api/cart/items", {
        cartId,
        productId,
        quantity,
        price: "0", // The server will set the correct price from the product - but needs to be string type
      });
      
      // Fetch the updated cart with the new item
      await fetchCart();
      openCart();
      
      toast({
        title: "Item adicionado",
        description: "O item foi adicionado ao seu carrinho",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao carrinho. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setLoading(true);
      
      await apiRequest("PUT", `/api/cart/items/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/cart/items/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      
      await fetchCart();
      
      toast({
        title: "Item removido",
        description: "O item foi removido do seu carrinho",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      if (!cartId) return;
      
      const response = await fetch(`/api/cart?cartId=${cartId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
      
      setCartItems([]);
      
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do seu carrinho",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartId,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
