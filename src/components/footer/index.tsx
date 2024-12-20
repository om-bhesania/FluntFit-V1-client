import { Facebook, Instagram } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

const index: React.FC = () => {
  return (
    <footer className="bg-black text-secondary py-8 pb-2">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0 flex items-start gap-4">
            <Logo className="h-[170px]" />
            <div className="">
              <p className="mb-2">MixBunch Clothing Store</p>
              <p className="mb-2 max-w-[450px]">
                Discover the latest trends and styles at MixBunch Clothing
                Store, where fashion meets comfort. MixBunch offers a wide
                range of apparel that combines modern aesthetics with
                unparalleled comfort, ensuring you look and feel your best every
                day.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
            <div>
              <h5 className="font-bold text-lg mb-2">Company</h5>
              <ul>
                <li className="mb-2">
                  <Link to="/about" className="hover:text-accent">
                    About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/careers" className="hover:text-accent">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-accent">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-2">Help</h5>
              <ul>
                <li className="mb-2">
                  <Link to="/faq" className="hover:text-accent">
                    FAQ
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/returns" className="hover:text-accent">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-accent">
                    Shipping
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-2">Follow Us</h5>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    to="https://facebook.com"
                    className="hover:text-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook />
                  </Link>
                </li>

                <li>
                  <Link
                    to="https://instagram.com"
                    className="hover:text-accent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-md">Privacy Policy | Terms & Conditions</p>
          <p className="text-bg text-sm mt-2">
            ©{" "}
            {new Date().getFullYear() === 2024
              ? new Date().getFullYear()
              : `2021 - ${new Date().getFullYear()}`}{" "}
            <Link to={'/'}>MixBunch</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export { index as Footer };
