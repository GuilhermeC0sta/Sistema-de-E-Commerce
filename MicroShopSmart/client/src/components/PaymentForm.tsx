import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentMethod } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";

// Schema for the payment form
const paymentFormSchema = z.object({
  paymentMethod: z.string().min(1, { message: "Selecione um método de pagamento" }),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

// Conditional validation based on payment method
const creditCardSchema = paymentFormSchema.extend({
  cardNumber: z.string().min(16, { message: "Número do cartão inválido" }).max(19),
  cardName: z.string().min(3, { message: "Nome no cartão é obrigatório" }),
  cardExpiry: z.string().min(5, { message: "Data de validade inválida" }),
  cardCvv: z.string().min(3, { message: "CVV inválido" }).max(4),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (paymentMethod: PaymentMethod, details?: any) => void;
  onBack: () => void;
}

export default function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const [selectedPaymentCode, setSelectedPaymentCode] = useState<string>("");

  // Fetch payment methods
  const { data: paymentMethods, isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment/methods"],
  });

  // Setup form with react-hook-form and zod validation
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  // Find selected payment method
  const selectedMethod = paymentMethods?.find(
    (method) => method.code === selectedPaymentCode
  );

  // Handle form submission
  const handleSubmit = (data: PaymentFormValues) => {
    // Extra validation for credit card
    if (selectedPaymentCode === "credit") {
      try {
        creditCardSchema.parse(data);
      } catch (error) {
        return;
      }
    }

    if (selectedMethod) {
      const paymentDetails = selectedPaymentCode === "credit"
        ? {
            cardNumber: data.cardNumber,
            cardName: data.cardName,
            cardExpiry: data.cardExpiry,
            cardCvv: data.cardCvv,
          }
        : null;

      onSubmit(selectedMethod, paymentDetails);
    }
  };

  // Update selected payment method when the form value changes
  const handlePaymentMethodChange = (value: string) => {
    const method = paymentMethods?.find((m) => m.id.toString() === value);
    setSelectedPaymentCode(method?.code || "");
    form.setValue("paymentMethod", value);
  };

  return (
    <div className="px-6 py-4">
      <h4 className="text-lg font-medium text-neutral-900 mb-4">Método de Pagamento</h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Selecione um método de pagamento</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      handlePaymentMethodChange(value);
                    }}
                    defaultValue={field.value}
                    className="space-y-3"
                  >
                    {isLoading ? (
                      // Loading state for payment methods
                      Array(3).fill(0).map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-5 w-40" />
                        </div>
                      ))
                    ) : (
                      paymentMethods?.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={method.id.toString()} id={`payment-${method.id}`} />
                          <Label htmlFor={`payment-${method.id}`} className="text-sm font-medium text-neutral-700">
                            {method.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Credit Card Form */}
          {selectedPaymentCode === "credit" && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Cartão</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1234 5678 9012 3456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome no Cartão</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade (MM/AA)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MM/AA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardCvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Boleto Information */}
          {selectedPaymentCode === "boleto" && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-md">
              <div className="flex items-center">
                <InfoIcon className="text-primary-500 h-5 w-5 mr-2" />
                <p className="text-sm text-neutral-600">
                  O boleto será gerado após a confirmação do pedido. Você terá até 3 dias úteis para realizar o pagamento.
                </p>
              </div>
            </div>
          )}
          
          {/* PIX Information */}
          {selectedPaymentCode === "pix" && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-md">
              <div className="flex items-center">
                <InfoIcon className="text-primary-500 h-5 w-5 mr-2" />
                <p className="text-sm text-neutral-600">
                  O QR Code do PIX será exibido na próxima etapa. O pagamento deve ser realizado em até 30 minutos.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
            >
              Voltar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedPaymentCode || isLoading}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Revisar Pedido
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
