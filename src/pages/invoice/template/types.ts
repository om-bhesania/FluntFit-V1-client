export interface InvoiceItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
}

export interface InvoiceProps {
  items: any;
  taxRate: number;
  discountRate: number;
  cashDiscountRate: number;
  customerData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    dob: Date;
  };
  className: string;
  calculateSubtotal: () => number;
  calculateDiscount: (subtotal: number) => number;
  calculateCGST: (subtotal: number, discount: number) => number;
  calculateSGST: (subtotal: number, discount: number) => number;
  calculateTotal: () => number;
  invoiceData: any;
}
