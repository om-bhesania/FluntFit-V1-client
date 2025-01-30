import { useEffect, useState } from "react";
import InvoiceHistoryComponent from "./InvoiceHistoryComponent";
import { GetInvoiceApi } from "../InvoiceApis";
import useToast from "../../../hooks/useToast";
import { Button } from "@nextui-org/react";
import { Receipt } from "lucide-react";
import { DeleteIcon, EditIcon, EyeIcon } from "../../../assets/images/Icon";
import CustomTooltip from "../../../components/tooltip/Tooltip";
import Swal from "sweetalert2";

function InvoiceHistoryController() {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null); // State for selected invoice
  const { notify } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await GetInvoiceApi(notify);
      setData(res);
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  const invokeAlert = () => {};
  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice); // Store selected invoice data
    invokeAlert();
    Swal.fire({
      title: `Invoice: ${invoice.invoiceNumber}!`,
      width: "70%",
      html: `
     <div style="font-family: 'Arial', sans-serif; max-width: 1000px; margin: 0 auto; background-color: #1a1a1a; color: #e0e0e0; padding: 30px; border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
        <div>
          <h1 style="font-size: 28px; color: #4a90e2; margin: 0;">INVOICE</h1>
          <p style="font-size: 14px; color: #888;">#${invoice.invoiceNumber}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 14px; margin: 0;"><strong>Date:</strong> ${
            invoice.currentDate
          }</p>
          <p style="font-size: 14px; margin: 5px 0;"><strong>Cashier:</strong> ${
            invoice.cashier
          }</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; text-align:text-justify;">
        <div style="width: 48%;">
          <h3 style="font-size: 18px; color: #4a90e2; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">Customer Details</h3>
          <p><strong>Name:</strong> ${invoice.name}</p>
          <p><strong>Phone:</strong> ${invoice.phone}</p>
          <p><strong>Email:</strong> ${invoice.email}</p>
          <p><strong>Address:</strong> ${invoice.address}</p>
        </div>
        <div style="width: 48%;">
          <h3 style="font-size: 18px; color: #4a90e2; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">Billing Summary</h3>
          <p><strong>Subtotal:</strong> ₹${invoice.subtotal}</p>
          <p><strong>Discount Applied:</strong> ₹${invoice.totalDiscount}</p>
          <p><strong>SGST:</strong> ₹${invoice.sgst}</p>
          <p><strong>CGST:</strong> ₹${invoice.cgst}</p>
          <p><strong>GST Amount:</strong> ₹${invoice.sgst + invoice.cgst}</p>
          <p style="font-size: 18px; font-weight: bold; color: #4a90e2; margin-top: 10px;">
            <strong>Total Amount:</strong> ₹${invoice.subtotal}
          </p>
        </div>
      </div>

      <h3 style="font-size: 18px; color: #4a90e2; border-bottom: 1px solid #333; padding-bottom: 10px;">Items</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #2a2a2a;">
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #444;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #444;">Quantity</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #444;">Unit Price</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #444;">GST</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #444;">Discount</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #444;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item: any, index: number) => `
                <tr style="background-color: ${
                  index % 2 === 0 ? "#1e1e1e" : "#242424"
                };">
                  <td style="padding: 12px; border-bottom: 1px solid #333;">${
                    item.item
                  }</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #333;">${
                    item.quantity
                  }</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #333;">₹${
                    item.price
                  }</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #333;">${
                    item.gst
                  }%</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #333;">₹${
                    item.productDiscount
                  }</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #333;">₹${Number.parseInt(
                    item.productDiscount
                  )}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
        Thank you for your business!
      </div>
    </div>
    `,
      confirmButtonText: "Close",
      background: "#1a1a1a", // Tailwind dark background color
      customClass: {
        popup: "swal2-dark", // SweetAlert2 dark theme class
        title: "text-white", // Tailwind class for title color
        confirmButton:
          "bg-danger hover:bg-primary duration-250 ease-in-out transition text-white font-bold py-2 px-4 rounded",
      },
    });
  };

  const columns = [
    {
      header: "Invoice Number",
      accessorKey: "invoiceNumber",
    },
    {
      header: "Cashier",
      accessorKey: "cashier",
    },
    {
      header: "Customer Name",
      accessorKey: "name",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Total Discount",
      accessorKey: "totalDiscount",
      cell: (info: any) => `₹${info.getValue().toFixed(2)}`,
    },
    {
      header: "SGST",
      accessorKey: "sgst",
      cell: (info: any) => `₹${info.getValue().toFixed(2)}`,
    },
    {
      header: "CGST",
      accessorKey: "cgst",
      cell: (info: any) => `₹${info.getValue().toFixed(2)}`,
    },
    {
      header: "GST Amount",
      accessorKey: "gstAmount",
      cell: (info: any) => `₹${info.getValue().toFixed(2)}`,
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (info: any) => (
        <>
          <Button
            variant="solid"
            className="bg-transparent"
            isIconOnly
            onClick={() => handleViewInvoice(info.row.original)} // Pass row data
          >
            <EyeIcon />
          </Button>
          <Button variant="solid" className="bg-transparent" isIconOnly>
            <DeleteIcon />
          </Button>
          <Button variant="solid" className="bg-transparent" isIconOnly>
            <CustomTooltip
              content="Download Invoice"
              trigger={<Receipt className="text-gray-300" />}
              className="text-gray-300"
            />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <InvoiceHistoryComponent
        columns={columns}
        data={data}
        loading={loading}
      />
    </div>
  );
}

export default InvoiceHistoryController;
