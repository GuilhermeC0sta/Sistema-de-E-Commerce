interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, title: "Entrega" },
    { number: 2, title: "Pagamento" },
    { number: 3, title: "Confirmação" }
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between w-full mb-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full text-white font-medium ${
              currentStep >= step.number ? "bg-primary-600" : "bg-neutral-200 text-neutral-500"
            }`}>
              {step.number}
            </div>
            <div className="ml-3">
              <span className={`text-sm font-medium ${
                currentStep >= step.number ? "text-neutral-900" : "text-neutral-500"
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden sm:block w-full mx-4 border-t border-neutral-300"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
