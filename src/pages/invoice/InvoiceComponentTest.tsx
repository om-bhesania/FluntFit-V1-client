"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Badge from "../../components/badge/Badge";
import CustomerDetailsModal from "./customerDetails/CustomerDetailsModal";
import { getGSTColor } from "../../utils/utils";

export interface InvoiceItem {
  id: string;
  item: string;
  quantity: number;
  hsnSac: string;
  price: number;
  total: number;
  unitPrice: number;
  gst: number;
  productDiscount: number; // New field for product-level discount
}

export interface InvoiceForm {
  currentDate: string;
  invoiceNumber: string;
  cashier: string;
  customer: string;
  items: InvoiceItem[];
  gstPercentage: number;
  discountRate: number;
  flatDiscount: number;
}

export const invoiceSchema = Yup.object().shape({
  gstPercentage: Yup.number().min(0).max(100),
  discountRate: Yup.number().min(0).max(100),
  flatDiscount: Yup.number().min(0),
});

const initialValuess: InvoiceForm = {
  currentDate: new Date().toISOString().split("T")[0],
  invoiceNumber: "INV/2025/00061",
  cashier: "Administrator",
  customer: "",
  items: [],
  gstPercentage: 5,
  discountRate: 0,
  flatDiscount: 0,
};

export default function InvoiceComponentTest({
  filteredCustomers,
  setNewCustomerData,
  customers,
  isOpen,
  onClose,
  onSubmit,
  handleOpenModal,
  handleCustomerSearch,
  searchValue,
  initialValues,
  calculateDiscount,
  calculateSubtotal,
  cashDiscountRate,
  // calculateTotal,
  // calculateCGST,
  // calculateSGST,
  discountRate,
  productsData,
}: any) {
  const formik = useFormik({
    initialValues,
    validationSchema: invoiceSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const [selectedCustomer, setSelectedCustomer] = useState<any>([]);

  // Calculate item total with product-level discount and GST
  const calculateItemTotal = (item: InvoiceItem) => {
    // Base price with GST added
    const priceWithGST = item.price * (1 + item.gst / 100);

    // Apply product-level discount
    const discountedPrice =
      priceWithGST * (1 - (item.productDiscount || 0) / 100);

    // Calculate total with quantity
    const total = discountedPrice * item.quantity;

    return total;
  };

  const addItem = () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 11),
      item: "",
      quantity: 1,
      hsnSac: "",
      price: 0,
      total: 0,
      unitPrice: 0,
      gst: 0,
      productDiscount: 0, // Initialize product discount
      customer: [],
    };

    // Ensure items is an array before spreading
    const currentItems = Array.isArray(formik.values.items)
      ? formik.values.items
      : [];

    formik.setFieldValue("items", [...currentItems, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = [...formik.values.items];
    newItems.splice(index, 1);
    formik.setFieldValue("items", newItems);
  };

  const handleProductSelect = (itemId: string, selectedProductId: string) => {
    const selectedProduct = productsData.find(
      (product: any) => product._id === selectedProductId
    );

    if (!selectedProduct) {
      console.error("Selected product not found!");
      return;
    }

    // Calculate price and total
    const price = selectedProduct?.salePrice
      ? selectedProduct.salePrice
      : selectedProduct.price || 0;

    // Update the item in the `items` array
    const updatedItems = formik.values.items.map((item: any) =>
      item.id === itemId
        ? {
            ...item,
            item: selectedProduct?.productName || "",
            price: price,
            productDiscount: selectedProduct?.productDiscount || 0,
            total: calculateItemTotal({
              ...item,
              price: price,
              productDiscount: selectedProduct?.productDiscount || 0,
              gst: parseFloat(selectedProduct?.gst) || 0,
              quantity: item.quantity,
            }),
            unitPrice: selectedProduct.price || 0,
            gst: parseFloat(selectedProduct?.gst) || 0,
          }
        : item
    );

    formik.setFieldValue("items", updatedItems);
  };

  useEffect(() => {
    if (selectedCustomer) {
      formik.setFieldValue("customer", selectedCustomer._id);
    }
  }, [selectedCustomer]);

  // Calculate total subtotal considering product-level discounts
  const calculateDetailedSubtotal = () => {
    // Ensure items exist and is an array
    if (!formik.values.items || formik.values.items.length === 0) {
      return 0;
    }

    // Calculate subtotal with detailed item calculations
    return formik.values.items.reduce((total: any, item: any) => {
      return total + calculateItemTotal(item);
    }, 0);
  };
  // Comprehensive total calculation
  const calculateTotal = () => {
    // Calculate base subtotal with product-level details
    const subtotal = calculateDetailedSubtotal();

    // Apply bill-level percentage discount
    const percentageDiscount = subtotal * (formik.values.discountRate / 100);

    // Apply bill-level flat discount
    const flatDiscount = formik.values.flatDiscount || 0;

    // Total discount
    const totalDiscount = percentageDiscount + flatDiscount;

    // Calculate subtotal after discounts
    const subtotalAfterDiscount = subtotal - totalDiscount;

    // Calculate bill-level GST (if applicable)
    const billLevelGST =
      subtotalAfterDiscount * (formik.values.gstPercentage / 100);

    // Final total calculation
    const finalTotal = subtotalAfterDiscount + billLevelGST;

    return finalTotal;
  };
  const calculateCGST = () => {
    const subtotal = calculateDetailedSubtotal();
    const percentageDiscount = subtotal * (formik.values.discountRate / 100);
    const flatDiscount = formik.values.flatDiscount || 0;
    const totalDiscount = percentageDiscount + flatDiscount;
    const subtotalAfterDiscount = subtotal - totalDiscount;

    // CGST is half of the bill-level GST
    return subtotalAfterDiscount * (formik.values.gstPercentage / 200);
  };

  const calculateSGST = () => {
    // Same calculation as CGST for state-level GST
    return calculateCGST();
  };

  // Detailed breakdown for invoice summary
  const getInvoiceBreakdown = () => {
    const subtotal = calculateDetailedSubtotal();
    const percentageDiscount = subtotal * (formik.values.discountRate / 100);
    const flatDiscount = formik.values.flatDiscount || 0;
    const totalDiscount = percentageDiscount + flatDiscount;
    const subtotalAfterDiscount = subtotal - totalDiscount;
    const billLevelGST =
      subtotalAfterDiscount * (formik.values.gstPercentage / 100);

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

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-7xl mx-auto p-6 space-y-6"
      >
        {/* Existing form fields remain the same */}

        <Table aria-label="Invoice items">
          <TableHeader>
            <TableColumn>ITEM</TableColumn>
            <TableColumn>QTY</TableColumn>
            <TableColumn>HSN/SAC</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>PRODUCT DISCOUNT %</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>UNIT PRICE</TableColumn>
            <TableColumn>GST</TableColumn>
            <TableColumn>ACTION</TableColumn>
          </TableHeader>
          <TableBody>
            {formik.values.items?.length > 0 &&
              formik.values.items.map((item: any, index: any) => (
                <TableRow key={item.id}>
                  {/* Product Selection */}
                  <TableCell>
                    <Select
                      placeholder="Select item"
                      value={item.item}
                      onChange={(e) =>
                        handleProductSelect(item.id, e.target.value)
                      }
                    >
                      {productsData.map((product: any) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.productName}
                        </SelectItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        const updatedItems = formik.values.items.map(
                          (itm: any) =>
                            itm.id === item.id
                              ? {
                                  ...itm,
                                  quantity: newQuantity,
                                  total: calculateItemTotal({
                                    ...itm,
                                    quantity: newQuantity,
                                  }),
                                }
                              : itm
                        );
                        formik.setFieldValue("items", updatedItems);
                      }}
                    />
                  </TableCell>

                  {/* HSN/SAC */}
                  <TableCell>
                    <Input
                      value={item.hsnSac}
                      onChange={(e) =>
                        formik.setFieldValue(
                          `items.${index}.hsnSac`,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <Input
                      type="number"
                      value={
                        item.salePrice
                          ? item.salePrice.toString()
                          : item.price.toString()
                      }
                      onChange={(e) =>
                        formik.setFieldValue(
                          `items.${index}.price`,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>

                  {/* Product Discount */}
                  <TableCell>
                    <Input
                      type="number"
                      value={item.productDiscount?.toString() || "0"}
                      onChange={(e) => {
                        const newProductDiscount = Number(e.target.value);
                        const updatedItems = formik.values.items.map(
                          (itm: any) =>
                            itm.id === item.id
                              ? {
                                  ...itm,
                                  productDiscount: newProductDiscount,
                                  total: calculateItemTotal({
                                    ...itm,
                                    productDiscount: newProductDiscount,
                                  }),
                                }
                              : itm
                        );
                        formik.setFieldValue("items", updatedItems);
                      }}
                      min="0"
                      max="100"
                    />
                  </TableCell>

                  {/* Unit Price */}
                  <TableCell>{item.unitPrice.toFixed(2)}</TableCell>

                  {/* GST */}
                  <TableCell>
                    <Badge
                      content={`${item.gst}%`}
                      color={getGSTColor(item.gst)}
                    />
                  </TableCell>

                  {/* Total */}
                  <TableCell>₹{item.total.toFixed(2)}</TableCell>

                  {/* Action */}
                  <TableCell>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Add Item Button */}
        <Button
          color="default"
          variant="flat"
          onClick={addItem}
          className="mt-4 text-primary"
          startContent={<Plus className="h-4 w-4" />}
        >
          Add Item
        </Button>

        {/* Existing discount inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <Input
            type="number"
            variant="bordered"
            label="GST %"
            name="gstPercentage"
            value={formik.values.gstPercentage}
            onChange={formik.handleChange}
          />
          <Input
            type="number"
            variant="bordered"
            label="Discount rate %"
            name="discountRate"
            value={formik.values.discountRate}
            onChange={formik.handleChange}
          />
          <Input
            type="number"
            variant="bordered"
            label="Flat Discount"
            name="flatDiscount"
            value={formik.values.flatDiscount}
            onChange={formik.handleChange}
          />
        </div>

        {/* Totals Section */}
        <div className="mt-8 space-y-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">Untaxed Amount:</span>
            <span>
              ₹
              {formik.values.items &&
                formik.values.items
                  .reduce(
                    (sum: any, item: any) =>
                      sum +
                      item.price *
                        item.quantity *
                        (1 - item.productDiscount / 100),
                    0
                  )
                  .toFixed(2)}
            </span>
          </div>

          <div className="ml-4">
            <div className="flex justify-between">
              <span className="text-sm">- CGST:</span>
              <span>₹{calculateCGST().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">- SGST:</span>
              <span>₹{calculateSGST().toFixed(2)}</span>
            </div>
          </div>

          {discountRate > 0 && (
            <div className="flex justify-between">
              <Badge
                content={
                  <span className="inline-flex items-center">
                    <span className="mr-1">Discount</span>
                    <span className="font-bold">({discountRate}%)</span>
                  </span>
                }
              />
              <span>
                ₹{calculateDiscount(calculateDetailedSubtotal()).toFixed(2)}
              </span>
            </div>
          )}

          {cashDiscountRate > 0 && (
            <div className="flex justify-between">
              <Badge
                color="teal"
                content={
                  <span className="inline-flex items-center">
                    Flat Discount
                  </span>
                }
              />
              <span>₹{cashDiscountRate.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-end">
          <Button color="primary" type="submit">
            Review Invoice
          </Button>
        </div>
      </form>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        initialValues={initialValues}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  );
}
