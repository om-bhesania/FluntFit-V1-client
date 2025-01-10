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
import React, { useState } from "react";
import { CustomerDetails } from "./customerDetails";

interface InvoiceComponentType {
  items: any[];
  taxRate: number;
  discountRate: number;
  searchValue: string;
  filteredCustomers: any[];
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: string, value: any) => void;
  calculateSubtotal: () => number;
  calculateDiscount: (subtotal: number) => number;
  calculateTax: (subtotal: number, discount: number) => number;
  calculateTotal: () => number;
  handleInput: (value: string) => void;
  setTaxRate: React.Dispatch<React.SetStateAction<number>>;
  setDiscountRate: React.Dispatch<React.SetStateAction<number>>;
  productsData: any;
}

const InvoiceComponent: React.FC<InvoiceComponentType> = ({
  items,
  taxRate,
  discountRate,
  filteredCustomers,
  addItem,
  removeItem,
  updateItem,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  handleInput,
  setTaxRate,
  setDiscountRate,
  productsData,
}) => {
  const [prefilledData, setPrefilledData] = useState([]);
console.log("productsData", productsData[0]);
  return (
    <div className="container">
      <div className="flex justify-between mb-8 gap-4">
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
            onInput={(e) => handleInput((e.target as HTMLInputElement).value)}
            className="max-w-[400px]"
            placeholder="Search or create a new customer"
            variant="bordered"
            color="default"
          >
            {(item) => (
              <AutocompleteItem key={item.id} className="capitalize">
                {item.id === "new" ? (
                  <div className="flex items-center gap-2">
                    <Plus className="!h-4 !w-4 text-primary" />
                    {item.name}
                  </div>
                ) : (
                  item.name
                )}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <Table aria-label="Invoice items table">
            <TableHeader>
              <TableColumn>ITEM</TableColumn>
              <TableColumn>QTY</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {/* name */}
                  <TableCell className="w-[400px]">
                    <Select
                      variant="bordered"
                      placeholder="Select a product"
                      value={item.name}
                      onChange={(value) => {
                        console.log("value", value.target.options); 
                        // Find the selected product from the productsData array
                        const selectedProduct = productsData.find(
                          (product: any) => product.id === value.target.options
                        );
                        console.log("selectedProduct", selectedProduct);
                        // Update both name and price for the selected item
                        updateItem(item.id, "name", value);
                        updateItem(
                          item.id,
                          "price",
                          selectedProduct?.price 
                        ); // Safely assign price
                      }}
                      aria-label="Select product"
                    >
                      {productsData.map((product: any) => (
                        <SelectItem
                          className="max-w-[400px]"
                          key={product._id}
                          value={product.productName}
                        >
                          {product.productName}
                        </SelectItem>
                      ))}
                    </Select>
                  </TableCell>
                  {/* quantitiy */}
                  <TableCell>
                    <Input
                      variant="bordered"
                      color="default"
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", e.target.value)
                      }
                      className="max-w-[100px]"
                    />
                  </TableCell>
                  {/* price */}
                  <TableCell>
                    <Input
                      variant="bordered"
                      color="default"
                      type="number"
                      value={item.price.toString()} // Make sure item.price is a number
                      onChange={(e) =>
                        updateItem(item.id, "price", e.target.value)
                      }
                      className="max-w-[100px]"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">₹</span>
                        </div>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
              <span className="font-medium">Discount ({discountRate}%):</span>
              <span>₹{calculateDiscount(calculateSubtotal()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">GST ({taxRate}%):</span>
              <span>
                ₹
                {calculateTax(
                  calculateSubtotal(),
                  calculateDiscount(calculateSubtotal())
                ).toFixed(2)}
              </span>
            </div>
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
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">%</span>
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
  );
};

export default InvoiceComponent;
