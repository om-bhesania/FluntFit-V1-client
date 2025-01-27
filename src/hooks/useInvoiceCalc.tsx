import { useState } from "react";

// Interfaces to define the structure of our data
export interface Product {
  _id: string;
  productName: string;
  price: number;
  salePrice?: number;
  gst: number | string;
  productDiscount?: number;
}

export interface InvoiceItem {
  id: string;
  item: string;
  quantity: number;
  hsnSac: string;
  price: number;
  total: number;
  unitPrice: number;
  gst: number;
  productDiscount: number;
}

export interface InvoiceCalculationParams {
  items: InvoiceItem[];
  gstPercentage: number;
  discountRate: number;
  flatDiscount: number;
}

export const useInvoiceCalculations = (
  products: Product[],
  initialParams: InvoiceCalculationParams
) => {
  const [calculationParams, setCalculationParams] =
    useState<InvoiceCalculationParams>(initialParams);

  // Calculate item total with product-level discount and GST
  const calculateItemTotal = (item: InvoiceItem): number => {
    // Ensure numeric values
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const gstRate = Number(item.gst) || 0;
    const productDiscountRate = Number(item.productDiscount) || 0;

    // Base price with GST added
    const priceWithGST = price * (1 + gstRate / 100);

    // Apply product-level discount
    const discountedPrice = priceWithGST * (1 - productDiscountRate / 100);

    // Calculate total with quantity
    return discountedPrice * quantity;
  };

  // Calculate detailed subtotal considering product-level discounts
  const calculateDetailedSubtotal = (items: InvoiceItem[]): number => {
    if (!items || items.length === 0) return 0;

    return items.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  // Comprehensive total calculation
  const calculateTotal = (): number => {
    const { items, gstPercentage, discountRate, flatDiscount } =
      calculationParams;

    // Calculate base subtotal with product-level details
    const subtotal = calculateDetailedSubtotal(items);

    // Apply bill-level percentage discount
    const percentageDiscount = subtotal * (discountRate / 100);

    // Apply bill-level flat discount
    const totalDiscount = percentageDiscount + (flatDiscount || 0);

    // Calculate subtotal after discounts
    const subtotalAfterDiscount = subtotal - totalDiscount;

    // Calculate bill-level GST (if applicable)
    const billLevelGST = subtotalAfterDiscount * (gstPercentage / 100);

    // Final total calculation
    return subtotalAfterDiscount + billLevelGST;
  };

  // Calculate CGST (Central GST)
  const calculateCGST = (): number => {
    const { items, gstPercentage, discountRate, flatDiscount } =
      calculationParams;
    const subtotal = calculateDetailedSubtotal(items);
    const percentageDiscount = subtotal * (discountRate / 100);
    const totalDiscount = percentageDiscount + (flatDiscount || 0);
    const subtotalAfterDiscount = subtotal - totalDiscount;

    // CGST is half of the bill-level GST
    return subtotalAfterDiscount * (gstPercentage / 200);
  };

  // Calculate SGST (State GST)
  const calculateSGST = (): number => {
    // Same calculation as CGST for state-level GST
    return calculateCGST();
  };

  // Get invoice breakdown details
  const getInvoiceBreakdown = () => {
    const { items, gstPercentage, discountRate, flatDiscount } =
      calculationParams;
    const subtotal = calculateDetailedSubtotal(items);
    const percentageDiscount = subtotal * (discountRate / 100);
    const totalDiscount = percentageDiscount + (flatDiscount || 0);
    const subtotalAfterDiscount = subtotal - totalDiscount;
    const billLevelGST = subtotalAfterDiscount * (gstPercentage / 100);

    return {
      subtotal,
      percentageDiscount,
      flatDiscount,
      totalDiscount,
      subtotalAfterDiscount,
      billLevelGST,
      finalTotal: subtotalAfterDiscount + billLevelGST,
    };
  };

  // Handle product selection and update item details
  const handleProductSelect = (
    items: InvoiceItem[],
    itemId: string,
    selectedProductId: string
  ): InvoiceItem[] => {
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );

    if (!selectedProduct) {
      console.error("Selected product not found!");
      return items;
    }

    // Calculate price
    const price = selectedProduct.salePrice
      ? selectedProduct.salePrice
      : selectedProduct.price || 0;

    // Update the item in the items array
    return items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            item: selectedProduct.productName || "",
            price: price,
            productDiscount: selectedProduct.productDiscount || 0,
            total: calculateItemTotal({
              ...item,
              price: price,
              productDiscount: selectedProduct.productDiscount || 0,
              gst: parseFloat(String(selectedProduct.gst)) || 0,
              quantity: item.quantity,
            }),
            unitPrice: selectedProduct.price || 0,
            gst: parseFloat(String(selectedProduct.gst)) || 0,
          }
        : item
    );
  };

  // Expose methods and calculations
  return {
    calculateItemTotal,
    calculateDetailedSubtotal,
    calculateTotal,
    calculateCGST,
    calculateSGST,
    getInvoiceBreakdown,
    handleProductSelect,
    calculationParams,
    setCalculationParams,
  };
};
