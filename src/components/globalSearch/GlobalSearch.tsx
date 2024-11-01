import { motion } from "framer-motion";
import { useState } from "react";

interface GlobalSearchProps {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isSearchOpen,
  toggleSearch,
}) => {
  return (
    <>
      {isSearchOpen && (
        <motion.div
          className="max-md:fixed max-md:h-screen max-md:inset-0 max-md:bg-black/30 max-md:z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleSearch}
        />
      )}
      <motion.input
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isSearchOpen ? 200 : 0,
          height: isSearchOpen ? 40 : 0,
          opacity: isSearchOpen ? 1 : 0,
        }}
        transition={{ type: "slide", stiffness: 1000 }}
        className={`border-accent border-2 rounded-md pl-1.5 isDesktop max-md:absolute max-md:-left-4 max-md:transform max-md:-translate-x-1/2 max-md:top-0 max-md:mt-4 max-md:z-50 max-md:p-2 `}
        placeholder="Search"
        autoSave="on"
      />
    </>
  );
};

export default GlobalSearch;
