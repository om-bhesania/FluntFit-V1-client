import { jsPDF } from "jspdf";
import "jspdf-autotable";
// import montserrat from ''
import { Button } from "@nextui-org/react";
import Montserrat from "../../../assets/fonts/Montserrat";
import CustomTooltip from "../../../components/tooltip/Tooltip";
import { Receipt } from "lucide-react";

interface InvoiceItem {
  item: string;
  hsnSac?: string;
  quantity?: string | number;
  price?: string | number;
  productDiscount?: string | number;
  total: number;
  gst?: string | number;
  id?: string | number;

}

interface InvoiceData {
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  invoiceNumber?: string;
  items?: InvoiceItem[];
  totalUntaxedAmount?: string | number;
  totalDiscount?: string | number;
  sgst?: string | number;
  cgst?: string | number;
  totalBillingAmount?: string | number;
}

interface InvoicePDFGeneratorProps {
  invoiceData: InvoiceData;
  handleReviewInvoice: (data: any) => void;  isTable?: boolean;
}

const generateInvoicePDF = ({
  invoiceData,
}: {
  invoiceData: InvoiceData;
}): jsPDF => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  doc.addFileToVFS("Montserrat-Thin", Montserrat);
  doc.addFont("Montserrat-Thin", "NotoSans", "normal");
  doc.setFont("montserrat");

  // Helper function to add multi-line text
  const addMultiLineText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number
  ) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length;
  };

  // Helper function to draw a line
  const drawLine = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(startX, startY, endX, endY);
  };

  // Set initial y position
  let yPos = 10;

  // Add logo
  doc.addImage(
    "https://mixbunch.in/cdn/shop/files/logo4.png?v=1703583291&width=600",
    "PNG",
    10,
    yPos,
    12,
    12
  );

  // Company details
  doc.setFontSize(24);
  doc.text("Mix Bunch", 25, yPos + 6);
  doc.setFontSize(16);
  doc.text("Blend Of Fashion", 25, yPos + 12);
  // drawLine(10, yPos + 15, 200, yPos + 15);

  doc.setFontSize(10);
  doc.setTextColor(100);
  const companyAddress = [
    "Shop No-10, Fortune Air,",
    "Krunal Char Rasta, Gotri,",
    "Vadodara-390021",
    "Ph:- 7043745089",
  ];

  companyAddress.forEach((line, index) => {
    doc.text(line, 10, yPos + 20 + index * 5);
  });

  // Customer details
  doc.setFontSize(10);
  doc.setTextColor(100);
  const customerDetails = [
    invoiceData?.name || "Customer Name",
    invoiceData?.phone || "Phone",
    invoiceData?.city || "City",
    invoiceData?.state || "State",
    `Place of supply: ${invoiceData?.state || "State"}`,
  ];

  customerDetails.forEach((line, index) => {
    doc.text(line, 200, yPos + 20 + index * 5, { align: "right" });
  });

  // GST number and Invoice number side by side
  yPos += 48;
  doc.setFontSize(12);
  doc.setTextColor(1);
  doc.text(`GSTIN:- 24IZRPK5753C1Z1`, 10, yPos);
  doc.text(`Customer Invoice ${invoiceData?.invoiceNumber}`, 200, yPos, {
    align: "right",
  });

  // Invoice table
  yPos += 10;
  const tableColumns = [
    { header: "Name", width: 30 },
    { header: "HSN/SAC", width: 25 },
    { header: "Quantity", width: 20 },
    { header: "Price", width: 25 },
    { header: "Discount %", width: 20 },
    { header: "Total Price", width: 25 },
    { header: "Taxes", width: 20 },
    { header: "Amount", width: 20 },
  ];

  // Draw header
  let xPos = 4;
  doc.setFillColor(245, 245, 245);
  doc.setFontSize(12);
  doc.setFont("montserrat", Montserrat);
  doc.setTextColor(0);
  drawLine(10, yPos + 8, 200, yPos + 8); // Add underline after the first header
  tableColumns.forEach((col) => {
    doc.text(col.header, xPos + col.width / 2, yPos + 5, { align: "center" });
    xPos += col.width;
  });

  // Draw rows
  yPos += 10;
  doc.setFontSize(9);
  invoiceData?.items?.forEach((item) => {
    if (item.item && item.item !== "") {
      xPos = 4;
      const rowData = [
        item.item,
        item.hsnSac || "",
        item.quantity?.toString() || "0.0",
        `${item?.price?.toString() || "0.0"}`,
        `${item?.productDiscount?.toString() || "0.0"}%`,
        `${Number(item?.total.toString()).toFixed(2) || "0.0"}`,
        `${item?.gst?.toString() || "0.0"}%`,
        `${Number(item?.total).toFixed(2) || "0.0"}`, // Using Unicode for Rupee symbol
      ];
      tableColumns.forEach((col, colIndex) => {
        doc.text(rowData[colIndex], xPos + col.width / 2, yPos + 5, {
          align: "center",
        });
        xPos += col.width;
      });
      yPos += 7;
    }
  });

  // Summary section
  yPos += 10;
  const summaryData = [
    [
      "Untaxed Amount",
      `${Number(invoiceData?.totalUntaxedAmount?.toString() || "0.0").toFixed(
        2
      )}`,
    ],
    [
      "Discount",
      `- ${Number(invoiceData?.totalDiscount?.toString() || "0.0").toFixed(2)}`,
    ],
    [
      "Taxable Amount",
      `${(
        Number(invoiceData?.totalUntaxedAmount?.toString() || "0") -
          Number(invoiceData?.totalDiscount?.toString() || "0") || 0.0
      ).toFixed(2)}`,
    ],
    ["- SGST", `${Number(invoiceData?.sgst?.toString() || "0.0").toFixed(2)}`],
    ["- CGST", `${Number(invoiceData?.cgst?.toString() || "0.0").toFixed(2)}`],
    ["Total", `${invoiceData?.totalBillingAmount?.toString() || "0.0"}`],
  ];

  doc.setFontSize(10);
  summaryData.forEach((row, index) => {
    if (index === 3 || index === 4) {
      doc.setFontSize(9);
      doc.setTextColor(100);
    } else if (index === 5) {
      doc.setFontSize(11);
      doc.setTextColor(0);
    } else {
      doc.setFontSize(10);
      doc.setTextColor(0);
    }
    doc.text(row[0], 140, yPos);
    doc.text(row[1], 190, yPos, { align: "center" });
    if (index < summaryData.length - 1) {
      drawLine(140, yPos + 2, 200, yPos + 2); // Adjusted endX to cover the whole area
    }
    yPos += 8;
  });

  // Payment and return policy
  yPos += 40;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Payment Communication: ${invoiceData?.invoiceNumber}`,
    10,
    yPos + 50
  );

  const returnPolicy =
    "Our return policy allows for returns within 10 days of receiving your item. " +
    "To qualify for a return, the item must be unused and in the same condition as when you received it, " +
    "with tags attached and in its original packaging. A proof of purchase is also required.";

  yPos += 38;
  addMultiLineText(returnPolicy, 10, yPos, 170);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 255);
  doc.text("www.mixbunch.in", doc.internal.pageSize.getWidth() / 2, 280, {
    align: "center",
  });

  return doc;
};

const InvoicePDFGenerator = ({
  invoiceData,
  handleReviewInvoice,
  isTable,
}: InvoicePDFGeneratorProps) => {
  const handleGeneratePDF = () => {
    try {
      const doc = generateInvoicePDF({ invoiceData });
      doc.save(`invoice-${invoiceData?.invoiceNumber || "draft"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // ==========PDF MAINTAINANCE FUNCTION============
  // =======GENERATES==LIVE==PDF==VIEW==============

  // const [pdfBlob, setPdfBlob] = useState<Blob | null>(null); // State for storing the PDF blob

  // const handleGeneratePDFs = async () => {
  //   try {
  //     const doc = generateInvoicePDF({ invoiceData });
  //     const pdfBlob = new Blob([doc.output("blob")], {
  //       type: "application/pdf",
  //     });
  //     setPdfBlob(pdfBlob); // Update the PDF blob state
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  return (
    <>
      <Button
        color="secondary"
        className="text-gray-950"
        onClick={async () => {
          handleReviewInvoice(handleGeneratePDF);
        }}
      >
        Save and Download
      </Button>
      {isTable && (
        <Button
          variant={"solid"}
          className="bg-transparent"
          isIconOnly
          onClick={() => handleReviewInvoice(handleGeneratePDF)}
        >
          <CustomTooltip
            content="Download Invoice"
            trigger={<Receipt className="text-gray-300" />}
            className="text-gray-300"
          />
        </Button>
      )}
      {/* <button onClick={handleGeneratePDFs}>test</button>
      {pdfBlob && (
        <iframe
          title="Invoice Preview"
          src={URL.createObjectURL(pdfBlob)} // Create an object URL from the Blob
          width="100%"
          height="600"
        ></iframe>
      )} */}
    </>
  );
};

export default InvoicePDFGenerator;
