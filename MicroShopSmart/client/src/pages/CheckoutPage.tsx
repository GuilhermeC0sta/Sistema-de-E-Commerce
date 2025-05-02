import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CheckoutSteps from "@/components/CheckoutSteps";
import ShippingForm from "@/components/ShippingForm";
import PaymentForm from "@/components/PaymentForm";
import OrderConfirmation from "@/components/OrderConfirmation";
import OrderSummary from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { ShippingOption, PaymentMethod } from "@shared/schema";

export type CustomerData = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
};

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { cartItems, cartId, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipcode: user?.zipcode || "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShippingSubmit = (data: CustomerData, shippingOption: ShippingOption) => {
    setCustomerData(data);
    setSelectedShipping(shippingOption);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (paymentMethod: PaymentMethod, details: any) => {
    setSelectedPayment(paymentMethod);
    if (details) {
      setPaymentDetails(details);
    }
    setCurrentStep(3);
  };

  const handleCompleteOrder = async () => {
    if (!cartId || !selectedShipping || !selectedPayment) {
      toast({
        title: "Erro",
        description: "Informações de checkout incompletas. Por favor, tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const subtotal = getCartTotal();
      const shippingCost = Number(selectedShipping.price);
      const total = subtotal + shippingCost;
      
      // Create order
      const orderResponse = await apiRequest("POST", "/api/orders", {
        userId: user?.id || null,
        status: "pending",
        shippingAddress: customerData.address,
        shippingCity: customerData.city,
        shippingState: customerData.state,
        shippingZipcode: customerData.zipcode,
        shippingMethod: selectedShipping.name,
        shippingCost: selectedShipping.price,
        paymentMethod: selectedPayment.code,
        subtotal: subtotal.toString(),
        total: total.toString(),
        cartId: cartId
      });
      
      const order = await orderResponse.json();
      setOrderId(order.id);
      
      // Process payment
      await apiRequest("POST", "/api/payment/process", {
        orderId: order.id,
        paymentMethod: selectedPayment.code,
        paymentDetails: selectedPayment.code === "credit" ? paymentDetails : null
      });
      
      // Clear cart after successful order
      await clearCart();
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido #${order.id} foi confirmado.`,
      });
    } catch (error) {
      console.error("Error completing order:", error);
      toast({
        title: "Erro ao finalizar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to products page if cart is empty
  if (cartItems.length === 0 && currentStep === 1) {
    toast({
      title: "Carrinho vazio",
      description: "Adicione produtos ao carrinho para prosseguir com o checkout.",
    });
    setLocation("/products");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Form section */}
        <div className="lg:col-span-7">
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900">Checkout</h3>
              <p className="mt-1 text-sm text-neutral-500">Complete as etapas para finalizar seu pedido</p>
            </div>
            
            {/* Progress Steps */}
            <CheckoutSteps currentStep={currentStep} />
            
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <ShippingForm 
                initialData={customerData}
                onSubmit={handleShippingSubmit} 
              />
            )}
            
            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <PaymentForm 
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <OrderConfirmation
                customerData={customerData}
                selectedShipping={selectedShipping!}
                selectedPayment={selectedPayment!}
                paymentDetails={paymentDetails}
                cartItems={cartItems}
                onBack={() => setCurrentStep(2)}
                onComplete={handleCompleteOrder}
                isSubmitting={isSubmitting}
                orderId={orderId}
              />
            )}
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-5">
          <OrderSummary 
            cartItems={cartItems} 
            selectedShipping={selectedShipping}
          />
        </div>
      </div>
    </div>
  );
}
