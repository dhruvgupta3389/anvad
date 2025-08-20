import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#f9f5ef] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl text-center font-bold mb-6 ">Refund Policy</h1>

        <p className="mb-4">
          We have a 5-day exchange/return policy, which means you have 5 days after receiving your item to request a replacement or a return. For exchange/return, you can contact us at{" "}
          <a href="mailto:customer@Anveda.farm" className="text-[#2f7a4d] underline">customer@Anveda.farm</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Exchanges and Returns</h2>
        <p className="mb-4">
          To be eligible for an exchange/return, your item must be in the same condition that you received it, unused and in its original packaging. To complete your exchange/return, the invoice must be provided at the time of return pickup. Once used, products will be ineligible for exchange or return.
        </p>

        <p className="mb-4">
          Exchanges/Returns are only allowed in the following unlikely cases:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The product is damaged or if you received the wrong item.</li>
          <li>The product is not sealed properly at the time of delivery.</li>
          <li>The product has expired by the time of delivery.</li>
        </ul>

        <p className="mb-4">
          If your return is accepted, we will pick up the item ordered from the same address, and you will be notified of the expected pick-up date.
        </p>

        <p className="mb-4">
          In case of an exchange, the product will be delivered to you within 3-5 days after the return pick-up is done.
        </p>

        <p className="mb-4">
          In case of any delivery related discrepancy, please reach out to us within 48 hours after the order has been marked as delivered.
        </p>

        <p className="mb-4">
          <strong>Note:</strong> In case of any quality issue, kindly contact us on{" "}
          <a href="tel:+911141219696" className="text-[#2f7a4d] underline">+91 1141219696</a> or drop a mail to{" "}
          <a href="mailto:customer@Anveda.farm" className="text-[#2f7a4d] underline">customer@Anveda.farm</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Cancellation</h2>
        <p className="mb-4">
          An order cancellation request will be accepted only if we have not yet shipped the product.
          If a cancellation request is accepted, you are entitled to get a refund of the entire amount.
          Anveda reserves the right to cancel or refuse to accept any order placed for various reasons, including but not limited to the non-availability of stock, pricing errors, informational errors or problems identified with the personal/financial details provided by the customer.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Refunds</h2>
        <p className="mb-4">
          Once your return is received and inspected, we will notify you that we have received your returned item. We will also notify you if the refund was approved or not.
          If approved, you'll be automatically refunded on your original payment method. Please note that it generally takes around 5-7 days to reflect this amount.
        </p>

        <p className="mb-4">
          You can always contact us for any return question at{" "}
          <a href="mailto:customer@Anveda.farm" className="text-[#2f7a4d] underline">customer@Anveda.farm</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
