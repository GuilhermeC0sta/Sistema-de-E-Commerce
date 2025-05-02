import {
  Product,
  InsertProduct,
  User,
  InsertUser,
  Cart,
  InsertCart,
  CartItem,
  InsertCartItem,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  ShippingOption,
  InsertShippingOption,
  PaymentMethod,
  InsertPaymentMethod,
  CartItemWithProduct,
  OrderWithItems
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;

  // Cart methods
  getCart(id: number): Promise<Cart | undefined>;
  getCartByUserId(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  deleteCart(id: number): Promise<boolean>;

  // Cart Item methods
  getCartItems(cartId: number): Promise<CartItemWithProduct[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;

  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderWithItems(orderId: number): Promise<OrderWithItems | undefined>;

  // Shipping Option methods
  getAllShippingOptions(): Promise<ShippingOption[]>;
  getShippingOption(id: number): Promise<ShippingOption | undefined>;
  createShippingOption(option: InsertShippingOption): Promise<ShippingOption>;

  // Payment Method methods
  getAllPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethod(id: number): Promise<PaymentMethod | undefined>;
  getPaymentMethodByCode(code: string): Promise<PaymentMethod | undefined>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  
  // Session store
  sessionStore: any;
}

// In-memory storage implementation
class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private shippingOptions: Map<number, ShippingOption>;
  private paymentMethods: Map<number, PaymentMethod>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private cartIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private shippingOptionIdCounter: number;
  private paymentMethodIdCounter: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.shippingOptions = new Map();
    this.paymentMethods = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.cartIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.shippingOptionIdCounter = 1;
    this.paymentMethodIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Smartphone Premium",
        description: "O smartphone mais avançado com câmera de alta resolução e processador potente.",
        price: "2499.99",
        imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Eletrônicos",
        stock: 15,
        rating: "4.8"
      },
      {
        name: "Notebook Ultrafino",
        description: "Notebook leve e fino com desempenho excepcional para trabalho e entretenimento.",
        price: "4299.99",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Eletrônicos",
        stock: 8,
        rating: "4.5"
      },
      {
        name: "Fones de Ouvido Bluetooth",
        description: "Fones sem fio com cancelamento de ruído para uma experiência imersiva.",
        price: "299.99",
        imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Eletrônicos",
        stock: 25,
        rating: "4.2"
      },
      {
        name: "Camiseta Básica",
        description: "Camiseta 100% algodão de alta qualidade em diversas cores.",
        price: "89.99",
        imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Vestuário",
        stock: 50,
        rating: "4.0"
      },
      {
        name: "Tênis Esportivo",
        description: "Tênis confortável para corrida e caminhada com tecnologia de amortecimento.",
        price: "329.99",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Esportes",
        stock: 12,
        rating: "4.7"
      },
      {
        name: "O Poder do Hábito",
        description: "Best-seller sobre como transformar hábitos e mudar comportamentos.",
        price: "49.99",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Livros",
        stock: 30,
        rating: "4.9"
      },
      {
        name: "Kit Panelas Antiaderentes",
        description: "Conjunto de panelas de alta qualidade com tecnologia antiaderente.",
        price: "399.99",
        imageUrl: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Casa & Jardim",
        stock: 18,
        rating: "4.3"
      },
      {
        name: "Relógio Inteligente",
        description: "Smartwatch com monitoramento de saúde, GPS e resistência à água.",
        price: "999.99",
        imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: "Eletrônicos",
        stock: 10,
        rating: "4.6"
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));

    // Add shipping options
    const shippingOptions: InsertShippingOption[] = [
      {
        name: "Entrega Padrão",
        description: "Entrega em 3-5 dias úteis",
        price: "19.90",
        estimatedDays: "3-5 dias"
      },
      {
        name: "Entrega Expressa",
        description: "Entrega em 1-2 dias úteis",
        price: "39.90",
        estimatedDays: "1-2 dias"
      },
      {
        name: "Retirada na Loja",
        description: "Retire seu pedido em uma de nossas lojas",
        price: "0.00",
        estimatedDays: "1 dia"
      }
    ];

    shippingOptions.forEach(option => this.createShippingOption(option));

    // Add payment methods
    const paymentMethods: InsertPaymentMethod[] = [
      {
        name: "Cartão de Crédito",
        code: "credit",
        isActive: true
      },
      {
        name: "Boleto Bancário",
        code: "boleto",
        isActive: true
      },
      {
        name: "PIX",
        code: "pix",
        isActive: true
      }
    ];

    paymentMethods.forEach(method => this.createPaymentMethod(method));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }
  
  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      cart => cart.userId === userId
    );
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const id = this.cartIdCounter++;
    const now = new Date();
    const newCart: Cart = { ...cart, id, createdAt: now, updatedAt: now };
    this.carts.set(id, newCart);
    return newCart;
  }
  
  async deleteCart(id: number): Promise<boolean> {
    // Also delete cart items
    const cartItemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.cartId === id);
    
    cartItemsToDelete.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return this.carts.delete(id);
  }

  // Cart Item methods
  async getCartItems(cartId: number): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.cartId === cartId);
    
    return items.map(item => {
      const product = this.products.get(item.productId)!;
      return { ...item, product };
    });
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if this product already exists in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      i => i.cartId === item.cartId && i.productId === item.productId
    );
    
    if (existingItem) {
      // Update quantity instead
      const updatedQuantity = existingItem.quantity + item.quantity;
      return (await this.updateCartItemQuantity(existingItem.id, updatedQuantity))!;
    }
    
    const id = this.cartItemIdCounter++;
    const newItem: CartItem = { ...item, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = { ...order, id, createdAt: new Date() };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newItem: OrderItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }
  
  async getOrderWithItems(orderId: number): Promise<OrderWithItems | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;
    
    const items = await this.getOrderItems(orderId);
    return { ...order, items };
  }

  // Shipping Option methods
  async getAllShippingOptions(): Promise<ShippingOption[]> {
    return Array.from(this.shippingOptions.values());
  }
  
  async getShippingOption(id: number): Promise<ShippingOption | undefined> {
    return this.shippingOptions.get(id);
  }
  
  async createShippingOption(option: InsertShippingOption): Promise<ShippingOption> {
    const id = this.shippingOptionIdCounter++;
    const newOption: ShippingOption = { ...option, id };
    this.shippingOptions.set(id, newOption);
    return newOption;
  }

  // Payment Method methods
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values())
      .filter(method => method.isActive);
  }
  
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    return this.paymentMethods.get(id);
  }
  
  async getPaymentMethodByCode(code: string): Promise<PaymentMethod | undefined> {
    return Array.from(this.paymentMethods.values()).find(
      method => method.code === code
    );
  }
  
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const id = this.paymentMethodIdCounter++;
    const newMethod: PaymentMethod = { ...method, id };
    this.paymentMethods.set(id, newMethod);
    return newMethod;
  }
}

