import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const TopBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout: any = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        const currentScrollY = window.pageYOffset;
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <div
      className={clsx(
        " w-full z-50 shadow-md p-1 bg-gradient-to-r from-accent/80 via-primary to-accent/80",
        "transition-transform duration-500 max-md:hidden",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center justify-center max-w-7xl mx-auto px-4 text-white">
        Special Winter Sale is live now
      </div>
    </div>
  );
};

export default TopBar;
