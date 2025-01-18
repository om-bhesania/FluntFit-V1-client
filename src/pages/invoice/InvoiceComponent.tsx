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
import React from "react";
import Badge from "../../components/badge/Badge";
import CustomerDetailsModal from "./customerDetails/CustomerDetailsModal";

interface InvoiceItem {
  id: string;
  name: string;
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
  calculateItemTotal: (quantity: any, price: any) => any;
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
}) => {

  // Function to get GST rate for a specific item
  const getItemGSTRate = (itemId: string) => {
    return productGSTRates[itemId] || 0;
  };

  // Function to get price for a specific item
  const getItemPrice = (itemId: string) => {
    console.log("itemId", itemId);
    const item = items.find((item) => item.id === itemId);
    return item ? item.price : 0;
  };
  console.log(items.map((item) => item));
  return (
    <>
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
              value={new Date().toLocaleDateString()}
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
              defaultValue="1"
              className="w-full"
            />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-sm font-medium mb-2">Cashier:</h2>
            <Input
              variant="bordered"
              color="default"
              type="text"
              defaultValue="Administrator"
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
                }
              }}
              className="max-w-[400px]"
              placeholder="Search or create a new customer"
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
                          console.log(e.target.value);
                          addItem(e.target.value);
                          handleProductSelect(item.id, e.target.value);
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
                          item.price || 0
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full flex items-center justify-center">
                        {getItemGSTRate(item.id)}
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
            <Button color="primary" className="w-full">
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
    </>
  );
};

export default InvoiceComponent;
