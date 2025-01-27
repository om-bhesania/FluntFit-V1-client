export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

import ReactDOM from "react-dom";
import React from "react";

export const printComponent = (
  Component: any,
  props: any,
  invoiceNumber: string
) => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    console.error("Failed to open print window.");
    return;
  }

  // Write basic HTML and styles for Tailwind with additional print styles
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .max-md\\:hidden {
            display: none;
          }
          .visible {
            display: block !important;
          }
        }
        /* Hide browser-generated elements */
        @page {
          size: auto;
          margin: 0mm;
        }
        /* Remove header and footer */
        @media print {
          html, body {
            height: 100%;
            overflow: hidden;
          }
          /* Hide all headers and footers */
          head, header, footer {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div id="print-root" style="padding: 20px;"></div>
    </body>
    </html>
  `);

  // Create the print root element
  const printRoot = printWindow.document.getElementById("print-root");

  if (printRoot) {
    // Render the React component into the new window
    ReactDOM.render(React.createElement(Component, props), printRoot);
  }

  // Wait for images and content to load before printing
  printWindow.document.close();

  // Enhanced onload handler with image loading check
  printWindow.onload = () => {
    // Wait for all images to load
    const images = printWindow.document.getElementsByTagName("img");
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        }
      });
    });

    // When all images are loaded, trigger print
    Promise.all(imagePromises).then(() => {
      // Small timeout to ensure styles are applied
      setTimeout(() => {
        printWindow.print();
        // Only close after print dialog is closed
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    });
  };

  // Set the filename for the print job
  printWindow.document.title = `Invoice_${invoiceNumber}`;

  // Set the filename for the print job (this may not work in all browsers)
  const printJobName = `Invoice_${invoiceNumber}`;
  printWindow.document.execCommand('print', false, printJobName);
};
