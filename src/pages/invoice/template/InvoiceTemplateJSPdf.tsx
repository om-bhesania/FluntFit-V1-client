import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Montserrat from "../../../assets/fonts/Montserrat";

export interface InvoiceItem {
  item: string;
  hsnSac?: string;
  quantity?: string | number;
  price?: string | number;
  productDiscount?: string | number;
  total: number;
  gst?: string | number;
  id?: string | number;
}

export interface InvoiceData {
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

export class InvoicePDFUtil {
  private static setupDocument(): jsPDF {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
    });

    doc.addFileToVFS("Montserrat-Thin", Montserrat);
    doc.addFont("Montserrat-Thin", "NotoSans", "normal");
    doc.setFont("montserrat");

    return doc;
  }

  private static addMultiLineText(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number
  ): number {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length;
  }

  private static drawLine(
    doc: jsPDF,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    doc.setDrawColor(200, 200, 200);
    doc.line(startX, startY, endX, endY);
  }

  public static generateInvoice(invoiceData: InvoiceData): jsPDF {
    const doc = this.setupDocument();
    let yPos = 10;

    // Add Logo and Company Name
    doc.addImage(
      "https://mixbunch.in/cdn/shop/files/logo4.png?v=1703583291&width=600",
      "PNG",
      10,
      yPos,
      12,
      12
    );

    doc.setFontSize(24);
    doc.text("Mix Bunch", 25, yPos + 6);
    doc.setFontSize(16);
    doc.text("Blend Of Fashion", 25, yPos + 12);

    // Company Address
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

    // Customer Details
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

    // GSTIN and Invoice Number
    yPos += 48;
    doc.setFontSize(12);
    doc.setTextColor(1);
    doc.text(`GSTIN:- 24IZRPK5753C1Z1`, 10, yPos);
    doc.text(`Customer Invoice ${invoiceData?.invoiceNumber}`, 200, yPos, {
      align: "right",
    });

    // Items Table
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

    let xPos = 4;
    doc.setFillColor(245, 245, 245);
    doc.setFontSize(12);
    doc.setTextColor(0);
    this.drawLine(doc, 10, yPos + 8, 200, yPos + 8);

    // Table Headers
    tableColumns.forEach((col) => {
      doc.text(col.header, xPos + col.width / 2, yPos + 5, { align: "center" });
      xPos += col.width;
    });

    // Table Items
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
          `${Number(item?.total).toFixed(2) || "0.0"}`,
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

    // Summary Section
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
        `- ${Number(invoiceData?.totalDiscount?.toString() || "0.0").toFixed(
          2
        )}`,
      ],
      [
        "Taxable Amount",
        `${(
          Number(invoiceData?.totalUntaxedAmount?.toString() || "0") -
            Number(invoiceData?.totalDiscount?.toString() || "0") || 0.0
        ).toFixed(2)}`,
      ],
      [
        "- SGST",
        `${Number(invoiceData?.sgst?.toString() || "0.0").toFixed(2)}`,
      ],
      [
        "- CGST",
        `${Number(invoiceData?.cgst?.toString() || "0.0").toFixed(2)}`,
      ],
      ["Total", `${invoiceData?.totalBillingAmount?.toString() || "0.0"}`],
    ];

    // Add Summary Data
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
        this.drawLine(doc, 140, yPos + 2, 200, yPos + 2);
      }
      yPos += 8;
    });

    // Footer Section
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
    this.addMultiLineText(doc, returnPolicy, 10, yPos, 170);

    // Website
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 255);
    doc.text("www.mixbunch.in", doc.internal.pageSize.getWidth() / 2, 280, {
      align: "center",
    });

    return doc;
  }

  public static downloadInvoice(invoiceData: InvoiceData): void {
    try {
      const doc = this.generateInvoice(invoiceData);
      doc.save(`invoice-${invoiceData?.invoiceNumber || "draft"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate invoice PDF");
    }
  }

  /**
   * Downloads and saves the generated invoice PDF to the user's
   * computer, and also saves the invoice data to the database.
   * @param {InvoiceData} invoiceData The invoice data to be saved
   * @param {function} saveInvoice The function to save the invoice data to the database
   * @returns {Promise<void>}
   * @throws {Error} If the PDF generation fails
   * @async
   * @static
   * @memberof InvoicePDFUtil
   * @example
   * ```typescript
   * try {
   *  await InvoicePDFUtil.downloadAndSaveInvoice(invoiceData, saveInvoice);
   * } catch (error) {
   * console.error("Failed to generate invoice PDF:", error);
   * }
   * ```
   */
  public static async downloadAndSaveInvoice(
    invoiceData: InvoiceData,
    handleReviewInvoice: any,
    saveInvoice: any
  ): Promise<void> {
    try {
      handleReviewInvoice(this.downloadInvoice(invoiceData));
      saveInvoice(invoiceData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate invoice PDF");
    }
  }
}
