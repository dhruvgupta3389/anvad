import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#f9f5ef] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#2f7a4d]">Shipping Policy</h1>

        <p className="mb-4">
          Anveshan collaborates with multiple courier partners for shipping across India.
          We only have standard shipping available at the moment.
          Depending on the location, it takes 2–9 days for delivery.
          We accept orders only from India.
        </p>

        <p className="mb-4">
          Anveshan reserves the right to cancel an order within 48 hours from the time of order.
        </p>
      </main>

      <Footer />
    </div>
  );
}
