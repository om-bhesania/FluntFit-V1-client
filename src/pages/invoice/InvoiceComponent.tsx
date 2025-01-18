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
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Badge from "../../components/badge/Badge";
import CustomerDetailsModal from "./customerDetails/CustomerDetailsModal";
import InvoiceTemplate from "./template/InvoiceTemplate";

interface InvoiceItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  price: number;
  gst: number;
  total: number;
}

interface InvoiceComponentType {
  // Keep all existing props
  items: InvoiceItem[];
  taxRate: number;
  discountRate: number;
  searchValue: string;
  filteredCustomers: any[];
  addItem: any;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: string, value: any) => void;
  calculateSubtotal: () => number;
  calculateDiscount: (subtotal: number) => number;
  calculateTax: (subtotal: number, discount: number) => number;
  calculateTotal: () => number;
  handleInput: (value: string) => void;
  setTaxRate: React.Dispatch<React.SetStateAction<number>>;
  setDiscountRate: React.Dispatch<React.SetStateAction<string>>;
  setCashDiscountRate: React.Dispatch<React.SetStateAction<number>>;
  productsData: any;
  calculateItemTotal: (quantity: number, price: number, gstRate: number) => any;
  handleCreateNewCustomer: () => void;
  initialValues: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  validationSchema: any;
  handleOpenModal: () => void;
  handleCustomerSearch: (data: any) => void;
  calculateCGST: any;
  calculateSGST: any;
  newCustomerData: Array<Text>;
  isNewCustomer: boolean;
  calculateCashDiscount: (data: any) => void;
  cashDiscountRate: any;
  setItems: any;
  productGSTRates: any;
  setProductGSTRates: any;
  handleProductSelect: (itemId: string, selectedProductId: string) => any;
  setNewCustomerData: any;
  customers: any;
}

