import { CartItemWithProduct, ShippingOption } from "@shared/schema";
import { formatPrice } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface OrderSummaryProps {
  cartItems: CartItemWithProduct[];
  selectedShipping: ShippingOption | null;
}

export default function OrderSummary({ cartItems, selectedShipping }: OrderSummaryProps) {
  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
  
  // Calculate shipping cost
  const shippingCost = selectedShipping ? Number(selectedShipping.price) : 0;
  
  // Calculate order total
  const total = subtotal + shippingCost;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-neutral-600">Subtotal</dt>
              <dd className="text-sm font-medium text-neutral-800">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-neutral-600">Frete</dt>
              <dd className="text-sm font-medium text-neutral-800">
                {selectedShipping ? formatPrice(shippingCost) : "Selecione uma opção"}
              </dd>
            </div>
            <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
              <dt className="text-base font-medium text-neutral-900">Total</dt>
              <dd className="text-base font-medium text-neutral-900">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
        </CardContent>
        <div className="px-6 py-4 bg-neutral-50 rounded-b-lg">
          <div className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-primary-500 mt-0.5" />
            <p className="ml-3 text-sm text-neutral-600">
              Suas informações de pagamento são protegidas por criptografia de ponta a ponta.
            </p>
          </div>
        </div>
      </Card>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Itens do Carrinho</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-neutral-200">
            {cartItems.map((item) => (
              <li key={item.id} className="px-6 py-4 flex">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-neutral-900">
                      <h3 className="line-clamp-1">{item.product.name}</h3>
                      <p className="ml-4">{formatPrice(Number(item.price) * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{item.product.category}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-neutral-500">Qtd: {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
