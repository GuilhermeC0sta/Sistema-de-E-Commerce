import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = new Database("local.db");
const db = drizzle(sqlite, { schema });

const tabelas = [
  { name: "users", file: "users.json" },
  { name: "products", file: "products.json" },
  { name: "carts", file: "carts.json" },
  { name: "cart_items", file: "cart_items.json" },
  { name: "orders", file: "orders.json" },
  { name: "order_items", file: "order_items.json" },
  { name: "payment_methods", file: "payment_methods.json" },
  { name: "shipping_options", file: "shipping_options.json" },
  { name: "session", file: "session.json" }
];

const tableMap = {
  users: schema.users,
  products: schema.products,
  carts: schema.carts,
  cart_items: schema.cartItems,
  orders: schema.orders,
  order_items: schema.orderItems,
  payment_methods: schema.paymentMethods,
  shipping_options: schema.shippingOptions,
  session: schema.session,
};

async function run() {
  for (const { name, file } of tabelas) {
    const filePath = path.resolve(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Arquivo não encontrado: ${file}`);
      continue;
    }
    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!Array.isArray(json)) {
      console.warn(`⚠️ Formato inválido no arquivo: ${file}`);
      continue;
    }
    console.log(`📥 Importando ${json.length} registros para ${name}...`);
    await db.insert(tableMap[name]).values(json);
  }
  console.log("✅ Importação concluída.");
}

run();
