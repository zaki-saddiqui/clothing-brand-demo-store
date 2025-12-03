import React from "react";

const Footer = () => {
  return (
    <>
      <div className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Your Brand — All rights reserved
          </div>
          <div className="flex gap-4 text-sm">
            <a href="/shipping" className="text-gray-600">
              Shipping
            </a>
            <a href="/returns" className="text-gray-600">
              Returns
            </a>
            <a href="/privacy" className="text-gray-600">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
