import { storage } from "../storage";
import { Cart, InsertCart, CartItem, InsertCartItem, CartItemWithProduct } from "@shared/schema";

class CartService {
  /**
   * Get a cart by ID
   */
  async getCart(id: number): Promise<Cart | undefined> {
    return storage.getCart(id);
  }

  /**
   * Get a cart by user ID or create a new one if it doesn't exist
   */
  async getOrCreateCart(userId: number | null): Promise<Cart> {
    let cart: Cart | undefined;
    
    if (userId) {
      cart = await storage.getCartByUserId(userId);
    }
    
    if (!cart) {
      // Create a new cart
      const newCart: InsertCart = {
        userId: userId || undefined,
      };
      cart = await storage.createCart(newCart);
    }
    
    return cart;
  }

  /**
   * Get all items in a cart
   */
  async getCartItems(cartId: number): Promise<CartItemWithProduct[]> {
    return storage.getCartItems(cartId);
  }

  /**
   * Add an item to a cart
   */
  async addItemToCart(item: InsertCartItem): Promise<CartItem> {
    // Get the product to set the correct price
    const product = await storage.getProduct(item.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    
    // Use the current product price
    const itemWithPrice: InsertCartItem = {
      ...item,
      price: product.price,
    };
    
    return storage.addCartItem(itemWithPrice);
  }

  /**
   * Update the quantity of a cart item
   */
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    return storage.updateCartItemQuantity(id, quantity);
  }

  /**
   * Remove an item from a cart
   */
  async removeCartItem(id: number): Promise<boolean> {
    return storage.removeCartItem(id);
  }

  /**
   * Clear a cart (remove all items)
   */
  async clearCart(cartId: number): Promise<boolean> {
    return storage.deleteCart(cartId);
  }

  /**
   * Calculate the total price of a cart
   */
  async calculateCartTotal(cartId: number): Promise<number> {
    const items = await storage.getCartItems(cartId);
    return items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  }
}

export const cartService = new CartService();
