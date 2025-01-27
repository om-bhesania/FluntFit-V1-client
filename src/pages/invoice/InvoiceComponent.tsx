import { getLocalTimeZone, parseDate } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
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
import {
  generateInvoiceNumber,
  getGSTColor,
  getInitialInvoiceNumber,
} from "../../utils/utils";
import CustomerDetailsModal from "./customerDetails/CustomerDetailsModal";
import InvoiceTemplate from "./template/InvoiceTemplate";
import { printComponent } from "./template/utils";

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
  customer: {
    city: null;
    dob: null;
    _id: "";
    name: "";
    phone: "";
    email: "";
    address: "";
    createdAt: "";
    updatedAt: "";
  };
  items: InvoiceItem[];
  gstPercentage: number;
  discountRate: number;
  flatDiscount: number;
  subtotalAfterDiscount: number;
}

export const invoiceSchema = Yup.object().shape({
  gstPercentage: Yup.number().min(0).max(100),
  discountRate: Yup.number().min(0).max(100),
  flatDiscount: Yup.number().min(0),
});

export default function InvoiceComponent({
  filteredCustomers,
  setNewCustomerData,
  customers,
  isOpen,
  onClose,
  handleOpenModal,
  handleCustomerSearch,
  searchValue,
  initialValues,
  productsData,
  handleSubmit,
}: any) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>({});
  const [invoiceData, setInvoiceData] = useState<any>({});
  const [invoiceNumber, setInvoiceNumber] = useState(getInitialInvoiceNumber());
  const currentDate = new Date().toISOString().split("T")[0];
  useEffect(() => {
    if (selectedCustomer && Object.keys(selectedCustomer).length > 0) {
      formik.setValues({
        ...formik.values,
        name: selectedCustomer.name || "",
        phone: selectedCustomer.phone || "",
        address: selectedCustomer.address || "",
        email: selectedCustomer.email || "",
        state: selectedCustomer.state || "",
        city: selectedCustomer.city || "",
        dob: selectedCustomer.dob || null,
      });
    }
  }, [selectedCustomer]);

  const handleCustomerSelect = (key: any) => {
    if (key === "new") {
      handleOpenModal();
    } else {
      const selectedCustomer = customers.find(
        (customer: any) => customer._id === key
      );

      if (selectedCustomer) {
        setNewCustomerData(selectedCustomer);
        setSelectedCustomer(selectedCustomer);
      } else {
        const matchingCustomer = customers.find(
          (customer: any) => customer.phone === searchValue
        );

        if (matchingCustomer) {
          setNewCustomerData(matchingCustomer);
          setSelectedCustomer(matchingCustomer);
        }
      }
    }
  };
  // formik values
  const formik = useFormik({
    initialValues: {
      currentDate: new Date().toISOString().split("T")[0],
      invoiceNumber: invoiceNumber,
      cashier: "Pratik",
      items: [
        {
          id: Date.now().toString(),
          item: "",
          quantity: 1,
          hsnSac: "",
          price: 0,
          total: 0,
          unitPrice: 0,
          gst: 0,
          productDiscount: 0,
        },
      ],
      gstPercentage: 0,
      discountRate: 0,
      flatDiscount: 0,
      name: selectedCustomer.name || "",
      phone: selectedCustomer.phone || "",
      address: selectedCustomer.address || "",
      email: selectedCustomer.email || "",
      state: selectedCustomer.state || "",
      city: selectedCustomer.city || "",
      dob: selectedCustomer.dob || "",
      subtotal: 0,
      totalDiscount: 0,
      subtotalAfterDiscount: 0,
      totalBillingAmount: 0,
      sgst: 0,
      cgst: 0,
      totalUntaxedAmount: 0,
    },
    validationSchema: invoiceSchema,
    onSubmit: async () => {
      //   // Get the latest calculations
      //   const {
      //     subtotal,
      //     flatDiscountData,
      //     totalDiscount,
      //     subtotalAfterDiscount,
      //     sgst,
      //     cgst,
      //     totalBillingAmount,
      //     totalUntaxedAmount,
      //   } = getInvoiceBreakdown();
      //   // Create a new object with all the values
      //   const updatedValues = {
      //     ...values,
      //     subtotal,
      //     flatDiscount: flatDiscountData,
      //     totalDiscount,
      //     subtotalAfterDiscount,
      //     totalBillingAmount,
      //     sgst,
      //     cgst,
      //     totalUntaxedAmount,
      //   };
      //   // Update the form values and invoice data in one go
      //   await Promise.all([
      //     formik.setValues(updatedValues, false),
      //     setInvoiceData(updatedValues),
      //   ]);
      // },
    },
  });
  useEffect(() => {
    const {
      subtotal,
      flatDiscountData,
      totalDiscount,
      subtotalAfterDiscount,
      sgst,
      cgst,
      totalBillingAmount,
      totalUntaxedAmount,
      gstPercentage,
      gstAmount,
    } = getInvoiceBreakdown();

    const updatedValues = {
      ...formik.values,
      subtotal,
      flatDiscount: flatDiscountData,
      totalDiscount,
      subtotalAfterDiscount,
      totalBillingAmount,
      sgst,
      cgst,
      totalUntaxedAmount,
      gstPercentage,
      gstAmount,
    };

    setInvoiceData(updatedValues);
  }, [formik.values]);
  const calculateProductTotal = (item: InvoiceItem) => {
    // Apply product-level discount
    let discountedPrice = item.price * (1 - (item.productDiscount || 0) / 100);

    // Add GST after discount (GST applied here)
    const priceWithGST = discountedPrice * (1 + item.gst / 100);

    // Total considering quantity
    return priceWithGST * item.quantity;
  };

  const calculateSubtotal = () => {
    return (
      formik.values.items?.reduce((total: number, item: InvoiceItem) => {
        return total + calculateProductTotal(item);
      }, 0) || 0
    );
  };

  const calculateSGST = () => {
    // Calculate SGST based on already applied GST (calculated with product-level totals)
    const totalGST = formik.values.items?.reduce(
      (total: number, item: InvoiceItem) => {
        const discountedPrice =
          item.price * (1 - (item.productDiscount || 0) / 100);

        // Only take GST from the discounted price
        const gstOnDiscountedPrice = discountedPrice * (item.gst / 100);

        return total + gstOnDiscountedPrice * item.quantity;
      },
      0
    );

    // SGST is half of the total GST
    return ((totalGST || 0) / 2).toFixed(2);
  };

  const calculateCGST = () => {
    // Calculate CGST based on already applied GST (calculated with product-level totals)
    const totalGST = formik.values.items?.reduce(
      (total: number, item: InvoiceItem) => {
        const discountedPrice =
          item.price * (1 - (item.productDiscount || 0) / 100);

        // Only take GST from the discounted price
        const gstOnDiscountedPrice = discountedPrice * (item.gst / 100);

        return total + gstOnDiscountedPrice * item.quantity;
      },
      0
    );

    // CGST is half of the total GST
    return ((totalGST || 0) / 2).toFixed(2);
  };

  const getInvoiceBreakdown = () => {
    const subtotal = calculateSubtotal();

    // Apply bill-level discount and GST (flatDiscount and discountRate are bill-level)
    const flatDiscount = formik.values.flatDiscount || 0;
    const discountRate = formik.values.discountRate || 0;

    // Apply discount rate and flat discount to the subtotal
    const subtotalAfterDiscount =
      subtotal * (1 - discountRate / 100) - flatDiscount;

    // Calculate SGST and CGST (calculated based on total GST from items)
    const sgst = parseFloat(calculateSGST());
    const cgst = parseFloat(calculateCGST());

    // Calculate the total billing amount

    const gstPercentage = formik.getFieldProps("gstPercentage").value || 0;
    const gstAmount: any = (subtotalAfterDiscount * gstPercentage) / 100;

    const totalBillingAmount = subtotalAfterDiscount + gstAmount;
    // Calculate untaxed amount (Base price without any GST)
    const totalUntaxedAmount = formik.values.items
      ? formik.values.items
          .reduce(
            (sum: any, item: any) => sum + item.price * item.quantity,
            0.0
          )
          .toFixed(2)
      : 0.0;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      flatDiscountData: flatDiscount,
      percentageDiscount: parseFloat(
        (subtotal * (discountRate / 100)).toFixed(2)
      ),
      totalDiscount: parseFloat(
        (flatDiscount + subtotal * (discountRate / 100)).toFixed(2)
      ),
      subtotalAfterDiscount: parseFloat(subtotalAfterDiscount.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      totalBillingAmount: parseFloat(totalBillingAmount.toFixed(2)),
      totalUntaxedAmount: parseFloat(totalUntaxedAmount),
      gstPercentage: parseInt(gstPercentage).toFixed(2),
      gstAmount: gstAmount,
    };
  };

  const {
    flatDiscountData,
    totalDiscount,
    percentageDiscount,
    sgst,
    cgst,
    totalBillingAmount,
    totalUntaxedAmount,
    gstPercentage,
    gstAmount,
  } = getInvoiceBreakdown();
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
            total: calculateProductTotal({
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
      formik.setFieldValue("customers", selectedCustomer.id);
    }
  }, [selectedCustomer]);

  const handleReviewInvoice = () => {
    const newInvoiceNumber = generateInvoiceNumber();
    setInvoiceNumber(newInvoiceNumber);
    formik.setFieldValue("invoiceNumber", newInvoiceNumber);
    localStorage.setItem("lastInvoiceNumber", newInvoiceNumber);
  };

  useEffect(() => {
    const savedInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    if (!savedInvoiceNumber) {
      handleReviewInvoice();
    }
  }, []);

  const saveAndDownload = () => {
    printComponent(InvoiceTemplate, {
      invoiceData,
      className: "max-md:hidden visible",
    },invoiceNumber);
  };

  return (
    <>
      <div className="flex max-md:flex-wrap">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-7xl mx-auto p-6 space-y-6"
        >
          {/* Existing form fields remain the same */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <DatePicker
                variant="bordered"
                label="Invoice Date"
                color="default"
                className="w-full"
                maxValue={parseDate(currentDate)}
                defaultValue={parseDate(currentDate)}
                showMonthAndYearPickers={true}
                shouldForceLeadingZeros
                onChange={(newValue) => {
                  const formattedDate = newValue
                    .toDate(getLocalTimeZone())
                    .toLocaleDateString();
                  formik.setFieldValue("currentDate", formattedDate);
                }}
              />
            </div>

            <div>
              <Input
                variant="bordered"
                label="Invoice Number"
                defaultValue={invoiceNumber}
                value={formik.values.invoiceNumber}
                onChange={(e) => {
                  setInvoiceNumber(e.target.value);
                  localStorage.setItem("lastInvoiceNumber", e.target.value);
                  formik.setFieldValue("invoiceNumber", e.target.value);
                }}
                className="w-full"
              />
            </div>

            <div>
              <Input
                label="Cashier"
                defaultValue="Pratik"
                variant="bordered"
                value={formik.values.cashier}
                onChange={(e) =>
                  formik.setFieldValue("cashier", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Autocomplete
                label="Customer:"
                items={
                  Array.isArray(filteredCustomers) ? filteredCustomers : []
                }
                onInput={(e) =>
                  handleCustomerSearch((e.target as HTMLInputElement).value)
                }
                onSelectionChange={handleCustomerSelect}
                className="max-w-[400px]"
                placeholder="Search by name or phone number"
                variant="bordered"
                color="default"
                allowsCustomValue
              >
                {/* TODO: on clear data not reflecting in UI it stays as prev selected Data */}
                {(item: any) => (
                  <AutocompleteItem
                    key={item._id}
                    textValue={
                      item.name === "Create New Customer" ? "" : item.name
                    }
                    className="capitalize"
                  >
                    {item._id === "new" ? (
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Plus className="!h-4 !w-4 text-primary" />
                        {item.name}
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <small className="text-gray-500">{item.phone}</small>
                      </div>
                    )}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>
          <Table
            aria-label="Invoice items"
            classNames={{
              table: "w-full",
              th: "text-center",
              tr: "text-center ",
              td: "text-ceenter",
            }}
          >
            <TableHeader>
              <TableColumn>ITEM</TableColumn>
              <TableColumn>QTY</TableColumn>
              <TableColumn>HSN/SAC</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>DISCOUNT %</TableColumn>
              <TableColumn>UNIT PRICE</TableColumn>
              <TableColumn>GST</TableColumn>
              <TableColumn>TOTAL</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody>
              {formik.values.items.map((item: any, index: any) => (
                <TableRow key={item.id}>
                  {/* Product Selection */}
                  <TableCell className="w-1/4">
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
                                  total: calculateProductTotal({
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
                      value={item.price.toString()}
                      onChange={(e) => {
                        const newPrice = Number(e.target.value);
                        const updatedItems = formik.values.items.map(
                          (itm: any) =>
                            itm.id === item.id
                              ? {
                                  ...itm,
                                  price: newPrice,
                                  total: calculateProductTotal({
                                    ...itm,
                                    price: newPrice,
                                  }),
                                }
                              : itm
                        );
                        formik.setFieldValue("items", updatedItems);
                      }}
                    />
                  </TableCell>

                  {/* Product Discount */}
                  <TableCell className="min-w-[50px]">
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
                                  total: calculateProductTotal({
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
                  <TableCell className="min-w-[50px]">
                    ₹{item.total.toFixed(2)}
                  </TableCell>

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
              value={formik.values.gstPercentage.toString()}
              onChange={formik.handleChange}
            />
            <Input
              type="number"
              variant="bordered"
              label="Discount rate %"
              name="discountRate"
              value={formik.values.discountRate.toString()}
              onChange={formik.handleChange}
            />
            <Input
              type="number"
              variant="bordered"
              label="Flat Discount"
              name="flatDiscount"
              value={formik.values.flatDiscount.toString()}
              onChange={formik.handleChange}
            />
          </div>

          {/* Totals Section */}
          <div className="mt-8 space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Untaxed Amount:</span>
              <span>₹{totalUntaxedAmount}</span>
            </div>

            <div className="ml-4">
              <div className="flex justify-between">
                <span className="text-sm">- CGST:</span>
                <span>₹{sgst || 0.0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">- SGST:</span>
                <span>₹{cgst || 0.0}</span>
              </div>
            </div>
            {parseInt(gstPercentage) > 0 && (
              <div className="flex justify-between">
                <Badge
                  color="purple"
                  content={
                    <span className="inline-flex items-center">
                      <span className="mr-1">GST</span>
                      <span className="font-bold">
                        ({parseInt(gstPercentage).toFixed(0)}%)
                      </span>
                    </span>
                  }
                />
                <span>₹{parseInt(gstAmount).toFixed(2)}</span>
              </div>
            )}
            {percentageDiscount > 0 && (
              <div className="flex justify-between">
                <Badge
                  content={
                    <span className="inline-flex items-center">
                      <span className="mr-1">Discount</span>
                      <span className="font-bold">
                        ({invoiceData.discountRate}%)
                      </span>
                    </span>
                  }
                />
                <span>₹{totalDiscount}</span>
              </div>
            )}

            {flatDiscountData > 0 && (
              <div className="flex justify-between">
                <Badge
                  color="teal"
                  content={
                    <span className="inline-flex items-center">
                      Flat Discount
                    </span>
                  }
                />
                <span>₹{flatDiscountData}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>₹{totalBillingAmount}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-end space-x-5">
            {/* <Button color="primary" type="submit" variant="bordered">
            Review Invoice
          </Button> */}
            <Button
              color="primary"
              onClick={() => {
                handleReviewInvoice();
                saveAndDownload();
              }}
            >
              Save and Download
            </Button>
          </div>
        </form>

        {/* Customer Details Modal */}

        <CustomerDetailsModal
          initialValues={initialValues}
          isOpen={isOpen}
          onClose={onClose}
          handleSubmit={handleSubmit}
        />
        <InvoiceTemplate
          invoiceData={invoiceData}
          className="max-md:hidden visible"
        />
      </div>
        {/* <InvoicePdfData/> */}
    </>
  );
}
