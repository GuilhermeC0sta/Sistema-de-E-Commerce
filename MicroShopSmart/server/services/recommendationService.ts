import { storage } from "../storage";
import { Product } from "@shared/schema";

// Type para armazenar o produto e o motivo da recomendação
export interface RecommendationWithReason extends Product {
  reasonCode?: string;
  reasonText?: string;
}

class RecommendationService {
  /**
   * Get product recommendations for a user based on their purchase history
   */
  async getRecommendationsForUser(userId: number): Promise<RecommendationWithReason[]> {
    // In a real application, we would use a sophisticated recommendation algorithm
    // that considers user purchase history, browsing behavior, and similar users' preferences
    
    try {
      // Get the user's orders
      const orders = await storage.getUserOrders(userId);
      
      if (orders.length === 0) {
        // If the user has no orders, return popular products
        const popularProducts = await this.getPopularProducts();
        return popularProducts.map(product => ({
          ...product,
          reasonCode: 'popular',
          reasonText: 'Produtos populares que você pode gostar'
        }));
      }
      
      // Obtém todos os itens dos pedidos do usuário
      const orderItems: { productId: number | null; productName: string; quantity: number; }[] = [];
      for (const order of orders) {
        const items = await storage.getOrderItems(order.id);
        orderItems.push(...items);
      }
      
      // Obtém os IDs dos produtos que o usuário já comprou
      const purchasedProductIds = orderItems
        .filter(item => item.productId !== null)
        .map(item => item.productId!);
      
      // Obtém os detalhes completos dos produtos comprados
      const purchasedProducts = await Promise.all(
        purchasedProductIds.map(id => storage.getProduct(id))
      ).then(products => products.filter((product): product is Product => product !== undefined));
      
      // Analisa as categorias que o usuário tem interesse
      const userCategoryFrequency: Record<string, number> = {};
      purchasedProducts.forEach(product => {
        userCategoryFrequency[product.category] = (userCategoryFrequency[product.category] || 0) + 1;
      });
      
      // Obtém as categorias ordenadas por frequência de compra (as mais compradas primeiro)
      const preferredCategories = Object.entries(userCategoryFrequency)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      // Agora busca todos os produtos disponíveis
      const allProducts = await storage.getAllProducts();
      
      // Filtra produtos que o usuário ainda não comprou
      const notPurchasedProducts = allProducts.filter(product => 
        !purchasedProductIds.includes(product.id)
      );
      
      // Cria recomendações com base nas categorias preferidas
      const categoryBasedRecommendations: RecommendationWithReason[] = [];
      for (const category of preferredCategories) {
        const productsInCategory = notPurchasedProducts
          .filter(product => product.category === category)
          .sort((a, b) => Number(b.rating) - Number(a.rating))
          .slice(0, 3)
          .map(product => ({
            ...product,
            reasonCode: 'category',
            reasonText: `Porque você comprou produtos da categoria ${category}`
          }));
        
        categoryBasedRecommendations.push(...productsInCategory);
      }
      
      // Se não tivermos recomendações suficientes com base nas categorias,
      // adicione recomendações de produtos bem avaliados em categorias que o usuário ainda não explorou
      if (categoryBasedRecommendations.length < 8) {
        const unexploredCategories = allProducts
          .filter(product => !preferredCategories.includes(product.category))
          .map(product => product.category);
        
        const uniqueUnexploredCategories = Array.from(new Set(unexploredCategories));
        
        const explorativeRecommendations: RecommendationWithReason[] = [];
        for (const category of uniqueUnexploredCategories) {
          if (categoryBasedRecommendations.length + explorativeRecommendations.length >= 8) break;
          
          const productsInCategory = notPurchasedProducts
            .filter(product => product.category === category)
            .sort((a, b) => Number(b.rating) - Number(a.rating))
            .slice(0, 1)
            .map(product => ({
              ...product,
              reasonCode: 'explore',
              reasonText: `Descubra produtos de ${category}`
            }));
          
          explorativeRecommendations.push(...productsInCategory);
        }
        
        // Combine as recomendações baseadas em categorias e as explorativas
        const combinedRecommendations = [...categoryBasedRecommendations, ...explorativeRecommendations];
        
        // Limita a 8 produtos no total
        return combinedRecommendations.slice(0, 8);
      }
      
      return categoryBasedRecommendations.slice(0, 8);
    } catch (error) {
      console.error("Error generating user recommendations:", error);
      const popularProducts = await this.getPopularProducts();
      return popularProducts.map(product => ({
        ...product,
        reasonCode: 'popular',
        reasonText: 'Produtos populares que você pode gostar'
      }));
    }
  }

  /**
   * Get product recommendations for a specific product
   */
  async getRecommendationsForProduct(productId: number): Promise<RecommendationWithReason[]> {
    // In a real application, we would use a collaborative filtering algorithm
    // that considers products frequently purchased together
    
    // For demonstration purposes, we'll implement a simple similar products recommendation
    try {
      const product = await storage.getProduct(productId);
      
      if (!product) {
        const popularProducts = await this.getPopularProducts();
        return popularProducts.map(p => ({
          ...p, 
          reasonCode: 'popular',
          reasonText: 'Produtos populares que você pode gostar'
        }));
      }
      
      // Get products in the same category
      const sameCategory = await storage.getProductsByCategory(product.category);
      
      // Filter out the current product
      const similarProducts = sameCategory.filter(p => p.id !== productId);
      
      // Sort by rating
      const recommendations = similarProducts
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 4)
        .map(p => ({
          ...p,
          reasonCode: 'similar',
          reasonText: `Produto similar a ${product.name}`
        }));
      
      return recommendations;
    } catch (error) {
      console.error("Error generating product recommendations:", error);
      const popularProducts = await this.getPopularProducts();
      return popularProducts.map(p => ({
        ...p, 
        reasonCode: 'popular',
        reasonText: 'Produtos populares que você pode gostar'
      }));
    }
  }

  /**
   * Get popular products for new users or fallback
   */
  async getPopularProducts(): Promise<RecommendationWithReason[]> {
    try {
      const allProducts = await storage.getAllProducts();
      
      // Sort by rating (highest first)
      const sortedProducts = allProducts
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 8)
        .map(p => ({
          ...p,
          reasonCode: 'popular',
          reasonText: 'Produtos bem avaliados'
        }));
      
      return sortedProducts;
    } catch (error) {
      console.error("Error getting popular products:", error);
      return [];
    }
  }
}

export const recommendationService = new RecommendationService();
