import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Svg404NotFound } from "../../assets/images/Icon";

function PageNotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="-mt-6 flex flex-col items-center py-6 h-screen justify-center bg-background text-primary  space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Svg404NotFound className="h-[300px]" />
      </motion.div>
      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold font-heading">404 Page Not Found</h1>
        <p className="text-secondary mt-4 font-body">
          Sorry, the page you are looking for does not exist.
        </p>
      </motion.div>
      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <Button color="success" onClick={handleGoBack} variant="bordered">
          Go Back
        </Button>
        <Button color="primary" onClick={handleGoHome} variant="shadow">
          Home
        </Button>
      </div>
    </div>
  );
}

export default PageNotFound;
