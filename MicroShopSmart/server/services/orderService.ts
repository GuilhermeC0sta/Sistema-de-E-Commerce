import { storage } from "../storage";
import { cartService } from "./cartService";
import { Order, InsertOrder, OrderItem, InsertOrderItem, OrderWithItems } from "@shared/schema";

class OrderService {
  /**
   * Get an order by ID
   */
  async getOrder(id: number): Promise<Order | undefined> {
    return storage.getOrder(id);
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: number): Promise<Order[]> {
    return storage.getUserOrders(userId);
  }

  /**
   * Get an order with its items
   */
  async getOrderWithItems(orderId: number): Promise<OrderWithItems | undefined> {
    return storage.getOrderWithItems(orderId);
  }

  /**
   * Create a new order
   */
  async createOrder(order: InsertOrder): Promise<Order> {
    return storage.createOrder(order);
  }

  /**
   * Add an item to an order
   */
  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    return storage.addOrderItem(item);
  }

  /**
   * Update the status of an order
   */
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    return storage.updateOrderStatus(id, status);
  }

  /**
   * Create an order from a cart
   */
  async createOrderFromCart(cartId: number, orderData: InsertOrder): Promise<Order> {
    // Get cart items
    const cartItems = await storage.getCartItems(cartId);
    
    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    
    // Create the order
    const order = await storage.createOrder(orderData);
    
    // Add items to the order
    for (const cartItem of cartItems) {
      await storage.addOrderItem({
        orderId: order.id,
        productId: cartItem.productId,
        productName: cartItem.product.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
      });
    }
    
    // Clear the cart after creating the order
    await cartService.clearCart(cartId);
    
    return order;
  }
}

export const orderService = new OrderService();
