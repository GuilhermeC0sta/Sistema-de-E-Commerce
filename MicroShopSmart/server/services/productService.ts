import { storage } from "../storage";
import { Product, InsertProduct } from "@shared/schema";

class ProductService {
  /**
   * Get a product by ID
   */
  async getProductById(id: number): Promise<Product | undefined> {
    return storage.getProduct(id);
  }

  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    return storage.getAllProducts();
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    return storage.getProductsByCategory(category);
  }

  /**
   * Search products by query string
   */
  async searchProducts(query: string): Promise<Product[]> {
    return storage.searchProducts(query);
  }

  /**
   * Create a new product
   */
  async createProduct(product: InsertProduct): Promise<Product> {
    return storage.createProduct(product);
  }

  /**
   * Update a product
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined> {
    return storage.updateProduct(id, product);
  }

  /**
   * Get all unique categories
   */
  async getAllCategories(): Promise<string[]> {
    const products = await storage.getAllProducts();
    const categories = new Set(products.map(product => product.category));
    return Array.from(categories);
  }
}

export const productService = new ProductService();
