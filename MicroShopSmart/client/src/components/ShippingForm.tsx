import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShippingOption } from "@shared/schema";
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
import { formatPrice } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Schema for the shipping form
const shippingFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  address: z.string().min(5, { message: "Endereço é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zipcode: z.string().min(8, { message: "CEP inválido" }).max(9),
  shippingOption: z.string().min(1, { message: "Selecione uma opção de entrega" }),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

interface ShippingFormProps {
  initialData: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
  };
  onSubmit: (data: any, shippingOption: ShippingOption) => void;
}

export default function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);

  // Fetch shipping options
  const { data: shippingOptions, isLoading } = useQuery<ShippingOption[]>({
    queryKey: ["/api/shipping/options"],
  });

  // Setup form with react-hook-form and zod validation
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      address: initialData.address || "",
      city: initialData.city || "",
      state: initialData.state || "",
      zipcode: initialData.zipcode || "",
      shippingOption: "",
    },
  });

  // Update selected shipping option when the form value changes
  useEffect(() => {
    const shippingOptionId = form.watch("shippingOption");
    if (shippingOptionId && shippingOptions) {
      const option = shippingOptions.find((opt) => opt.id.toString() === shippingOptionId);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [form.watch("shippingOption"), shippingOptions]);

  // Handle form submission
  const handleSubmit = (data: ShippingFormValues) => {
    if (selectedOption) {
      onSubmit(data, selectedOption);
    }
  };

  return (
    <div className="px-6 py-4">
      <h4 className="text-lg font-medium text-neutral-900 mb-4">Informações de Entrega</h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="shippingOption"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Opções de entrega</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-3"
                    >
                      {isLoading ? (
                        // Loading state for shipping options
                        Array(3).fill(0).map((_, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-5 w-64" />
                          </div>
                        ))
                      ) : (
                        shippingOptions?.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id.toString()} id={`shipping-${option.id}`} />
                            <Label htmlFor={`shipping-${option.id}`} className="flex justify-between w-full">
                              <span className="block text-sm font-medium text-neutral-700">
                                {option.name} <span className="text-neutral-500">({option.estimatedDays})</span>
                              </span>
                              <span className="block text-sm font-medium text-neutral-700">
                                {formatPrice(option.price)}
                              </span>
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
          </div>
          
          <div className="flex justify-end mt-8">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 text-base shadow-md flex items-center space-x-2"
              style={{backgroundColor: "#4F46E5"}}
              size="lg"
            >
              <span>Continuar para Pagamento</span>
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
