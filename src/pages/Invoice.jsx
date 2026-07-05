import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import invoiceService from "../utils/invoiceService";
import InvoiceHeader from "../components/invoice/InvoiceHeader";
import InvoiceItems from "../components/invoice/InvoiceItems";
import InvoiceCustomer from "../components/invoice/InvoiceCustomer";
import InvoiceSummary from "../components/invoice/InvoiceSummary";

const Invoice = () => {

  const { invoiceNo } = useParams();

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const data = await invoiceService.getInvoice(invoiceNo);
      console.log("Invoice Data:", data);
      setInvoice(data);
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      console.log("Full Error:", err);
      setError("Invoice not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">

      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="p-10 lg:p-16">

            <InvoiceHeader invoice={invoice} />

            <InvoiceCustomer invoice={invoice} />

            <InvoiceItems invoice={invoice} />

            <InvoiceSummary invoice={invoice} />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Invoice;