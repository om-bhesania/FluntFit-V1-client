import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import React from "react";

interface AddToCartCardProps {
  title: string; 
  price: number;
  imageUrl: string;
  isLogin?: boolean;
}

const AddToCartCard: React.FC<AddToCartCardProps> = ({
  title,
  isLogin = false,
  price,
  imageUrl,
}) => {
  return (
    <motion.div
      className="bg-background rounded-lg overflow-hidden transition-shadow duration-300"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative w-auto">
        {isLogin && (
          <div className="absolute top-2 right-2">
            <button className="text-red-500 hover:text-red-700 bg-background/90 rounded-full p-2">
              <Heart size={20} />
            </button>
          </div>
        )}
        <img
          src={imageUrl}
          alt={title}
          className="md:max-h-[250px] max-h-[200px] w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="md:text-lg text-sm font-semibold">{title}</h2>
            <ShoppingCart className="mr-2 cursor-pointer flex-shrink-0 text-sm md:h-6 h-5 md:w-6 w-5 text-primary self-start" />
          </div>
          <p className="text-md max-sm:text-sm font-bold">₹{price.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AddToCartCard;
