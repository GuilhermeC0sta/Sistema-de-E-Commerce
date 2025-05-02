import { db } from "./db";
import { eq } from "drizzle-orm";
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

import type {
  InsertProduct,
  InsertShippingOption,
  InsertPaymentMethod,
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  ShippingOption,
  PaymentMethod,
} from "@shared/schema";

interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getProduct(id: number): Promise<Product | undefined>;
  getCart(id: number): Promise<Cart | undefined>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  getShippingOptions(): Promise<ShippingOption[]>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  createProduct(product: InsertProduct): Promise<void>;
  createShippingOption(option: InsertShippingOption): Promise<void>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) return;

      const sampleProducts: InsertProduct[] = [
        {
          name: "Camiseta básica",
          description: "Camiseta confortável 100% algodão",
          price: 49.9,
          imageUrl: "https://source.unsplash.com/400x400/?tshirt",
          category: "Roupas",
          stock: 100,
          rating: 4.5,
        },
        {
          name: "Tênis esportivo",
          description: "Leve e ideal para caminhadas e corridas",
          price: 199.9,
          imageUrl: "https://source.unsplash.com/400x400/?sneakers",
          category: "Calçados",
          stock: 60,
          rating: 4.7,
        },
      ];

      for (const product of sampleProducts) {
        await this.createProduct(product);
      }

      const shippingOptionsList: InsertShippingOption[] = [
        {
          name: "Frete Padrão",
          description: "Entrega em até 7 dias úteis",
          price: 14.9,
          estimatedDays: "5-7",
        },
        {
          name: "Sedex",
          description: "Entrega em até 3 dias úteis",
          price: 29.9,
          estimatedDays: "1-3",
        },
      ];

      for (const option of shippingOptionsList) {
        await this.createShippingOption(option);
      }

      const paymentMethodsList: InsertPaymentMethod[] = [
        {
          name: "Cartão de Crédito",
          code: "credit_card",
          isActive: true,
        },
        {
          name: "Boleto Bancário",
          code: "boleto",
          isActive: true,
        },
      ];

      for (const method of paymentMethodsList) {
        await this.createPaymentMethod(method);
      }
    } catch (error) {
      console.error("Erro ao inicializar dados:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async getCart(id: number): Promise<Cart | undefined> {
    const result = await db.select().from(carts).where(eq(carts.id, id)).limit(1);
    return result[0];
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getShippingOptions(): Promise<ShippingOption[]> {
    return db.select().from(shippingOptions);
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return db.select().from(paymentMethods);
  }

  async createProduct(product: InsertProduct): Promise<void> {
    await db.insert(products).values(product);
  }

  async createShippingOption(option: InsertShippingOption): Promise<void> {
    await db.insert(shippingOptions).values(option);
  }

  async createPaymentMethod(method: InsertPaymentMethod): Promise<void> {
    await db.insert(paymentMethods).values(method);
  }
}
export const storage = new DatabaseStorage();