// Database implementation
import { db } from "./db";
import { eq, like, and, or, desc, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";
import {
  products,
  users,
  carts,
  cartItems,
  orders,
  orderItems,
  shippingOptions,
  paymentMethods
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool as any, 
      createTableIfMissing: true 
    });
    // Initialize database with sample data
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if we already have products
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) {
        return; // Already initialized
      }

      // Add sample products
      const sampleProducts: InsertProduct[] = [
        {
          name: "Smartphone Premium",
          description: "O smartphone mais avançado com câmera de alta resolução e processador potente.",
          price: "2499.99",
          imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 15,
          rating: "4.8"
        },
        {
          name: "Notebook Ultrafino",
          description: "Notebook leve e fino com desempenho excepcional para trabalho e entretenimento.",
          price: "4299.99",
          imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 8,
          rating: "4.5"
        },
        {
          name: "Fones de Ouvido Bluetooth",
          description: "Fones sem fio com cancelamento de ruído para uma experiência imersiva.",
          price: "299.99",
          imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 25,
          rating: "4.2"
        },
        {
          name: "Camiseta Básica",
          description: "Camiseta 100% algodão de alta qualidade em diversas cores.",
          price: "89.99",
          imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Vestuário",
          stock: 50,
          rating: "4.0"
        },
        {
          name: "Tênis Esportivo",
          description: "Tênis confortável para corrida e caminhada com tecnologia de amortecimento.",
          price: "329.99",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Esportes",
          stock: 12,
          rating: "4.7"
        },
        {
          name: "O Poder do Hábito",
          description: "Best-seller sobre como transformar hábitos e mudar comportamentos.",
          price: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Livros",
          stock: 30,
          rating: "4.9"
        },
        {
          name: "Kit Panelas Antiaderentes",
          description: "Conjunto de panelas de alta qualidade com tecnologia antiaderente.",
          price: "399.99",
          imageUrl: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Casa & Jardim",
          stock: 18,
          rating: "4.3"
        },
        {
          name: "Relógio Inteligente",
          description: "Smartwatch com monitoramento de saúde, GPS e resistência à água.",
          price: "999.99",
          imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 10,
          rating: "4.6"
        },
        // Produtos adicionais do mesmo tipo para melhorar recomendações
        {
          name: "Smartphone Econômico",
          description: "Smartphone básico com ótimo custo-benefício para tarefas essenciais.",
          price: "899.99",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 25,
          rating: "4.0"
        },
        {
          name: "Smartphone Gamer",
          description: "Smartphone otimizado para jogos com processador rápido e refrigeração avançada.",
          price: "3299.99",
          imageUrl: "https://images.unsplash.com/photo-1592286927505-1def25115df9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 8,
          rating: "4.7"
        },
        {
          name: "Notebook para Estudantes",
          description: "Notebook simples ideal para estudos e tarefas básicas.",
          price: "2599.99",
          imageUrl: "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 12,
          rating: "4.1"
        },
        {
          name: "Notebook Gamer",
          description: "Notebook potente para jogos com GPU dedicada e tela de alta taxa de atualização.",
          price: "5999.99",
          imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 5,
          rating: "4.9"
        },
        {
          name: "Fones de Ouvido Esportivos",
          description: "Fones resistentes à água e suor, ideais para atividades físicas.",
          price: "199.99",
          imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 30,
          rating: "4.3"
        },
        {
          name: "Fones de Ouvido Premium",
          description: "Fones com qualidade de áudio superior e design elegante.",
          price: "599.99",
          imageUrl: "https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Eletrônicos",
          stock: 10,
          rating: "4.8"
        },
        {
          name: "Camiseta Estampada",
          description: "Camiseta com estampas modernas e tecido confortável.",
          price: "109.99",
          imageUrl: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Vestuário",
          stock: 35,
          rating: "4.2"
        },
        {
          name: "Camiseta Polo",
          description: "Camiseta polo elegante para ocasiões casuais e formais.",
          price: "129.99",
          imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Vestuário",
          stock: 25,
          rating: "4.5"
        },
        {
          name: "Tênis Casual",
          description: "Tênis confortável para uso diário com design moderno.",
          price: "259.99",
          imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Vestuário",
          stock: 18,
          rating: "4.4"
        },
        {
          name: "Tênis de Alta Performance",
          description: "Tênis profissional para competições e treinos intensos.",
          price: "499.99",
          imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          category: "Esportes",
          stock: 8,
          rating: "4.9"
        }
      ];

      for (const product of sampleProducts) {
        await this.createProduct(product);
      }

      // Add shipping options
      const shippingOptions: InsertShippingOption[] = [
        {
          name: "Entrega Padrão",
          description: "Entrega em 3-5 dias úteis",
          price: "19.90",
          estimatedDays: "3-5 dias"
        },
        {
          name: "Entrega Expressa",
          description: "Entrega em 1-2 dias úteis",
          price: "39.90",
          estimatedDays: "1-2 dias"
        },
        {
          name: "Retirada na Loja",
          description: "Retire seu pedido em uma de nossas lojas",
          price: "0.00",
          estimatedDays: "1 dia"
        }
      ];

      for (const option of shippingOptions) {
        await this.createShippingOption(option);
      }

      // Add payment methods
      const paymentMethods: InsertPaymentMethod[] = [
        {
          name: "Cartão de Crédito",
          code: "credit",
          isActive: true
        },
        {
          name: "Boleto Bancário",
          code: "boleto",
          isActive: true
        },
        {
          name: "PIX",
          code: "pix",
          isActive: true
        }
      ];

      for (const method of paymentMethods) {
        await this.createPaymentMethod(method);
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(products).where(
      or(
        like(sql`LOWER(${products.name})`, lowerQuery),
        like(sql`LOWER(${products.description})`, lowerQuery)
      )
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.id, id));
    return cart;
  }
  
  async getCartByUserId(userId: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
    return cart;
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const [newCart] = await db.insert(carts).values(cart).returning();
    return newCart;
  }
  
  async deleteCart(id: number): Promise<boolean> {
    // Delete cart items first
    await db.delete(cartItems).where(eq(cartItems.cartId, id));
    // Delete cart
    const result = await db.delete(carts).where(eq(carts.id, id));
    return result.count > 0;
  }

  // Cart Item methods
  async getCartItems(cartId: number): Promise<CartItemWithProduct[]> {
    const items = await db.select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));
    
    const result: CartItemWithProduct[] = [];
    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      if (product) {
        result.push({ ...item, product });
      }
    }
    
    return result;
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if this product already exists in the cart
    const [existingItem] = await db.select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, item.cartId),
          eq(cartItems.productId, item.productId)
        )
      );
    
    if (existingItem) {
      // Update quantity instead
      return await this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + (item.quantity || 1)
      ) as CartItem;
    }
    
    const [newItem] = await db.insert(cartItems).values({
      ...item,
      quantity: item.quantity || 1
    }).returning();
    return newItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.count > 0;
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values({
      ...order,
      status: order.status || "pending"
    }).returning();
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values({
      ...item,
      productId: item.productId || null
    }).returning();
    return newItem;
  }
  
  async getOrderWithItems(orderId: number): Promise<OrderWithItems | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;
    
    const items = await this.getOrderItems(orderId);
    return { ...order, items };
  }

  // Shipping Option methods
  async getAllShippingOptions(): Promise<ShippingOption[]> {
    return await db.select().from(shippingOptions);
  }
  
  async getShippingOption(id: number): Promise<ShippingOption | undefined> {
    const [option] = await db.select().from(shippingOptions).where(eq(shippingOptions.id, id));
    return option;
  }
  
  async createShippingOption(option: InsertShippingOption): Promise<ShippingOption> {
    const [newOption] = await db.insert(shippingOptions).values(option).returning();
    return newOption;
  }

  // Payment Method methods
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return await db.select()
      .from(paymentMethods)
      .where(eq(paymentMethods.isActive, true));
  }
  
  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    const [method] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, id));
    return method;
  }
  
  async getPaymentMethodByCode(code: string): Promise<PaymentMethod | undefined> {
    const [method] = await db.select().from(paymentMethods).where(eq(paymentMethods.code, code));
    return method;
  }
  
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const [newMethod] = await db.insert(paymentMethods).values({
      ...method,
      isActive: method.isActive === undefined ? true : method.isActive
    }).returning();
    return newMethod;
  }
}

export const storage = new DatabaseStorage();
