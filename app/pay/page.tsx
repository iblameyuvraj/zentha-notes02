import PricingPage from "@/components/payment-model";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="container relative pb-10">
        <div className="px-4 pt-20 pb-8 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl text-white font-bold">
              Simple pricing for advanced people
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our pricing is designed for advanced people who need more features
              and more flexibility.
            </p>
          </div>
          <PricingPage />
        </div>
      </div>
    </main>
  );
}
