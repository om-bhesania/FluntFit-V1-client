import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import InvoiceTemplate from "./InvoiceTemplate";

const InvoicePdfData = ({ invoiceData, className }: any) => {
  const taxableAmount = (
    Number.parseFloat(invoiceData?.totalUntaxedAmount) -
      Number.parseFloat(invoiceData?.totalDiscount) || 0.0
  ).toFixed(2);

  // Styles for the PDF document
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: "Helvetica",
    },
    flexRow: {
      flexDirection: "row",
    },
    flexCol: {
      flexDirection: "column",
    },
    justifyBetween: {
      justifyContent: "space-between",
    },
    alignCenter: {
      alignItems: "center",
    },
    textCenter: {
      textAlign: "center",
    },
    textRight: {
      textAlign: "right",
    },
    mb2: {
      marginBottom: 8,
    },
    mb4: {
      marginBottom: 16,
    },
    mb8: {
      marginBottom: 32,
    },
    mt2: {
      marginTop: 8,
    },
    mt8: {
      marginTop: 32,
    },
    fontBold: {
      fontWeight: "bold",
    },
    text2xl: {
      fontSize: 24,
    },
    textXl: {
      fontSize: 20,
    },
    textBase: {
      fontSize: 12,
    },
    textSm: {
      fontSize: 10,
    },
    textGray: {
      color: "#4B5563",
    },
    borderB: {
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
    },
    tableHeader: {
      backgroundColor: "#F3F4F6",
    },
    tableCell: {
      padding: 8,
      fontSize: 10,
    },
    logo: {
      width: 48,
      height: 48,
      marginRight: 16,
    },
  });

  const PDFInvoice = ({ invoiceData }:any) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.flexRow, styles.justifyBetween, styles.mb8]}>
          <View style={styles.flexRow}>
            <Image
              src="//mixbunch.in/cdn/shop/files/logo4.png?v=1703583291&width=600"
              style={styles.logo}
            />
            <View style={styles.flexCol}>
              <Text style={[styles.text2xl, styles.fontBold]}>Mix Bunch</Text>
              <Text style={styles.textXl}>Blend of Fashion</Text>
              <Text style={[styles.textSm, styles.textGray]}>
                Shop No-10, Fortune Air,
              </Text>
              <Text style={[styles.textSm, styles.textGray]}>
                Krunal Char Rasta, Gotri,
              </Text>
              <Text style={[styles.textSm, styles.textGray]}>
                Vadodara-390021
              </Text>
              <Text style={[styles.textSm, styles.textGray]}>
                Ph:- 7043745089
              </Text>
              <Text
                style={[
                  styles.textSm,
                  styles.fontBold,
                  styles.textGray,
                  styles.mt2,
                ]}
              >
                GSTIN:- 24IZRPK5753C1Z1
              </Text>
            </View>
          </View>
          <View style={[styles.flexCol, styles.textRight]}>
            <Text style={styles.textSm}>
              {invoiceData?.name || "Customer Name"}
            </Text>
            <Text style={styles.textSm}>
              {invoiceData?.phone || "Customer Phone"}
            </Text>
            <Text style={styles.textSm}>{invoiceData?.city || "City"}</Text>
            <Text style={styles.textSm}>{invoiceData?.state || "State"}</Text>
            <Text style={styles.textSm}>
              Place of supply: {invoiceData?.state || "State"}
            </Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.mb4}>
          <Text style={styles.textXl}>
            Customer Invoice {invoiceData?.invoiceNumber}
          </Text>
        </View>

        {/* Invoice Table */}
        <View style={[styles.flexCol, styles.mb8]}>
          <View style={[styles.flexRow, styles.tableHeader, styles.borderB]}>
            <Text style={[styles.tableCell, styles.fontBold]}>Name</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>HSN/SAC</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>Price</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>Discount %</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>Total Price</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>Taxes</Text>
            <Text style={[styles.tableCell, styles.fontBold]}>Amount</Text>
          </View>
          {invoiceData?.items?.map(
            (product: any, index: number) =>
              product.item &&
              product.item !== "" && (
                <View
                  key={`${product.id}-${index}`}
                  style={[styles.flexRow, styles.borderB]}
                >
                  <Text style={styles.tableCell}>{product.item}</Text>
                  <Text style={styles.tableCell}>{product.hsnSac || ""}</Text>
                  <Text style={styles.tableCell}>
                    {product.quantity || 0.0}
                  </Text>
                  <Text style={styles.tableCell}>₹{product?.price || 0.0}</Text>
                  <Text style={styles.tableCell}>
                    {product?.productDiscount || 0.0}
                  </Text>
                  <Text style={styles.tableCell}>
                    ₹{Number.parseInt(product?.total).toFixed(2) || 0.0}
                  </Text>
                  <Text style={styles.tableCell}>{product?.gst || 0.0}%</Text>
                  <Text style={styles.tableCell}>
                    ₹{product?.total.toFixed(2) || 0.0}
                  </Text>
                </View>
              )
          )}
        </View>

        {/* Summary */}
        <View style={[styles.flexCol, styles.alignCenter]}>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.borderB,
              styles.mb2,
            ]}
          >
            <Text style={styles.textBase}>Untaxed Amount</Text>
            <Text style={styles.textBase}>
              ₹{" "}
              {Number.parseFloat(
                invoiceData?.totalUntaxedAmount || 0.0
              ).toFixed(2)}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.borderB,
              styles.mb2,
            ]}
          >
            <Text style={styles.textBase}>Discount</Text>
            <Text style={styles.textBase}>
              - ₹{" "}
              {Number.parseInt(invoiceData?.totalDiscount || 0.0).toFixed(2)}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.borderB,
              styles.mb2,
            ]}
          >
            <Text style={styles.textBase}>Taxable Amount</Text>
            <Text style={styles.textBase}>₹ {taxableAmount}</Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.borderB,
              styles.mb2,
            ]}
          >
            <Text style={styles.textSm}>- SGST</Text>
            <Text style={styles.textBase}>
              ₹ {Number.parseInt(invoiceData?.sgst || 0.0).toFixed(2)}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.borderB,
              styles.mb2,
            ]}
          >
            <Text style={styles.textSm}>- CGST</Text>
            <Text style={styles.textBase}>
              ₹ {Number.parseInt(invoiceData?.cgst || 0.0).toFixed(2)}
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.justifyBetween,
              styles.borderB,
              styles.mb2,
              styles.fontBold,
            ]}
          >
            <Text style={styles.textBase}>Total</Text>
            <Text style={styles.textBase}>
              ₹ {invoiceData?.totalBillingAmount || 0.0}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.mt8, styles.textCenter]}>
          <Text style={styles.textSm}>www.mixbunch.in</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="max-md:container">
      <div
        className={`${className} md:max-w-5xl max-w-full md:mx-auto md:p-8 p-6 bg-white`}
      >
        {/* PDF Download Button */}
        <PDFDownloadLink
          document={<PDFInvoice invoiceData={invoiceData} />}
          fileName={`Invoice-${invoiceData?.invoiceNumber}.pdf`}
          className="mb-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Download Invoice as PDF
        </PDFDownloadLink>

        {/* Original Invoice Content (HTML) */}
        <InvoiceTemplate invoiceData={invoiceData} />
      </div>
    </div>
  );
};

export default InvoicePdfData;
