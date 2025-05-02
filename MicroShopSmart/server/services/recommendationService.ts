import { storage } from "../storage";
import { Product } from "@shared/schema";

class RecommendationService {
  /**
   * Get product recommendations for a user based on their purchase history
   */
  async getRecommendationsForUser(userId: number): Promise<Product[]> {
    // In a real application, we would use a sophisticated recommendation algorithm
    // that considers user purchase history, browsing behavior, and similar users' preferences
    
    // For demonstration purposes, we'll simulate a basic recommendation system
    try {
      // Get the user's orders
      const orders = await storage.getUserOrders(userId);
      
      if (orders.length === 0) {
        // If the user has no orders, return popular products
        return this.getPopularProducts();
      }
      
      // Get order items for the user's orders
      const orderItems: { productId: number | null; productName: string; }[] = [];
      for (const order of orders) {
        const items = await storage.getOrderItems(order.id);
        orderItems.push(...items);
      }
      
      // Get the categories of products the user has purchased
      const purchasedProductIds = orderItems
        .filter(item => item.productId !== null)
        .map(item => item.productId!);
      
      const purchasedProducts = await Promise.all(
        purchasedProductIds.map(id => storage.getProduct(id))
      );
      
      const userCategories = new Set(
        purchasedProducts
          .filter((product): product is Product => product !== undefined)
          .map(product => product.category)
      );
      
      // Get products from those categories that the user hasn't purchased
      const allProducts = await storage.getAllProducts();
      const recommendations = allProducts.filter(product => 
        userCategories.has(product.category) && 
        !purchasedProductIds.includes(product.id)
      );
      
      // Sort by rating and limit to 8 products
      return recommendations
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 8);
    } catch (error) {
      console.error("Error generating user recommendations:", error);
      return this.getPopularProducts();
    }
  }

  /**
   * Get product recommendations for a specific product
   */
  async getRecommendationsForProduct(productId: number): Promise<Product[]> {
    // In a real application, we would use a collaborative filtering algorithm
    // that considers products frequently purchased together
    
    // For demonstration purposes, we'll implement a simple similar products recommendation
    try {
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return this.getPopularProducts();
      }
      
      // Get products in the same category
      const sameCategory = await storage.getProductsByCategory(product.category);
      
      // Filter out the current product
      const similarProducts = sameCategory.filter(p => p.id !== productId);
      
      // Sort by rating
      const recommendations = similarProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
      
      // Limit to 4 products
      return recommendations.slice(0, 4);
    } catch (error) {
      console.error("Error generating product recommendations:", error);
      return this.getPopularProducts();
    }
  }

  /**
   * Get popular products for new users or fallback
   */
  async getPopularProducts(): Promise<Product[]> {
    try {
      const allProducts = await storage.getAllProducts();
      
      // Sort by rating (highest first)
      const sortedProducts = allProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
      
      // Return top 8 products
      return sortedProducts.slice(0, 8);
    } catch (error) {
      console.error("Error getting popular products:", error);
      return [];
    }
  }
}

export const recommendationService = new RecommendationService();
