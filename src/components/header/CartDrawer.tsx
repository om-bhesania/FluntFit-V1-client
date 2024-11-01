import { Badge, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function CartDrawer({
  isDrawerOpen,
  toggleDrawer,
}: {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 100.0; // Example price per item
  const GST_RATE = 0.18; // 18% GST

  const subtotal = pricePerItem * quantity;
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  // Disable body scroll when the drawer is open
  if (isDrawerOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return (
    <>
      <motion.div
        className="absolute top-0 bottom-0 left-[-290px] right-0 bg-black/30 z-40 h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDrawerOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={toggleDrawer}
        style={{ display: isDrawerOpen ? "block" : "none" }}
      />
      <motion.div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform z-50 duration-300 ease-in-out transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "320px", maxWidth: "90vw" }}
      >
        <div className="bg-background h-screen">
          <div className="flex items-center  justify-between p-4 border-b border-gray-200">
            <div
              onClick={toggleDrawer}
              className="cursor-pointer text-lg font-semibold"
            >
              ✕
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mx-auto">
              Shopping Cart
            </h2>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto lg:h-[calc(100vh-320px)] h-[calc(100vh-370px)]">
            {Array.from({ length: 3 }).map((_, index) => (
              <Badge
                key={index}
                onClick={() => alert("Remove Product")}
                content={<div className="text-[8px]">✕</div>}
                color="default"
                className="h-6 w-6 cursor-pointer"
              >
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg">
                  <img
                    src="https://placeholder.pics/svg/80x80"
                    alt="Product"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1 ml-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <h3 className="text-lg font-medium text-gray-800">
                          Product Name
                        </h3>
                        <p className="font-semibold text-gray-600 text-sm">
                          ₹{pricePerItem.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center flex-col">
                        <button
                          onClick={decreaseQuantity}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          className="w-12 text-center rounded-md border border-gray-300 focus:outline-none"
                        />
                        <button
                          onClick={increaseQuantity}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Badge>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 relative -bottom-[25px]">
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium text-gray-800">
                Subtotal:
              </span>
              <span className="font-semibold text-gray-600">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm font-medium text-gray-800">
                GST (18%):
              </span>
              <span className="font-semibold text-gray-600">
                ₹{gst.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-t border-gray-300">
              <span className="text-lg font-semibold text-gray-800">
                Total:
              </span>
              <span className="text-lg font-semibold text-gray-600">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <Button
              onPress={() => alert("Proceed to Checkout")}
              onClick={() => alert("Proceed to Checkout")}
              variant="shadow"
              color="primary"
              className="w-full mt-4"
            >
              Checkout
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default CartDrawer;
