import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  image?: string;
  redirectTo: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image = "https://dummyimage.com/250x300",
  redirectTo,
}) => {
  const router = useNavigate();

  const handleCardClick = () => {
    router(redirectTo);
  };

  return (
    <div className="">
      <motion.div
        onClick={handleCardClick}
        className="w-[300px] h-[400px] relative rounded-md shadow-lg cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover rounded-md"
        />

        <motion.div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white text-lg font-semibold">{name}</h3>
        </motion.div> 
        <div className="md:hidden visible text-center mt-3 text-lg font-medium">{name}</div>
      </motion.div>
    </div>
  );
};

export default CategoryCard;
