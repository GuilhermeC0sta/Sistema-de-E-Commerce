import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { productService } from "./services/productService";
import { cartService } from "./services/cartService";
import { shippingService } from "./services/shippingService";
import { paymentService } from "./services/paymentService";
import { orderService } from "./services/orderService";
import { recommendationService } from "./services/recommendationService";
import { z } from "zod";
import { 
  insertProductSchema,
  insertUserSchema,
  insertCartItemSchema,
  insertOrderSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure authentication routes
  setupAuth(app);
  
  const httpServer = createServer(app);

  // ==== Product Service Routes ====
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const { category, search } = req.query;
      
      if (category && typeof category === 'string') {
        const products = await productService.getProductsByCategory(category);
        return res.json(products);
      }
      
      if (search && typeof search === 'string') {
        const products = await productService.searchProducts(search);
        return res.json(products);
      }
      
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await productService.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // ==== Cart Service Routes ====
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      // Use the user's ID if they're logged in, otherwise use null
      const userId = req.isAuthenticated() ? req.user.id : null;
      
      const cart = await cartService.getOrCreateCart(userId);
      const cartItems = await cartService.getCartItems(cart.id);
      
      // Log the cart information for debugging
      console.log(`Cart ${cart.id} has ${cartItems.length} items for user ${userId || 'guest'}`);
      
      res.json({ cart, items: cartItems });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart/items", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      // Get the current cart or create a new one
      const userId = req.isAuthenticated() ? req.user.id : null;
      const cart = await cartService.getOrCreateCart(userId);
      
      // Force the cart ID to be the current cart ID
      const itemData = { ...validatedData, cartId: cart.id };
      
      // Add the item to the cart
      const cartItem = await cartService.addItemToCart(itemData);
      
      console.log(`Added item to cart ${cart.id}: Product ${itemData.productId}, Quantity ${itemData.quantity}`);
      
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await cartService.updateCartItemQuantity(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const success = await cartService.removeCartItem(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      const cartId = parseInt(req.query.cartId as string);
      if (isNaN(cartId)) {
        return res.status(400).json({ message: "Invalid cart ID" });
      }
      
      const success = await cartService.clearCart(cartId);
      if (!success) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // ==== Shipping Service Routes ====
  app.get("/api/shipping/options", async (_req: Request, res: Response) => {
    try {
      const options = await shippingService.getAllShippingOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching shipping options:", error);
      res.status(500).json({ message: "Failed to fetch shipping options" });
    }
  });

  app.post("/api/shipping/calculate", async (req: Request, res: Response) => {
    try {
      const { cartId, zipcode } = req.body;
      
      if (!cartId || !zipcode) {
        return res.status(400).json({ message: "Cart ID and zipcode are required" });
      }
      
      const shippingCosts = await shippingService.calculateShipping(parseInt(cartId), zipcode);
      res.json(shippingCosts);
    } catch (error) {
      console.error("Error calculating shipping:", error);
      res.status(500).json({ message: "Failed to calculate shipping" });
    }
  });

  // ==== Payment Service Routes ====
  app.get("/api/payment/methods", async (_req: Request, res: Response) => {
    try {
      const methods = await paymentService.getAllPaymentMethods();
      res.json(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  app.post("/api/payment/process", async (req: Request, res: Response) => {
    try {
      const { orderId, paymentMethod, paymentDetails } = req.body;
      
      if (!orderId || !paymentMethod) {
        return res.status(400).json({ message: "Order ID and payment method are required" });
      }
      
      const result = await paymentService.processPayment(
        parseInt(orderId),
        paymentMethod,
        paymentDetails
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  // ==== Order Service Routes ====
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const { cartId } = req.body;
      
      if (!cartId) {
        return res.status(400).json({ message: "Cart ID is required" });
      }
      
      const order = await orderService.createOrderFromCart(parseInt(cartId), orderData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await orderService.getOrderWithItems(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get("/api/user/:userId/orders", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await orderService.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  // ==== Recommendation Service Routes ====
  app.get("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      const productId = req.query.productId ? parseInt(req.query.productId as string) : null;
      
      let recommendations;
      
      if (productId) {
        recommendations = await recommendationService.getRecommendationsForProduct(productId);
      } else if (userId) {
        recommendations = await recommendationService.getRecommendationsForUser(userId);
      } else {
        recommendations = await recommendationService.getPopularProducts();
      }
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // ==== User Routes ====
  // Authentication routes (/api/register, /api/login, /api/logout, /api/user) are now handled by setupAuth()

  return httpServer;
}
