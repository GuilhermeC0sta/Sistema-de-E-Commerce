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
    <div className="px-6 py-4 border-b border-neutral-200">
      <nav aria-label="Progresso do checkout">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <li key={step.number} className="relative flex flex-col items-center">
              {/* Connecting line */}
              {index > 0 && (
                <div 
                  className={`absolute top-4 w-full h-0.5 -left-1/2 ${
                    currentStep > index ? "bg-primary-600" : "bg-neutral-200"
                  }`}
                />
              )}
              {/* Step circle */}
              <div 
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 z-10 
                  ${currentStep === step.number 
                    ? "border-primary-600 bg-primary-600 text-white" 
                    : currentStep > step.number
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-neutral-300 bg-white text-neutral-500"
                  }`}
              >
                {currentStep > step.number ? (
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              {/* Step title */}
              <div className="mt-2 text-center">
                <span 
                  className={`text-sm font-medium ${
                    currentStep >= step.number ? "text-primary-700" : "text-neutral-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
