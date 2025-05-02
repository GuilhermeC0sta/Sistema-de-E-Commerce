import { CartItemWithProduct, ShippingOption, PaymentMethod } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/api";
import { CreditCard, Home, Check, Truck, DollarSign } from "lucide-react";

interface OrderConfirmationProps {
  customerData: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
  };
  selectedShipping: ShippingOption;
  selectedPayment: PaymentMethod;
  paymentDetails: {
    cardNumber?: string;
    cardName?: string;
    cardExpiry?: string;
    cardCvv?: string;
  };
  cartItems: CartItemWithProduct[];
  onBack: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
  orderId: number | null;
}

export default function OrderConfirmation({
  customerData,
  selectedShipping,
  selectedPayment,
  paymentDetails,
  cartItems,
  onBack,
  onComplete,
  isSubmitting,
  orderId
}: OrderConfirmationProps) {
  // Success state
  if (orderId) {
    return (
      <div className="px-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-neutral-900">Pedido Confirmado!</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Seu pedido #{orderId} foi confirmado e será processado em breve.
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Um email com os detalhes do pedido foi enviado para {customerData.email}.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => window.location.href = "/"}
            className="w-full sm:w-auto"
          >
            Continuar Comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <h4 className="text-lg font-medium text-neutral-900 mb-4">Revisar Pedido</h4>
      
      <div className="space-y-6">
        {/* Shipping Information */}
        <div>
          <div className="flex items-center mb-2">
            <Home className="h-5 w-5 text-neutral-500 mr-2" />
            <h5 className="text-sm font-medium text-neutral-700">Informações de Entrega</h5>
          </div>
          <div className="bg-neutral-50 p-3 rounded-md">
            <p className="text-sm text-neutral-800">{customerData.name}</p>
            <p className="text-sm text-neutral-600">{customerData.email}</p>
            <p className="text-sm text-neutral-600 mt-2">{customerData.address}</p>
            <p className="text-sm text-neutral-600">
              {customerData.city}, {customerData.state} - {customerData.zipcode}
            </p>
            <div className="flex items-center mt-2">
              <Truck className="h-4 w-4 text-neutral-500 mr-1" />
              <p className="text-sm text-neutral-600 font-medium">{selectedShipping.name}</p>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div>
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 text-neutral-500 mr-2" />
            <h5 className="text-sm font-medium text-neutral-700">Método de Pagamento</h5>
          </div>
          <div className="bg-neutral-50 p-3 rounded-md">
            <p className="text-sm text-neutral-800">{selectedPayment.name}</p>
            {selectedPayment.code === "credit" && paymentDetails.cardNumber && (
              <p className="text-sm text-neutral-600 mt-1">
                **** **** **** {paymentDetails.cardNumber.slice(-4)}
              </p>
            )}
            {selectedPayment.code === "boleto" && (
              <p className="text-sm text-neutral-600 mt-1">
                O boleto será gerado após a confirmação do pedido
              </p>
            )}
            {selectedPayment.code === "pix" && (
              <p className="text-sm text-neutral-600 mt-1">
                O QR Code será exibido após a confirmação
              </p>
            )}
          </div>
        </div>
        
        {/* Order Items */}
        <div>
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-neutral-500 mr-2" />
            <h5 className="text-sm font-medium text-neutral-700">Itens do Pedido</h5>
          </div>
          <div className="bg-neutral-50 p-3 rounded-md">
            <ul className="divide-y divide-neutral-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-neutral-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-neutral-500">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-neutral-800">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-t border-neutral-200 mt-3 pt-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Subtotal:</span>
                <span>
                  {formatPrice(
                    cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium">Frete:</span>
                <span>{formatPrice(Number(selectedShipping.price))}</span>
              </div>
              <div className="flex justify-between text-base font-semibold mt-2">
                <span>Total:</span>
                <span>
                  {formatPrice(
                    cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0) +
                      Number(selectedShipping.price)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            disabled={isSubmitting}
          >
            Voltar
          </Button>
          <Button 
            onClick={onComplete}
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Processando</span>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              'Confirmar Pedido'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
