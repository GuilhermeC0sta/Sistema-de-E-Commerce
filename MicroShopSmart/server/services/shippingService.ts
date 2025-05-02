import { storage } from "../storage";
import { cartService } from "./cartService";
import { ShippingOption } from "@shared/schema";

// Interface for shipping calculation result
interface ShippingCalculation {
  options: ShippingOption[];
  bestOption: ShippingOption | null;
}

class ShippingService {
  /**
   * Get all shipping options
   */
  async getAllShippingOptions(): Promise<ShippingOption[]> {
    return storage.getAllShippingOptions();
  }

  /**
   * Get a shipping option by ID
   */
  async getShippingOption(id: number): Promise<ShippingOption | undefined> {
    return storage.getShippingOption(id);
  }

  /**
   * Calculate shipping costs based on cart contents and destination zipcode
   */
  async calculateShipping(cartId: number, zipcode: string): Promise<ShippingCalculation> {
    // Get shipping options
    const options = await storage.getAllShippingOptions();
    
    // Get cart items to check weight, volume, etc. if needed
    const cartItems = await storage.getCartItems(cartId);
    
    // Calculate total value for free shipping threshold
    const cartTotal = await cartService.calculateCartTotal(cartId);
    
    // In a real application, we would calculate shipping costs based on:
    // - Distance (calculated from zipcode)
    // - Weight and dimensions of products
    // - Special shipping requirements
    // - Discounts for high-value orders
    
    // For demonstration purposes, we'll simulate a simple calculation
    // where orders above R$ 300 get free express shipping
    let bestOption: ShippingOption | null = null;
    
    if (cartTotal > 300) {
      // Find express option and set it to free
      const expressOption = options.find(option => option.name.includes("Express"));
      if (expressOption) {
        bestOption = {
          ...expressOption,
          price: "0.00", // Free shipping
          name: expressOption.name + " (Grátis)",
        };
      }
    } else {
      // Just suggest the standard option
      bestOption = options.find(option => option.name.includes("Padrão")) || null;
    }
    
    return {
      options,
      bestOption,
    };
  }
}

export const shippingService = new ShippingService();
