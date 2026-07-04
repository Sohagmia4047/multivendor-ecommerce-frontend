import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import vendorService from "../utils/vendorService";

const VendorDetails = () => {
  const { vid } = useParams();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await vendorService.getVendorDetails(vid);
        setVendor(data.vendor);
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vid]);

  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="py-20 text-center text-lg font-semibold">
          Loading Vendor...
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="px-3 sm:px-4 md:px-8 lg:px-12 py-6">

        {/* HEADER */}
        <div className="relative rounded-3xl overflow-hidden h-55 sm:h-65 md:h-80">
          <img
            src={vendor?.image}
            className="w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-12">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
              <img
                src={vendor?.image}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white object-cover"
                alt=""
              />

              <div className="text-white">
                <h1 className="text-xl sm:text-3xl md:text-5xl font-bold">
                  {vendor?.title}
                </h1>

                <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                  <FaStar />
                  <span className="text-white font-semibold">4.8 Rating</span>
                </div>

                <div className="mt-3 space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{vendor?.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhoneAlt />
                    <span>{vendor?.contact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Vendor Products
          </h2>

          <p className="text-gray-500 text-sm">
            {products.length} Products Found
          </p>
        </div>

        {/* GRID (XL=4) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

          {products.map((product) => {
            const oldPrice = Number(product.old_price || product.price + 50);
            const newPrice = Number(product.price);
            const discount = calculateDiscount(oldPrice, newPrice);

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >

                {/* CONTENT ROW (IMAGE LEFT FIXED) */}
                <div className="flex gap-3 p-3">

                  {/* LEFT IMAGE */}
                  <div className="relative w-24 sm:w-28 shrink-0">
                    <div className="absolute top-1 left-1 bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-md shadow z-10">
                      {discount}% OFF
                    </div>

                    <img
                      src={product.image}
                      className="w-full h-24 sm:h-28 object-cover rounded-xl"
                      alt=""
                    />
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>
                      <p className="text-[10px] sm:text-xs text-green-600 font-medium">
                        {product.category?.title}
                      </p>

                      <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                        {product.title}
                      </h2>

                      <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>

                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* PRICE + BUTTON */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-green-600">
                          ${newPrice}
                        </span>

                        <span className="text-xs text-gray-400 line-through">
                          ${oldPrice}
                        </span>
                      </div>

                      <button className="mt-2 w-full flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-xs sm:text-sm font-semibold transition">
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </PublicLayout>
  );
};

export default VendorDetails;