const InvoiceComponent: React.FC<InvoiceComponentType> = ({
  items,
  taxRate,
  discountRate,
  cashDiscountRate,
  filteredCustomers,
  addItem,
  removeItem,
  updateItem,
  calculateSubtotal,
  calculateDiscount,
  calculateTotal,
  handleCustomerSearch,
  setTaxRate,
  setDiscountRate,
  setCashDiscountRate,
  productsData,
  calculateItemTotal,
  initialValues,
  isOpen,
  onClose,
  onSubmit,
  handleOpenModal,
  calculateCGST,
  calculateSGST,
  productGSTRates,
  handleProductSelect,
  setNewCustomerData,
  customers,
  searchValue,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>([]);
  // const [selectedProductsData, setSelectedProductsData] = useState<any>([]);
  const [invoiceData, setInvoiceData] = useState({
    items,
    taxRate,
    discountRate,
    cashDiscountRate,
    selectedCustomer,
    invoiceNumber: "",
    currentDate: new Date().toLocaleDateString(),
    cashier: "Administrator",
  });

  useEffect(() => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items,
      taxRate,
      discountRate,
      cashDiscountRate,
      selectedCustomer,
    }));
  }, [items, taxRate, discountRate, cashDiscountRate, selectedCustomer]);

  const getGSTColor = (gstRate: string) => {
    if (gstRate === "5%") {
      return "blue";
    } else if (gstRate === "12%") {
      return "red";
    } else if (gstRate === "18%") {
      return "orange";
    } else {
      return "gray";
    }
  };

  const getItemGSTRate = (itemId: string) => {
    return productGSTRates[itemId] || 0;
  };

  const getItemPrice = (itemId: string) => {
    const item = items.find((item) => item.id === itemId);
    return item ? item.price : 0;
  };

  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const lastInvoiceNumber =
      localStorage.getItem("lastInvoiceNumber") || `INV/${currentYear}/00001`;
    const [prefix, year, sequence] = lastInvoiceNumber.split("/");
    const newSequence = String(Number(sequence) + 1).padStart(5, "0");
    const newInvoiceNumber = `${prefix}/${year}/${newSequence}`;
    localStorage.setItem("lastInvoiceNumber", newInvoiceNumber);
    return newInvoiceNumber;
  };

  const getInitialInvoiceNumber = () => {
    const savedInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    return savedInvoiceNumber || generateInvoiceNumber();
  };

  const [invoiceNumber, setInvoiceNumber] = useState(getInitialInvoiceNumber());

  useEffect(() => {
    setInvoiceData((prevData) => ({
      ...prevData,
      invoiceNumber,
    }));
  }, [invoiceNumber]);

  const handleReviewInvoice = () => {
    const newInvoiceNumber = generateInvoiceNumber();
    setInvoiceNumber(newInvoiceNumber);
    setInvoiceData((prevData) => ({
      ...prevData,
      invoiceNumber: newInvoiceNumber,
    }));
    // Add any additional logic for reviewing the invoice
  };

  const handleSelectedProductDataForInvoice = (selectedId: string) => {
    const filteredProductData = productsData.find((item: any) => item._id === selectedId);
    console.log("filteredProductData", filteredProductData);
    // setSelectedProductsData();
  };
  return (
    <>
      <div className="flex justify-center max-md:flex-wrap">
        <div className="container">
          {/* Keep existing header section */}
          <div className="flex justify-between mb-8 gap-4 flex-wrap max-w-1/2">
            {/* ... (keep all the existing header content) */}
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium mb-2">Current Date:</h2>
              <Input
                variant="bordered"
                color="default"
                type="text"
                value={invoiceData.currentDate}
                isReadOnly
                className="w-full"
              />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium mb-2">Invoice Number:</h2>
              <Input
                variant="bordered"
                color="default"
                type="text"
                value={invoiceData.invoiceNumber}
                className="w-full"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium mb-2">Cashier:</h2>
              <Input
                variant="bordered"
                color="default"
                type="text"
                value={invoiceData.cashier}
                className="w-full"
              />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-sm font-medium mb-2">Customer:</h2>
              <Autocomplete
                items={filteredCustomers}
                onInput={(e) =>
                  handleCustomerSearch((e.target as HTMLInputElement).value)
                }
                onSelectionChange={(key) => {
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
                }}
                className="max-w-[400px]"
                placeholder="Search by name or phone number"
                variant="bordered"
                color="default"
                allowsCustomValue
              >
                {(item) => (
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

          <div className="flex gap-8">
            <div className="flex-1">
              <Table
                aria-label="Invoice items table"
                classNames={{
                  td: "p-0 py-2 pe-2",
                }}
              >
                <TableHeader>
                  <TableColumn className="!w-[400px] flex-shrink-0">
                    ITEM
                  </TableColumn>
                  <TableColumn>QTY</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>TOTAL</TableColumn>
                  <TableColumn>GST</TableColumn>
                  <TableColumn>ACTION</TableColumn>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="w-[400px]">
                        <Select
                          variant="bordered"
                          placeholder="Select a product"
                          value={item.productId || ""}
                          onChange={(e) => {
                            addItem(e.target.value);
                            handleProductSelect(item.id, e.target.value);
                            handleSelectedProductDataForInvoice(e.target.value);
                          }}
                          aria-label="Select product"
                        >
                          {productsData.map((product: any) => (
                            <SelectItem
                              className="max-w-[400px]"
                              color="primary"
                              key={product._id}
                              value={product._id}
                            >
                              {product.productName}
                            </SelectItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          variant="bordered"
                          color="default"
                          type="number"
                          value={item.quantity?.toString() || "1"}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          variant="bordered"
                          color="default"
                          type="number"
                          value={item.price.toString()}
                          onChange={() => getItemPrice(item.id)}
                          className="w-full"
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                ₹
                              </span>
                            </div>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-full flex items-center justify-center">
                          ₹
                          {calculateItemTotal(
                            item.quantity || 0,
                            item.price || 0,
                            productGSTRates[item.id] || 0
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-full flex items-center justify-center">
                          <Badge
                            content={getItemGSTRate(item.id)}
                            customClass="rounded-[5px]"
                            color={getGSTColor(getItemGSTRate(item.id))}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onClick={() => removeItem(item.id)}
                          className="w-full flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Keep existing buttons and summary section */}
              <Button
                color="default"
                variant="flat"
                className="mt-4"
                onClick={addItem}
              >
                <Plus className="text-primary !h-5 !w-5" /> Add Item
              </Button>

              <div className="mt-8 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Untaxed Amount:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="ml-4">
                  <div className="flex justify-between">
                    <span className="text-sm">- CGST:</span>
                    <span>
                      ₹
                      {calculateCGST(
                        calculateSubtotal(),
                        calculateDiscount(calculateSubtotal())
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">- SGST:</span>
                    <span>
                      ₹
                      {calculateSGST(
                        calculateSubtotal(),
                        calculateDiscount(calculateSubtotal())
                      ).toFixed(2)}
                    </span>
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
                      ₹{calculateDiscount(calculateSubtotal()).toFixed(2)}
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

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="w-[300px] space-y-4">
              <div>
                <h2 className="text-sm font-medium mb-2">GST:</h2>
                <Input
                  variant="bordered"
                  color="default"
                  type="number"
                  value={taxRate.toString()}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">%</span>
                    </div>
                  }
                />
              </div>
              <div>
                <h2 className="text-sm font-medium mb-2">Discount rate:</h2>
                <Input
                  variant="bordered"
                  color="default"
                  type="number"
                  value={discountRate.toString()}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">%</span>
                    </div>
                  }
                />
              </div>
              <div>
                <h2 className="text-sm font-medium mb-2">Flat Discount:</h2>
                <Input
                  variant="bordered"
                  color="default"
                  type="number"
                  value={cashDiscountRate.toString()}
                  onChange={(e) => setCashDiscountRate(Number(e.target.value))}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">₹</span>
                    </div>
                  }
                />
              </div>
              <Button
                color="primary"
                className="w-full"
                onClick={handleReviewInvoice}
              >
                Review Invoice
              </Button>
            </div>
          </div>
        </div>
        <CustomerDetailsModal
          initialValues={initialValues}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={onSubmit}
        />
        <InvoiceTemplate
          className="!max-w-[1/2]"
          items={items}
          taxRate={taxRate}
          discountRate={Number(discountRate)}
          cashDiscountRate={cashDiscountRate}
          customerData={selectedCustomer}
          calculateSubtotal={calculateSubtotal}
          calculateDiscount={calculateDiscount}
          calculateCGST={calculateCGST}
          calculateSGST={calculateSGST}
          calculateTotal={calculateTotal}
          invoiceData={invoiceData}
        />
      </div>
    </>
  );
};

export default InvoiceComponent;
